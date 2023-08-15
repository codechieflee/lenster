import packageJson from '../../package.json';
import LensEndpoint from './lens-endpoints';
import getEnvConfig from './utils/getEnvConfig';

// Environments
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true';

// Lens Network
export const LENS_NETWORK = process.env.NEXT_PUBLIC_LENS_NETWORK ?? 'mainnet';

export const API_URL = getEnvConfig().apiEndpoint;
export const LENSHUB_PROXY = getEnvConfig().lensHubProxyAddress;
export const LENS_PERIPHERY = getEnvConfig().lensPeripheryAddress;
export const DEFAULT_COLLECT_TOKEN = getEnvConfig().defaultCollectToken;
export const LIT_PROTOCOL_ENVIRONMENT = getEnvConfig().litProtocolEnvironment;

export const IS_MAINNET = API_URL === LensEndpoint.Mainnet;

// XMTP
export const XMTP_ENV = IS_MAINNET ? 'production' : 'dev';
export const XMTP_PREFIX = 'lens.dev/dm';

// Snapshot
export const LENSTER_POLLS_SPACE = 'polls.lenster.xyz';
export const SNAPSHOT_HUB_URL = IS_MAINNET
  ? 'https://hub.snapshot.org'
  : 'https://testnet.snapshot.org';
export const MAINNET_SNAPSHOT_SEQUNECER_URL = 'https://seq.snapshot.org';
export const TESTNET_SNAPSHOT_SEQUNECER_URL =
  'https://testnet.seq.snapshot.org';
export const SNAPSHOT_SEQUNECER_URL = IS_MAINNET
  ? MAINNET_SNAPSHOT_SEQUNECER_URL
  : TESTNET_SNAPSHOT_SEQUNECER_URL;
export const MAINNET_SNAPSHOT_URL = 'https://snapshot.org';
export const TESTNET_SNAPSHOT_URL = 'https://demo.snapshot.org';
export const SNAPSHOT_URL = IS_MAINNET
  ? MAINNET_SNAPSHOT_URL
  : TESTNET_SNAPSHOT_URL;

// Application
export const APP_NAME = 'Lenster';
export const DESCRIPTION =
  'Lenster is a composable, decentralized, and permissionless social media web app built with Lens Protocol 🌿';
export const APP_VERSION = packageJson.version;

// Git
export const GIT_COMMIT_SHA =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

// Misc
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const LENSPROTOCOL_HANDLE = 'lensprotocol';
export const HANDLE_SUFFIX = IS_MAINNET ? '.lens' : '.test';
// TODO: Remove this once everyone has migrated to the new Lens relayer
export const OLD_LENS_RELAYER_ADDRESS =
  '0xD1FecCF6881970105dfb2b654054174007f0e07E';

// URLs
export const STATIC_ASSETS_URL = 'https://static-assets.lenster.xyz';
export const LENS_MEDIA_SNAPSHOT_URL =
  'https://ik.imagekit.io/lens/media-snapshot';
export const STATIC_IMAGES_URL = `${STATIC_ASSETS_URL}/images`;
export const POLYGONSCAN_URL = IS_MAINNET
  ? 'https://polygonscan.com'
  : 'https://mumbai.polygonscan.com';
export const RARIBLE_URL = IS_MAINNET
  ? 'https://rarible.com'
  : 'https://testnet.rarible.com';
export const IPFS_GATEWAY = IS_PRODUCTION
  ? 'https://ipfs.lenster.xyz/ipfs/'
  : 'http://localhost:8091/ipfs/';
export const ARWEAVE_GATEWAY = 'https://arweave.net/';
export const EVER_API = 'https://endpoint.4everland.co';
export const DEFAULT_OG = `${STATIC_IMAGES_URL}/og/logo.jpeg`;

// Workers
export const STS_GENERATOR_WORKER_URL = IS_PRODUCTION
  ? 'https://sts.lenster.xyz'
  : 'http://localhost:8082';
export const METADATA_WORKER_URL = IS_PRODUCTION
  ? 'https://metadata.lenster.xyz'
  : 'http://localhost:8083';
export const FRESHDESK_WORKER_URL = IS_PRODUCTION
  ? 'https://freshdesk.lenster.xyz'
  : 'http://localhost:8084';
export const SNAPSHOR_RELAY_WORKER_URL = IS_PRODUCTION
  ? 'https://snapshot-relay.lenster.xyz'
  : 'http://localhost:8085';
export const ENS_RESOLVER_WORKER_URL = IS_PRODUCTION
  ? 'https://ens-resolver.lenster.xyz'
  : 'http://localhost:8086';
export const OEMBED_WORKER_URL = IS_PRODUCTION
  ? 'https://oembed.lenster.xyz'
  : 'http://localhost:8087';
export const LEAFWATCH_WORKER_URL = IS_PRODUCTION
  ? 'https://leafwatch.lenster.xyz'
  : 'http://localhost:8088';
export const ACHIEVEMENTS_WORKER_URL = 'https://achievements.lenster.xyz';
export const INVITE_WORKER_URL = IS_PRODUCTION
  ? 'https://invite.lenster.xyz'
  : 'http://localhost:8090';
export const FEEDS_WORKER_URL = IS_PRODUCTION
  ? 'https://feeds.lenster.xyz'
  : 'http://localhost:8092';
export const ACCESS_WORKER_URL = IS_PRODUCTION
  ? 'https://access.lenster.xyz'
  : 'http://localhost:8093';

// Tokens / Keys
export const ALCHEMY_KEY = '7jxlM7yIx-aJXDivcEZxsLFFRKQS6-ue';
export const WALLETCONNECT_PROJECT_ID = 'cd542acc70c2b548030f9901a52e70c8';
export const GIPHY_KEY = 'yNwCXMKkiBrxyyFduF56xCbSuJJM8cMd';

// Utils
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
];
export const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/mp4',
  'audio/aac',
  'audio/ogg',
  'audio/webm',
  'audio/flac'
];
export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/mpeg',
  'video/ogg',
  'video/webm',
  'video/quicktime'
];
export const ALLOWED_MEDIA_TYPES = [
  ...ALLOWED_VIDEO_TYPES,
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_AUDIO_TYPES
];

// UI
export const MESSAGE_PAGE_LIMIT = 15;
export const MIN_WIDTH_DESKTOP = 1024;

// Named transforms for ImageKit
export const AVATAR = 'tr:w-300,h-300';
export const EXPANDED_AVATAR = 'tr:w-1000,h-1000';
export const COVER = 'tr:w-1500,h-500';
export const ATTACHMENT = 'tr:w-1000';

// S3 bucket
export const S3_BUCKET = {
  LENSTER_MEDIA: 'lenster-media'
};
