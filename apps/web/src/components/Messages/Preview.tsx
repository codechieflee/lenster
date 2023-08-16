import { BadgeCheckIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import type { Profile } from '@lenster/lens';
import formatAddress from '@lenster/lib/formatAddress';
import formatHandle from '@lenster/lib/formatHandle';
import getAvatar from '@lenster/lib/getAvatar';
import getStampFyiURL from '@lenster/lib/getStampFyiURL';
import hasMisused from '@lenster/lib/hasMisused';
import sanitizeDisplayName from '@lenster/lib/sanitizeDisplayName';
import { Image } from '@lenster/ui';
import { formatTime, getTimeFromNow } from '@lib/formatTime';
import isVerified from '@lib/isVerified';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import { ContentTypeText } from '@xmtp/xmtp-js';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';
import type { RemoteAttachment } from 'xmtp-content-type-remote-attachment';
import { ContentTypeRemoteAttachment } from 'xmtp-content-type-remote-attachment';

interface PreviewProps {
  ensName?: string;
  profile?: Profile;
  message?: DecodedMessage;
  conversationKey: string;
  isSelected: boolean;
}

interface MessagePreviewProps {
  message: DecodedMessage;
}

const MessagePreview: FC<MessagePreviewProps> = ({ message }) => {
  if (message.contentType.sameAs(ContentTypeText)) {
    return <span>{message.content}</span>;
  } else if (message.contentType.sameAs(ContentTypeRemoteAttachment)) {
    const remoteAttachment: RemoteAttachment = message.content;
    return <span>{remoteAttachment.filename}</span>;
  } else {
    return <span>''</span>;
  }
};

const Preview: FC<PreviewProps> = ({
  ensName,
  profile,
  message,
  conversationKey,
  isSelected
}) => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const address = currentProfile?.ownedBy;

  const onConversationSelected = (profileId: string) => {
    router.push(profileId ? `/messages/${conversationKey}` : '/messages');
  };

  const url = (ensName && getStampFyiURL(conversationKey?.split('/')[0])) ?? '';

  return (
    message?.content && (
      <div
        className={clsx(
          'cursor-pointer py-3 hover:bg-gray-100 dark:hover:bg-gray-800',
          isSelected && 'bg-gray-50 dark:bg-gray-800'
        )}
        onClick={() =>
          onConversationSelected(profile?.id ? profile.id : conversationKey)
        }
        aria-hidden="true"
      >
        <div className="flex space-x-3 overflow-hidden px-5">
          <Image
            src={ensName ? url : getAvatar(profile)}
            loading="lazy"
            className="h-10 w-10 rounded-full border bg-gray-200 dark:border-gray-700"
            height={40}
            width={40}
            alt={formatHandle(profile?.handle)}
          />
          <div className="grow overflow-hidden">
            <div className="flex justify-between space-x-1">
              <div className="flex items-center gap-1 overflow-hidden">
                <div className="text-md truncate">
                  {profile?.name
                    ? sanitizeDisplayName(profile?.name) ??
                      formatHandle(profile.handle)
                    : ensName ?? formatAddress(conversationKey?.split('/')[0])}
                </div>
                {isVerified(profile?.id) && (
                  <BadgeCheckIcon className="text-brand h-4 w-4 min-w-fit" />
                )}
                {hasMisused(profile?.id) && (
                  <ExclamationCircleIcon className="h-4 w-4 min-w-fit text-red-500" />
                )}
              </div>
              {message?.sent && (
                <span
                  className="lt-text-gray-500 shrink-0 pt-0.5 text-xs"
                  title={formatTime(message.sent)}
                >
                  {getTimeFromNow(message.sent)}
                </span>
              )}
            </div>
            <span className="lt-text-gray-500 line-clamp-1 break-all text-sm">
              {address === message?.senderAddress && 'You: '}
              <MessagePreview message={message} />
            </span>
          </div>
        </div>
      </div>
    )
  );
};

export default Preview;
