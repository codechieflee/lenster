import { LensHubProxy } from '@abis/LensHubProxy';
import { useMutation } from '@apollo/client';
import ChooseFile from '@components/Shared/ChooseFile';
import IndexStatus from '@components/Shared/IndexStatus';
import { Button } from '@components/UI/Button';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import type { MediaSet, Mutation, NftImage, Profile } from '@generated/types';
import {
  CreateSetProfileImageUriTypedDataDocument,
  CreateSetProfileImageUriViaDispatcherDocument
} from '@generated/types';
import { PencilIcon } from '@heroicons/react/outline';
import getIPFSLink from '@lib/getIPFSLink';
import getSignature from '@lib/getSignature';
import imagekitURL from '@lib/imagekitURL';
import { Leafwatch } from '@lib/leafwatch';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import uploadMediaToIPFS from '@lib/uploadMediaToIPFS';
import type { ChangeEvent, FC } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LENSHUB_PROXY, RELAY_ON, SIGN_WALLET } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface Props {
  profile: Profile & { picture: MediaSet & NftImage };
}

const Picture: FC<Props> = ({ profile }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [avatar, setAvatar] = useState('');
  const [uploading, setUploading] = useState(false);
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const onCompleted = () => {
    toast.success('Avatar updated successfully!');
    Leafwatch.track(SETTINGS.PROFILE.SET_PICTURE);
  };

  const {
    data: writeData,
    isLoading: writeLoading,
    error,
    write
  } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'setProfileImageURIWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  useEffect(() => {
    if (profile?.picture?.original?.url || profile?.picture?.uri) {
      setAvatar(profile?.picture?.original?.url ?? profile?.picture?.uri);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { broadcast, data: broadcastData, loading: broadcastLoading } = useBroadcast({ onCompleted });
  const [createSetProfileImageURITypedData, { loading: typedDataLoading }] = useMutation<Mutation>(
    CreateSetProfileImageUriTypedDataDocument,
    {
      onCompleted: async ({ createSetProfileImageURITypedData }) => {
        try {
          const { id, typedData } = createSetProfileImageURITypedData;
          const { profileId, imageURI, deadline } = typedData.value;
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { v, r, s } = splitSignature(signature);
          const sig = { v, r, s, deadline };
          const inputStruct = {
            profileId,
            imageURI,
            sig
          };

          setUserSigNonce(userSigNonce + 1);
          if (!RELAY_ON) {
            return write?.({ recklesslySetUnpreparedArgs: inputStruct });
          }

          const {
            data: { broadcast: result }
          } = await broadcast({ request: { id, signature } });

          if ('reason' in result) {
            write?.({ recklesslySetUnpreparedArgs: inputStruct });
          }
        } catch {}
      },
      onError
    }
  );

  const [createSetProfileImageURIViaDispatcher, { data: dispatcherData, loading: dispatcherLoading }] =
    useMutation(CreateSetProfileImageUriViaDispatcherDocument, { onCompleted, onError });

  const handleUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setUploading(true);
    try {
      const attachment = await uploadMediaToIPFS(evt.target.files);
      if (attachment[0]?.item) {
        setAvatar(attachment[0].item);
      }
    } finally {
      setUploading(false);
    }
  };

  const editPicture = (avatar?: string) => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    if (!avatar) {
      return toast.error("Avatar can't be empty!");
    }

    const request = {
      profileId: currentProfile?.id,
      url: avatar
    };

    if (currentProfile?.dispatcher?.canUseRelay) {
      createSetProfileImageURIViaDispatcher({ variables: { request } });
    } else {
      createSetProfileImageURITypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request
        }
      });
    }
  };

  const isLoading = typedDataLoading || dispatcherLoading || signLoading || writeLoading || broadcastLoading;
  const txHash =
    writeData?.hash ??
    broadcastData?.broadcast?.txHash ??
    (dispatcherData?.createSetProfileImageURIViaDispatcher.__typename === 'RelayerResult' &&
      dispatcherData?.createSetProfileImageURIViaDispatcher.txHash);

  return (
    <>
      <div className="space-y-1.5">
        {error && <ErrorMessage className="mb-3" title="Transaction failed!" error={error} />}
        <div className="space-y-3">
          {avatar && (
            <div>
              <img
                className="w-60 h-60 rounded-lg"
                height={240}
                width={240}
                src={imagekitURL(getIPFSLink(avatar), 'avatar')}
                alt={avatar}
              />
            </div>
          )}
          <div className="flex items-center space-x-3">
            <ChooseFile onChange={(evt: ChangeEvent<HTMLInputElement>) => handleUpload(evt)} />
            {uploading && <Spinner size="sm" />}
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Button
          className="ml-auto"
          type="submit"
          disabled={isLoading}
          onClick={() => editPicture(avatar)}
          icon={isLoading ? <Spinner size="xs" /> : <PencilIcon className="w-4 h-4" />}
        >
          Save
        </Button>
        {txHash ? <IndexStatus txHash={txHash} /> : null}
      </div>
    </>
  );
};

export default Picture;
