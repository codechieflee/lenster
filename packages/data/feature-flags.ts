import { mainnetLensTeamMembers } from './lens-members';
import { mainnetStaffs } from './staffs';

export enum FeatureFlag {
  TrendingWidget = 'trending-widget',
  NftGallery = 'nft-gallery',
  NftDetail = 'nft-detail',
  GatedLocales = 'gated-locales',
  ForYou = 'for-you',
  WTF2 = 'wtf2',
  ExploreTags = 'explore-tags',
  Spaces = 'spaces',
  AlgorithmicFeed = 'algorithmic-feed'
}

export const featureFlags = [
  {
    key: FeatureFlag.TrendingWidget,
    enabledFor: [...mainnetStaffs]
  },
  {
    key: FeatureFlag.NftGallery,
    enabledFor: [...mainnetStaffs]
  },
  {
    key: FeatureFlag.NftDetail,
    enabledFor: [...mainnetStaffs]
  },
  {
    key: FeatureFlag.GatedLocales,
    enabledFor: [...mainnetStaffs]
  },
  {
    key: FeatureFlag.ForYou,
    enabledFor: [...mainnetStaffs, ...mainnetLensTeamMembers]
  },
  {
    key: FeatureFlag.WTF2,
    enabledFor: [...mainnetStaffs, ...mainnetLensTeamMembers]
  },
  {
    key: FeatureFlag.ExploreTags,
    enabledFor: [...mainnetStaffs, ...mainnetLensTeamMembers]
  },
  {
    key: FeatureFlag.Spaces,
    enabledFor: ['0x0d']
  },
  {
    key: FeatureFlag.AlgorithmicFeed,
    enabledFor: [...mainnetStaffs, ...mainnetLensTeamMembers]
  }
];
