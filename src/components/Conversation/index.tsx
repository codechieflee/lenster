import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import { Profile } from '@generated/types';
import { Message } from '@xmtp/xmtp-js';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useXmtpStore } from 'src/store/xmtp';

interface Props {
  profile: Profile;
}

const Conversation: FC<Props> = () => {
  const router = useRouter();
  const address = router.query.address as string;
  const xmtpState = useXmtpStore((state) => state);
  const { messages, conversations } = xmtpState;

  const onConversationSelected = (address: string) => {
    router.push(address ? `/messages/${address}` : '/messages/');
  };

  return (
    <GridLayout>
      <GridItemFour>
        <Card className="h-[86vh] px-2 pt-3">
          <div className="flex justify-between">
            <div className="font-black text-lg">Messages</div>
            <div>
              <button className="text-xs border border-p-100 p-1 rounded">New Message</button>
            </div>
          </div>
          <div className="flex justify-between p-4">
            <div className="text-xs">Lens profiles</div>
            <div className="text-xs">All messages</div>
          </div>
          <div>
            {Array.from(conversations.keys()).map((address: string) => {
              return (
                <div
                  onClick={() => onConversationSelected(address)}
                  key={`convo_${address}`}
                  className="border p-5 text-xs"
                >
                  {address}
                </div>
              );
            })}
          </div>
        </Card>
      </GridItemFour>
      <GridItemEight>
        <Card className="h-[86vh] overflow-y-auto">
          {Array.from(messages.get(address) || []).map((msg: Message) => {
            return (
              <div key={`convo_${msg.id}`} className="border p-5 text-xs">
                From - {msg.senderAddress}
                <br />
                Msg - {msg.content}
              </div>
            );
          })}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Conversation;
