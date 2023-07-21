import type { OG } from '@lenster/types/misc';
import type { FC } from 'react';

interface PlayerProps {
  og: OG;
}

const Player: FC<PlayerProps> = ({ og }) => {
  return (
    <div className="mt-4 w-5/6 text-sm" data-testid={`rich-oembed-${og.url}`}>
      <div
        className="oembed-player"
        dangerouslySetInnerHTML={{ __html: og.html }}
      />
    </div>
  );
};

export default Player;
