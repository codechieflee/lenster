import { ClockIcon, EmojiSadIcon } from '@heroicons/react/outline';
import { CheckIcon, ExclamationIcon } from '@heroicons/react/solid';
import type { Profile } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import getAvatar from '@lenster/lib/getAvatar';
import getStampFyiURL from '@lenster/lib/getStampFyiURL';
import { Card, Image } from '@lenster/ui';
import {
  formatDate,
  formatTime,
  getTimeFromNow,
  isOnSameDay
} from '@lib/formatTime';
import { Trans } from '@lingui/macro';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { memo, useEffect, useRef } from 'react';
import { useInView } from 'react-cool-inview';
import {
  type FailedMessage,
  isQueuedMessage,
  type PendingMessage
} from 'src/hooks/useSendOptimisticMessage';
import { useMessageStore } from 'src/store/message';

import MessageContent from './MessageContent';

interface MessageTileProps {
  url?: string;
  message: DecodedMessage | PendingMessage | FailedMessage;
  profile?: Profile;
  currentProfile?: Profile | null;
}

const MessageTile: FC<MessageTileProps> = ({
  url,
  message,
  profile,
  currentProfile
}) => {
  const address = currentProfile?.ownedBy;

  // icon to display to indicate status of message
  let statusIcon: JSX.Element | null = null;
  if (isQueuedMessage(message)) {
    switch (message.status) {
      case 'failed':
        statusIcon = <ExclamationIcon width={14} height={14} />;
        break;
      case 'pending':
        statusIcon = <ClockIcon width={14} height={14} />;
        break;
    }
  } else {
    // message has been successfully sent
    statusIcon = <CheckIcon width={14} height={14} />;
  }

  // content to display to indicate message status
  let statusContent: ReactNode = null;
  if (isQueuedMessage(message)) {
    switch (message.status) {
      case 'failed':
        statusContent = (
          <span className="flex items-center gap-1 text-red-500">
            <Trans>Not delivered</Trans> &bull;
            <span className="cursor-pointer underline" onClick={message.retry}>
              <Trans>Retry</Trans>
            </span>
            &bull;
            <span className="cursor-pointer underline" onClick={message.cancel}>
              <Trans>Cancel</Trans>
            </span>
          </span>
        );
        break;
      case 'pending':
        statusContent = getTimeFromNow(message.sent);
        break;
    }
  } else {
    // message has been successfully sent
    statusContent = getTimeFromNow(message.sent);
  }

  return (
    <div
      className={clsx(
        address === message.senderAddress ? 'mr-4 items-end' : 'items-start',
        'mx-auto mb-4 flex flex-col'
      )}
    >
      <div className="flex max-w-[60%]">
        {address !== message.senderAddress && (
          <Image
            src={url ?? getAvatar(profile)}
            className="mr-2 h-10 w-10 rounded-full border bg-gray-200 dark:border-gray-700"
            alt={formatHandle(profile?.handle)}
          />
        )}
        <div
          className={clsx(
            address === message.senderAddress
              ? 'bg-brand-500'
              : 'bg-gray-100 dark:bg-gray-700',
            'w-full rounded-lg px-4 py-2'
          )}
        >
          <span
            className={clsx(
              address === message.senderAddress && 'text-white',
              'text-md linkify-message block break-words'
            )}
          >
            <MessageContent
              message={message}
              profile={profile}
              sentByMe={address == message.senderAddress}
            />
          </span>
        </div>
      </div>
      <div className={clsx(address !== message.senderAddress ? 'ml-12' : '')}>
        <span
          className={clsx(
            address === message.senderAddress ? 'flex-row' : 'flex-row-reverse',
            'flex items-center gap-1 text-xs text-gray-400'
          )}
          title={formatTime(message.sent)}
        >
          {statusIcon}
          {statusContent}
        </span>
      </div>
    </div>
  );
};

