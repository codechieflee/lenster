import { LensHubProxy } from '@abis/LensHubProxy';
import { gql, useMutation } from '@apollo/client';
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import UserProfile from '@components/Shared/UserProfile';
import { Button } from '@components/UI/Button';
import { Card, CardBody } from '@components/UI/Card';
import { Modal } from '@components/UI/Modal';
import { Spinner } from '@components/UI/Spinner';
import { WarningMessage } from '@components/UI/WarningMessage';
import Seo from '@components/utils/Seo';
import { CreateBurnProfileBroadcastItemResult } from '@generated/types';
import { ExclamationIcon, TrashIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import omit from '@lib/omit';
import splitSignature from '@lib/splitSignature';
import Cookies from 'js-cookie';
import React, { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { APP_NAME, ERROR_MESSAGE, LENSHUB_PROXY, SIGN_WALLET } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { PAGEVIEW, SETTINGS } from 'src/tracking';
import { useContractWrite, useDisconnect, useSignTypedData } from 'wagmi';

import Sidebar from '../Sidebar';

const CREATE_BURN_PROFILE_TYPED_DATA_MUTATION = gql`
  mutation CreateBurnProfileTypedData($options: TypedDataOptions, $request: BurnProfileRequest!) {
    createBurnProfileTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          BurnWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          tokenId
        }
      }
    }
  }
`;

const DeleteSettings: FC = () => {
  useEffect(() => {
    Mixpanel.track(PAGEVIEW.SETTINGS.DELETE);
  }, []);

  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const setIsConnected = useAppPersistStore((state) => state.setIsConnected);
  const isAuthenticated = useAppPersistStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useAppPersistStore((state) => state.setIsAuthenticated);
  const currentUser = useAppPersistStore((state) => state.currentUser);
  const setCurrentUser = useAppPersistStore((state) => state.setCurrentUser);

  const { disconnect } = useDisconnect();
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message);
      Mixpanel.track(SETTINGS.DELETE, { result: 'typed_data_error', error: error?.message });
    }
  });

  const onCompleted = () => {
    Mixpanel.track(SETTINGS.DELETE);
    setIsAuthenticated(false);
    setIsConnected(false);
    setCurrentUser(null);
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    localStorage.removeItem('lenster.store');
    if (disconnect) disconnect();
    location.href = '/';
  };

  const { isLoading: writeLoading, write } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'burnWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess() {
      onCompleted();
    },
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message);
    }
  });

  const [createBurnProfileTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_BURN_PROFILE_TYPED_DATA_MUTATION,
    {
      async onCompleted({
        createBurnProfileTypedData
      }: {
        createBurnProfileTypedData: CreateBurnProfileBroadcastItemResult;
      }) {
        const { typedData } = createBurnProfileTypedData;
        const { deadline } = typedData?.value;

        try {
          const signature = await signTypedDataAsync({
            domain: omit(typedData?.domain, '__typename'),
            types: omit(typedData?.types, '__typename'),
            value: omit(typedData?.value, '__typename')
          });
          setUserSigNonce(userSigNonce + 1);
          const { tokenId } = typedData?.value;
          const { v, r, s } = splitSignature(signature);
          const sig = { v, r, s, deadline };

          write?.({ recklesslySetUnpreparedArgs: [tokenId, sig] });
        } catch (error) {}
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE);
      }
    }
  );

  const handleDelete = () => {
    if (!isAuthenticated) return toast.error(SIGN_WALLET);

    createBurnProfileTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: { profileId: currentUser?.id }
      }
    });
  };

  const isDeleting = typedDataLoading || signLoading || writeLoading;

  if (!currentUser) return <Custom404 />;

  return (
    <GridLayout>
      <Seo title={`Delete Profile • ${APP_NAME}`} />
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardBody className="space-y-5">
            <UserProfile profile={currentUser} />
            <div className="text-lg font-bold text-red-500">This will deactivate your account</div>
            <p>
              Deleting your account is permanent. All your data will be wiped out immediately and you
              won&rsquo;t be able to get it back.
            </p>
            <div className="text-lg font-bold">What else you should know</div>
            <div className="text-sm text-gray-500 divide-y dark:divide-gray-700">
              <p className="pb-3">
                You cannot restore your {APP_NAME} account if it was accidentally or wrongfully deleted.
              </p>
              <p className="py-3">
                Some account information may still be available in search engines, such as Google or Bing.
              </p>
              <p className="py-3">Your @handle will be released immediately after deleting the account.</p>
            </div>
            <Button
              variant="danger"
              icon={isDeleting ? <Spinner variant="danger" size="xs" /> : <TrashIcon className="w-5 h-5" />}
              disabled={isDeleting}
              onClick={() => setShowWarningModal(true)}
            >
              {isDeleting ? 'Deleting...' : 'Delete your account'}
            </Button>
            <Modal
              title="Danger Zone"
              icon={<ExclamationIcon className="w-5 h-5 text-red-500" />}
              show={showWarningModal}
              onClose={() => setShowWarningModal(false)}
            >
              <div className="p-5 space-y-3">
                <WarningMessage
                  title="Are you sure?"
                  message={
                    <div className="leading-6">
                      Confirm that you have read all consequences and want to delete your account anyway
                    </div>
                  }
                />
                <Button
                  variant="danger"
                  icon={<TrashIcon className="w-5 h-5" />}
                  onClick={() => {
                    setShowWarningModal(false);
                    handleDelete();
                  }}
                >
                  Yes, delete my account
                </Button>
              </div>
            </Modal>
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default DeleteSettings;
