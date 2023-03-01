import { stopEventPropagation } from '@lib/stopEventPropagation';
import type { FeedItem } from 'lens';
import type { FC } from 'react';

import Collected from './Collected';
import Combined from './Combined';
import Commented from './Commented';
import Liked from './Liked';
import Mirrored from './Mirrored';

interface Props {
  feedItem: FeedItem;
  showType?: boolean;
  showThread?: boolean;
}

const getCanCombined = (aggregations: number[]) => {
  // show combined reactions if more than 2 items in aggregations
  return aggregations.filter((n) => n > 0).length > 1;
};

const EventType: FC<Props> = ({ feedItem, showType, showThread = false }) => {
  const publication = feedItem.root;
  const isComment = publication.__typename === 'Comment';
  const commentsCount = feedItem.comments?.length ?? 0;

  const canCombined = getCanCombined([
    feedItem.mirrors.length,
    feedItem.reactions.length,
    feedItem.collects.length,
    feedItem.comments?.length ?? 0
  ]);

  if (!showType) {
    return null;
  }

  return (
    <span onClick={stopEventPropagation}>
      {canCombined ? (
        <Combined feedItem={feedItem} />
      ) : (
        <>
          {feedItem.mirrors.length && !isComment ? <Mirrored mirrors={feedItem.mirrors} /> : null}
          {feedItem.collects.length && !isComment ? <Collected collects={feedItem.collects} /> : null}
          {feedItem.reactions.length && !isComment ? <Liked reactions={feedItem.reactions} /> : null}
        </>
      )}
      {(isComment || commentsCount > 0) && showThread && <Commented feedItem={feedItem} />}
    </span>
  );
};

export default EventType;
