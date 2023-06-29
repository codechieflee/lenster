import useEthersWalletClient from '@components/utils/hooks/useEthersWalletClient';
import { ExclamationIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { APP_NAME, Errors } from '@lenster/data';
import { PUBLICATION } from '@lenster/data/tracking';
import humanize from '@lenster/lib/humanize';
import { Button, Spinner } from '@lenster/ui';
import { Mixpanel } from '@lib/mixpanel';
import { snapshotClient } from '@lib/snapshotClient';
import type { ProposalType } from '@snapshot-labs/snapshot.js/dist/sign/types';
import { useQuery } from '@tanstack/react-query';
import type { Proposal } from '@workers/snapshot-relay';
import axios from 'axios';
import type { FC } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppStore } from 'src/store/app';

interface VoteProposalProps {
  proposal: Proposal;
  voteConfig: {
    show: boolean;
    position: number;
  };
  setVoteConfig: (voteConfig: { show: boolean; position: number }) => void;
  refetch?: () => void;
}

const VoteProposal: FC<VoteProposalProps> = ({
  proposal,
  voteConfig,
  setVoteConfig,
  refetch
}) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [voteSubmitting, setVoteSubmitting] = useState(false);
  const { data: walletClient } = useEthersWalletClient();

  const {
    id,
    choices,
    snapshot,
    network,
    strategies,
    space,
    state,
    symbol,
    type
  } = proposal;
  const choice = choices[voteConfig.position - 1];

  const getVotingPower = async () => {
    const response = await axios({
      url: 'https://score.snapshot.org',
      method: 'POST',
      data: {
        jsonrpc: '2.0',
        method: 'get_vp',
        params: {
          address: currentProfile?.ownedBy,
          network,
          strategies,
          snapshot: parseInt(snapshot as string),
          space: space?.id,
          delegation: false
        },
        id: null
      }
    });

    return response.data;
  };

  const { data, isLoading, error } = useQuery(
    ['scoreData', currentProfile?.ownedBy, id],
    () => getVotingPower().then((res) => res),
    { enabled: state === 'active' }
  );

  const sign = async (position: number) => {
    try {
      setVoteSubmitting(true);
      await snapshotClient.vote(walletClient as any, currentProfile?.ownedBy, {
        space: space?.id as string,
        proposal: id as `0x${string}`,
        type: type as ProposalType,
        choice: position,
        app: APP_NAME.toLowerCase()
      });
      refetch?.();
      setVoteConfig({ show: false, position: 0 });
      Mixpanel.track(PUBLICATION.WIDGET.SNAPSHOT.VOTE, {
        proposal_id: id,
        proposal_source: 'snapshot'
      });
    } catch (error) {
      console.error('Failed to vote on snapshot proposal', error);
      toast.error(Errors.SomethingWentWrong);
    } finally {
      setVoteSubmitting(false);
    }
  };

  const totalVotingPower = data?.result?.vp;
  const voteDisabled = voteSubmitting || totalVotingPower === 0;
  const buttonLoading = voteSubmitting;

  return (
    <>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <b>Choice</b>
          <span className="max-w-xs truncate" title={choice ?? ''}>
            {choice}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <b>Snapshot</b>
          <span>{humanize(parseInt(snapshot as string))}</span>
        </div>
        <div className="flex items-center justify-between">
          <b>Your voting power</b>
          <span>
            {isLoading ? (
              <Spinner size="xs" />
            ) : error ? (
              <ExclamationIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <>
                {humanize(totalVotingPower)} {symbol}
              </>
            )}
          </span>
        </div>
      </div>
      <div className="flex space-x-2 border-t p-5">
        <Button
          className="w-full"
          size="lg"
          variant="secondary"
          onClick={() => setVoteConfig({ show: false, position: 0 })}
          outline
        >
          Cancel
        </Button>
        <Button
          disabled={voteDisabled}
          className="w-full justify-center"
          size="lg"
          icon={
            buttonLoading ? (
              <Spinner size="xs" className="mr-1" />
            ) : (
              <CheckCircleIcon className="h-5 w-5" />
            )
          }
          onClick={() => sign(voteConfig.position)}
        >
          Vote
        </Button>
      </div>
    </>
  );
};

export default VoteProposal;
