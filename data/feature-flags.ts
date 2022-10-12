import { lensterMembers } from './lenster-members';

export const featureFlags = [
  {
    key: 'messages',
    name: 'Messages',
    enabledFor: [
      ...lensterMembers,
      '0x06', // wagmi.lens
      '0xe248', // nick-molnar.lens
      '0x010e04', // elisealix22.lens
      '0x5cce', // saulmc.lens
      '0x014309' // iambhavya.lens
    ]
  },
  {
    key: 'composer-v2',
    name: 'Composer v2',
    enabledFor: [...lensterMembers]
  },
  {
    key: 'trending-widget',
    name: 'Trending widget',
    enabledFor: [...lensterMembers]
  },
  {
    key: 'timeline-v2',
    name: 'Timeline v2',
    enabledFor: [
      ...lensterMembers,
      '0x2d' // sasicodes.lens
    ]
  }
];
