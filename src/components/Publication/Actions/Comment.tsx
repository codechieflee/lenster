import { Tooltip } from '@components/UI/Tooltip';
import { LensterPublication } from '@generated/lenstertypes';
import { ChatAlt2Icon } from '@heroicons/react/outline';
import humanize from '@lib/humanize';
import { Mixpanel } from '@lib/mixpanel';
import nFormatter from '@lib/nFormatter';
import { motion } from 'framer-motion';
import { FC } from 'react';
import { usePublicationStore } from 'src/store/publication';
import { PUBLICATION } from 'src/tracking';

interface Props {
  publication: LensterPublication;
}

const Comment: FC<Props> = ({ publication }) => {
  const setParentPub = usePublicationStore((state) => state.setParentPub);
  const setShowNewPostModal = usePublicationStore((state) => state.setShowNewPostModal);

  const count =
    publication.__typename === 'Mirror'
      ? publication?.mirrorOf?.stats?.totalAmountOfComments
      : publication?.stats?.totalAmountOfComments;

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        setParentPub(publication);
        setShowNewPostModal(true);
        Mixpanel.track(PUBLICATION.OPEN_COMMENT);
      }}
      aria-label="Like"
    >
      <div className="flex items-center space-x-1 text-blue-500 hover:text-blue-400">
        <div className="p-1.5 rounded-full hover:bg-blue-300 hover:bg-opacity-20">
          <Tooltip placement="top" content={count > 0 ? `${humanize(count)} Comments` : 'Comment'} withDelay>
            <ChatAlt2Icon className="w-[15px] sm:w-[18px]" />
          </Tooltip>
        </div>
        {count > 0 && <div className="text-[11px] sm:text-xs">{nFormatter(count)}</div>}
      </div>
    </motion.button>
  );
};

export default Comment;
