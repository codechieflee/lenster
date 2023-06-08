import SmallUserProfile from '@components/Shared/SmallUserProfile';
import { MicrophoneIcon, PlusCircleIcon } from '@heroicons/react/outline';
import type { Profile, Publication } from '@lenster/lens';
import { useProfilesQuery } from '@lenster/lens';
import getPublicationAttribute from '@lenster/lib/getPublicationAttribute';
import { Button, Modal } from '@lenster/ui';
import { type FC, useState } from 'react';
import { Space } from 'src/types';

import Wrapper from '../Wrapper';
import SpacePlayer from './SpacePlayer';

interface SpaceProps {
  publication: Publication;
}

const Space: FC<SpaceProps> = ({ publication }) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const { metadata } = publication;
  const space: Space = JSON.parse(
    getPublicationAttribute(metadata.attributes, 'space')
  );

  // merge space.mainHost and space.subHosts array
  const allHosts = [space.mainHost, ...(space.subHosts ?? [])];
  const { data, loading } = useProfilesQuery({
    variables: {
      request: { ownedBy: allHosts }
    }
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  // get mainHost profile
  const mainHostProfile = data?.profiles?.items?.find(
    (profile) => profile?.ownedBy === space.mainHost && profile?.isDefault
  ) as Profile;
  const subHostsProfiles = data?.profiles?.items?.filter(
    (profile) => profile?.ownedBy !== space.mainHost && profile?.isDefault
  ) as Profile[];

  return (
    <Wrapper className="!bg-brand-500/30 border-brand-400 mt-0 !p-3">
      <SmallUserProfile profile={mainHostProfile} smallAvatar />
      <div className="mt-2 space-y-3">
        <b className="text-lg">{metadata.content}</b>
        {subHostsProfiles?.length > 0 && (
          <div className="space-y-2">
            <b className="lt-text-gray-500 text-sm">Subhosts</b>
            <div>
              {subHostsProfiles.map((profile) => (
                <SmallUserProfile
                  key={profile.ownedBy}
                  profile={profile}
                  smallAvatar
                />
              ))}
            </div>
          </div>
        )}
        <Button
          className="!mt-4 flex w-full justify-center"
          icon={<PlusCircleIcon className="h-5 w-5" />}
          onClick={() => setShowPlayer(true)}
        >
          Open Space
        </Button>
      </div>
      <Modal
        show={showPlayer}
        onClose={() => setShowPlayer(false)}
        size="md"
        title="Space"
        icon={<MicrophoneIcon className="text-brand h-5 w-5" />}
      >
        <SpacePlayer
          publication={publication}
          space={{
            id: space.id,
            mainHost: mainHostProfile,
            subHosts: subHostsProfiles
          }}
        />
      </Modal>
    </Wrapper>
  );
};

export default Space;
