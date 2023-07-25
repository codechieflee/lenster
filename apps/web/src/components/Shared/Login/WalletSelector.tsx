import SwitchNetwork from '@components/Shared/SwitchNetwork';
import { KeyIcon } from '@heroicons/react/outline';
import { XCircleIcon } from '@heroicons/react/solid';
import { Errors } from '@lenster/data/errors';
import { Localstorage } from '@lenster/data/storage';
import { AUTH } from '@lenster/data/tracking';
import {
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useUserProfilesLazyQuery
} from '@lenster/lens';
import getWalletDetails from '@lenster/lib/getWalletDetails';
import { Button, Spinner } from '@lenster/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CHAIN_ID } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import { useIsMounted } from 'usehooks-ts';
import type { Connector } from 'wagmi';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSignMessage
} from 'wagmi';

interface WalletSelectorProps {
  setHasConnected: Dispatch<boolean>;
  setHasProfile: Dispatch<boolean>;
}

const WalletSelector: FC<WalletSelectorProps> = ({
  setHasConnected,
  setHasProfile
}) => {
  const setProfiles = useAppStore((state) => state.setProfiles);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );
  const [isLoading, setIsLoading] = useState(false);

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const isMounted = useIsMounted();
  const { chain } = useNetwork();
  const { connectors, error, connectAsync } = useConnect({ chainId: CHAIN_ID });
  const { disconnect } = useDisconnect();
  const { address, connector: activeConnector } = useAccount();
  const { signMessageAsync } = useSignMessage({ onError });
  const [loadChallenge, { error: errorChallenge }] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache'
  });
  const [authenticate, { error: errorAuthenticate }] =
    useAuthenticateMutation();
  const [getProfiles, { error: errorProfiles }] = useUserProfilesLazyQuery();

  const onConnect = async (connector: Connector) => {
    try {
      const account = await connectAsync({ connector });
      if (account) {
        setHasConnected(true);
      }
      Leafwatch.track(AUTH.CONNECT_WALLET, {
        wallet: connector.name.toLowerCase()
      });
    } catch {}
  };

  const handleSign = async () => {
    let keepModal = false;
    try {
      setIsLoading(true);
      // Get challenge
      const challenge = await loadChallenge({
        variables: { request: { address } }
      });

      if (!challenge?.data?.challenge?.text) {
        return toast.error(Errors.SomethingWentWrong);
      }

      // Get signature
      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text
      });

      // Auth user and set cookies
      const auth = await authenticate({
        variables: { request: { address, signature } }
      });
      localStorage.setItem(
        Localstorage.AccessToken,
        auth.data?.authenticate.accessToken
      );
      localStorage.setItem(
        Localstorage.RefreshToken,
        auth.data?.authenticate.refreshToken
      );

      // Get authed profiles
      const { data: profilesData } = await getProfiles({
        variables: { request: { ownedBy: [address] } }
      });

      if (profilesData?.profiles?.items?.length === 0) {
        setHasProfile(false);
        keepModal = true;
      } else {
        const profiles: any = profilesData?.profiles?.items
          ?.slice()
          ?.sort((a, b) => Number(a.id) - Number(b.id))
          ?.sort((a, b) =>
            a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
          );
        const currentProfile = profiles[0];
        setProfiles(profiles);
        setCurrentProfile(currentProfile);
        setProfileId(currentProfile.id);
      }
      Leafwatch.track(AUTH.SIWL);
    } catch {
    } finally {
      setIsLoading(false);
      if (!keepModal) {
        setShowAuthModal(false);
      }
    }
  };

  return activeConnector?.id ? (
    <div className="space-y-3">
      <div className="space-y-2.5">
        {chain?.id === CHAIN_ID ? (
          <Button
            disabled={isLoading}
            icon={
              isLoading ? (
                <Spinner className="mr-0.5" size="xs" />
              ) : (
                <img
                  className="mr-0.5 h-4 w-4"
                  height={16}
                  width={16}
                  src="/lens.png"
                  alt="Lens Logo"
                />
              )
            }
            onClick={handleSign}
          >
            <Trans>Sign-In with Lens</Trans>
          </Button>
        ) : (
          <SwitchNetwork />
        )}
        <button
          onClick={() => {
            disconnect?.();
            Leafwatch.track(AUTH.CHANGE_WALLET);
          }}
          className="flex items-center space-x-1 text-sm underline"
        >
          <KeyIcon className="h-4 w-4" />
          <div>
            <Trans>Change wallet</Trans>
          </div>
        </button>
      </div>
      {(errorChallenge || errorAuthenticate || errorProfiles) && (
        <div className="flex items-center space-x-1 font-bold text-red-500">
          <XCircleIcon className="h-5 w-5" />
          <div>{Errors.SomethingWentWrong}</div>
        </div>
      )}
    </div>
  ) : (
    <div className="inline-block w-full space-y-3 overflow-hidden text-left align-middle">
      {connectors.map((connector) => {
        return (
          <button
            type="button"
            key={connector.id}
            className={clsx(
              {
                'hover:bg-gray-100 dark:hover:bg-gray-700':
                  connector.id !== activeConnector?.id
              },
              'flex w-full items-center justify-between space-x-2.5 overflow-hidden rounded-xl border px-4 py-3 outline-none dark:border-gray-700'
            )}
            onClick={() => onConnect(connector)}
            disabled={
              isMounted()
                ? !connector.ready || connector.id === activeConnector?.id
                : false
            }
          >
            <span>
              {isMounted()
                ? connector.id === 'injected'
                  ? t`Browser Wallet`
                  : getWalletDetails(connector.name).name
                : getWalletDetails(connector.name).name}
              {isMounted() ? !connector.ready && ' (unsupported)' : ''}
            </span>
            <img
              src={getWalletDetails(connector.name).logo}
              draggable={false}
              className="h-6 w-6"
              height={24}
              width={24}
              alt={connector.id}
            />
          </button>
        );
      })}
      {error?.message ? (
        <div className="flex items-center space-x-1 text-red-500">
          <XCircleIcon className="h-5 w-5" />
          <div>{error?.message ?? t`Failed to connect`}</div>
        </div>
      ) : null}
    </div>
  );
};

export default WalletSelector;
