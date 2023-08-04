import GlobalAlerts from '@components/Shared/GlobalAlerts';
import GlobalBanners from '@components/Shared/GlobalBanners';
import BottomNavigation from '@components/Shared/Navbar/BottomNavigation';
import type { Profile } from '@lenster/lens';
import { useUserProfilesWithGuardianInformationQuery } from '@lenster/lens';
import resetAuthData from '@lenster/lib/resetAuthData';
import getIsAuthTokensAvailable from '@lib/getIsAuthTokensAvailable';
import getToastOptions from '@lib/getToastOptions';
import Head from 'next/head';
import { useTheme } from 'next-themes';
import type { FC, ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { useAuthPersistStore } from 'src/store/auth';
import { useProfileGuardianInformationStore } from 'src/store/profile-guardian-information';
import { useIsMounted, useUpdateEffect } from 'usehooks-ts';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';

import { useDisconnectXmtp } from '../../hooks/useXmtpClient';
import GlobalModals from '../Shared/GlobalModals';
import Loading from '../Shared/Loading';
import Navbar from '../Shared/Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const setProfiles = useAppStore((state) => state.setProfiles);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileGuardianInformation = useProfileGuardianInformationStore(
    (state) => state.setProfileGuardianInformation
  );
  const resetProfileGuardianInformation = useProfileGuardianInformationStore(
    (state) => state.resetProfileGuardianInformation
  );
  const profileId = useAuthPersistStore((state) => state.profileId);
  const setProfileId = useAuthPersistStore((state) => state.setProfileId);

  const isMounted = useIsMounted();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();
  const disconnectXmtp = useDisconnectXmtp();

  const resetAuthState = () => {
    setProfileId(null);
    setCurrentProfile(null);
    resetProfileGuardianInformation();
  };

  // Fetch current profiles and sig nonce owned by the wallet address
  const { loading } = useUserProfilesWithGuardianInformationQuery({
    variables: {
      profileGuardianInformationRequest: { profileId },
      profilesRequest: { ownedBy: [address] }
    },
    skip: !profileId,
    onCompleted: (data) => {
      const profiles = data?.profiles?.items
        ?.slice()
        ?.sort((a, b) => Number(a.id) - Number(b.id))
        ?.sort((a, b) =>
          a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
        );

      if (!profiles.length) {
        return resetAuthState();
      }

      const selectedUser = profiles.find((profile) => profile.id === profileId);
      setProfiles(profiles as Profile[]);
      setCurrentProfile(selectedUser as Profile);
      setProfileId(selectedUser?.id);
      setProfileGuardianInformation({
        isProtected: data.profileGuardianInformation.protected,
        disablingProtectionTimestamp:
          data.profileGuardianInformation.disablingProtectionTimestamp
      });
    },
    onError: () => setProfileId(null)
  });

  const validateAuthentication = () => {
    const currentProfileAddress = currentProfile?.ownedBy;
    const isSwitchedAccount =
      currentProfileAddress !== undefined && currentProfileAddress !== address;
    const isWrongNetworkChain = chain?.id !== CHAIN_ID;
    const shouldLogout =
      !getIsAuthTokensAvailable() || isWrongNetworkChain || isSwitchedAccount;

    // If there are no auth data, clear and logout
    if (shouldLogout && profileId) {
      disconnectXmtp();
      resetAuthState();
      resetAuthData();
      disconnect?.();
    }
  };

  useUpdateEffect(() => {
    validateAuthentication();
  }, [address, chain, disconnect, profileId]);

  if (loading || !isMounted()) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <meta
          name="theme-color"
          content={resolvedTheme === 'dark' ? '#1b1b1d' : '#ffffff'}
        />
      </Head>
      <Toaster
        position="bottom-right"
        toastOptions={getToastOptions(resolvedTheme)}
      />
      <GlobalModals />
      <GlobalAlerts />
      <div className="flex min-h-screen flex-col pb-14 md:pb-0">
        <Navbar />
        <GlobalBanners />
        <BottomNavigation />
        {children}
      </div>
    </>
  );
};

export default Layout;
