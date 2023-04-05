import { MenuAlt2Icon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import type { Proposal, Vote } from 'snapshot';
import { Card } from 'ui';

import New from '../Badges/New';

interface HeaderProps {
  proposal: Proposal;
  votes: Vote[];
}

const Choices: FC<HeaderProps> = ({ proposal, votes }) => {
  const { choices, scores, scores_total } = proposal;
  const vote = votes[0];
  const choicesWithVote = choices.map((choice, index) => ({
    choice,
    voted: Array.isArray(vote?.choice) ? vote?.choice.includes(index + 1) : vote?.choice === index + 1,
    percentage: ((scores?.[index] ?? 0) / (scores_total ?? 1)) * 100
  }));
  const sortedChoices = choicesWithVote.sort((a, b) => b.percentage - a.percentage);

  return (
    <Card className="mt-5">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <div className="flex items-center space-x-2 font-bold">
          <MenuAlt2Icon className="h-5 w-5" />
          <b>{proposal.state === 'active' ? t`Current results` : t`Results`}</b>
        </div>
        <New />
      </div>
      <div className="space-y-4 p-5">
        {sortedChoices.map(({ choice, voted, percentage }) => (
          <div key={choice} className="flex items-center space-x-2.5 text-sm">
            <CheckCircleIcon className={clsx(voted ? 'text-green-500' : 'text-gray-500', 'h-6 w-6 ')} />
            <div className="w-full space-y-1">
              <div className="flex items-center justify-between">
                <b>{choice}</b>
                <span className="lt-text-gray-500">
                  {Number.isNaN(percentage) ? 0 : percentage.toFixed(2)}%
                </span>
              </div>
              <div className="flex h-2.5 overflow-hidden rounded-full bg-gray-300">
                <div
                  style={{ width: `${percentage.toFixed(2)}%` }}
                  className={clsx(voted ? 'bg-green-500' : 'bg-brand-500')}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Choices;
