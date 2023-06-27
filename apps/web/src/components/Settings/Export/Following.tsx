import { SETTINGS } from '@lenster/data/tracking';
import type { FollowingRequest } from '@lenster/lens';
import { useFollowingLazyQuery } from '@lenster/lens';
import { Button, Card } from '@lenster/ui';
import downloadJson from '@lib/downloadJson';
import { Leafwatch } from '@lib/leafwatch';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';

const Following: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [following, setFollowing] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const request: FollowingRequest = {
    address: currentProfile?.ownedBy,
    limit: 50
  };

  const [exportFollowing] = useFollowingLazyQuery({
    fetchPolicy: 'network-only'
  });

  const handleExportClick = async () => {
    Leafwatch.track(SETTINGS.EXPORT.FOLLOWING);
    setExporting(true);
    const fetchFollowing = async (cursor?: string) => {
      const { data } = await exportFollowing({
        variables: { request: { ...request, cursor } },
        onCompleted: (data) => {
          setFollowing((prev) => {
            const newFollowing = data.following.items.filter((newFollowing) => {
              return !prev.some(
                (following) => following.profile.id === newFollowing.profile.id
              );
            });

            return [...prev, ...newFollowing];
          });
        }
      });

      if (
        data?.following.items.length === 0 ||
        !data?.following.pageInfo.next
      ) {
        setFetchCompleted(true);
        setExporting(false);
      } else {
        await fetchFollowing(data?.following.pageInfo.next);
      }
    };

    await fetchFollowing();
  };

  const download = () => {
    downloadJson(following, 'following', () => {
      setFollowing([]);
      setFetchCompleted(false);
    });
  };

  return (
    <Card className="space-y-2 p-5">
      <div className="text-lg font-bold">
        <Trans>Export following</Trans>
      </div>
      <div className="pb-2">
        <Trans>Export all your following to a JSON file.</Trans>
      </div>
      {following.length > 0 ? (
        <div className="pb-2">
          <Trans>
            Exported <b>{following.length}</b> following
          </Trans>
        </div>
      ) : null}
      {fetchCompleted ? (
        <Button onClick={download}>
          <Trans>Download following</Trans>
        </Button>
      ) : (
        <Button onClick={handleExportClick} disabled={exporting}>
          {exporting ? <Trans>Exporting...</Trans> : <Trans>Export now</Trans>}
        </Button>
      )}
    </Card>
  );
};

export default Following;
