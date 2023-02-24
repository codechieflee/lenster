import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import { useEffect } from 'react';

import Embed from './Embed';
import Player from './Player';

interface Props {
  url?: string;
}

const IFramely: FC<Props> = ({ url }) => {
  const allowedSites = ['YouTube', 'Spotify', 'SoundCloud', 'oohlala_xyz', 'Lenstube'];

  const { isLoading, error, data } = useQuery(
    [url],
    () =>
      axios({
        url: 'https://iframe.ly/api/iframely',
        params: { api_key: '258c8580bd477c9b886b49', url }
      }).then((res) => res.data),
    { enabled: Boolean(url) }
  );

  useEffect(() => {
    (window as any).iframely && (window as any).iframely.load();
  }, []);

  if (error || isLoading || !data) {
    return null;
  }

  const og = {
    title: data?.meta?.title,
    description: data?.meta?.description,
    site: data?.meta?.site,
    url: data?.url,
    favicon: `https://www.google.com/s2/favicons?domain=${url}`,
    thumbnail: data?.links?.thumbnail && data?.links?.thumbnail[0]?.href,
    isSquare:
      data?.links?.thumbnail &&
      data?.links?.thumbnail[0]?.media?.width === data?.links?.thumbnail[0]?.media?.height,
    html: data?.links?.player?.[0]?.html ?? data?.links?.reader?.[0]?.html ?? null
  };

  if (!og.title) {
    return null;
  }

  return og.html && allowedSites.includes(og.site) ? <Player og={og} /> : <Embed og={og} />;
};

export default IFramely;