interface DateDividerBorderProps {
  children: ReactNode;
}

const DateDividerBorder: FC<DateDividerBorderProps> = ({ children }) => (
  <>
    <div className="h-0.5 grow bg-gray-300/25" />
    {children}
    <div className="h-0.5 grow bg-gray-300/25" />
  </>
);

const DateDivider: FC<{ date?: Date }> = ({ date }) => (
  <div className="align-items-center flex items-center p-4 pl-2 pt-0">
    <DateDividerBorder>
      <span className="mx-11 flex-none text-sm font-bold text-gray-300">
        {formatDate(date)}
      </span>
    </DateDividerBorder>
  </div>
);

const MissingXmtpAuth: FC = () => (
  <Card
    as="aside"
    className="mb-2 mr-4 space-y-2.5 border-gray-400 !bg-gray-300/20 p-5"
  >
    <div className="flex items-center space-x-2 font-bold">
      <EmojiSadIcon className="h-5 w-5" />
      <p>
        <Trans>This fren hasn't enabled DMs yet</Trans>
      </p>
    </div>
    <p className="text-sm leading-[22px]">
      <Trans>You can't send them a message until they enable DMs.</Trans>
    </p>
  </Card>
);

const ConversationBeginningNotice: FC = () => (
  <div className="align-items-center mt-6 flex justify-center pb-4">
    <span className="text-sm font-bold text-gray-300">
      <Trans>This is the beginning of the conversation</Trans>
    </span>
  </div>
);

const LoadingMore: FC = () => (
  <div className="mt-6 p-1 text-center text-sm font-bold text-gray-300">
    <Trans>Loading...</Trans>
  </div>
);

interface MessageListProps {
  conversationKey?: string;
  messages: (DecodedMessage | PendingMessage | FailedMessage)[];
  fetchNextMessages: () => void;
  profile?: Profile;
  currentProfile?: Profile | null;
  hasMore: boolean;
  missingXmtpAuth: boolean;
}

const MessagesList: FC<MessageListProps> = ({
  conversationKey,
  messages,
  fetchNextMessages,
  profile,
  currentProfile,
  hasMore,
  missingXmtpAuth
}) => {
  const listRef = useRef<HTMLSpanElement | null>(null);
  let lastMessageDate: Date | undefined;
  const { observe } = useInView({
    onChange: ({ inView }) => {
      if (!inView) {
        return;
      }

      fetchNextMessages();
    }
  });

  // scroll to the bottom of the message list when a conversation is selected
  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [conversationKey]);

  const ensNames = useMessageStore((state) => state.ensNames);
  const ensName = ensNames.get(conversationKey?.split('/')[0] ?? '');
  const url =
    (ensName && getStampFyiURL(conversationKey?.split('/')[0] ?? '')) ?? '';

  return (
    <div className="flex grow overflow-y-hidden">
      <div className="relative flex h-full w-full pl-4">
        <div className="flex h-full w-full flex-col-reverse overflow-y-hidden">
          {missingXmtpAuth && <MissingXmtpAuth />}
          <span
            ref={listRef}
            className="flex flex-col-reverse overflow-y-auto overflow-x-hidden"
          >
            {messages?.map((msg, index) => {
              const dateHasChanged = lastMessageDate
                ? !isOnSameDay(lastMessageDate, msg.sent)
                : false;
              const messageDiv = (
                <div
                  key={`${msg.id}_${index}`}
                  ref={index === messages.length - 1 ? observe : null}
                >
                  <MessageTile
                    url={url}
                    currentProfile={currentProfile}
                    profile={profile}
                    message={msg}
                  />
                  {dateHasChanged ? (
                    <DateDivider date={lastMessageDate} />
                  ) : null}
                </div>
              );
              lastMessageDate = msg.sent;
              return messageDiv;
            })}
            {hasMore ? <LoadingMore /> : <ConversationBeginningNotice />}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(MessagesList);
