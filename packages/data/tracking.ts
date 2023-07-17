// Strings used for events tracking

export const PAGEVIEW = 'Pageview';
export const AUTH = {
  LOGIN: 'User login',
  LOGOUT: 'User logout',
  SIWL: 'Sign in with Lens',
  CONNECT_WALLET: 'Connect wallet',
  CHANGE_WALLET: 'Change wallet'
};

export const PROFILE = {
  FOLLOW: 'Follow profile',
  SUPER_FOLLOW: 'Super follow profile',
  UNFOLLOW: 'Unfollow profile',
  DISMISS_RECOMMENDED_PROFILE: 'Dismiss recommended profile',
  OPEN_SUPER_FOLLOW: 'Open super follow modal',
  OPEN_FOLLOWERS: 'Open followers modal',
  OPEN_FOLLOWING: 'Open following modal',
  COPY_PROFILE_LINK: 'Copy profile link',
  SWITCH_PROFILE_FEED_TAB: 'Switch profile feed tab',
  SWITCH_PROFILE_STATS_TAB: 'Switch profile stats tab',
  SWITCH_PROFILE: 'Switch profile',
  LOGOUT: 'Profile logout'
};

export const PUBLICATION = {
  NEW_POST: 'New post',
  NEW_COMMENT: 'New comment',
  LIKE: 'Like publication',
  UNLIKE: 'Unlike publication',
  MIRROR: 'Mirror publication',
  SHARE: 'Share publication',
  TRANSLATE: 'Translate publication',
  COPY_TEXT: 'Copy publication text',
  TOGGLE_BOOKMARK: 'Toggle publication bookmark',
  TOGGLE_NOT_INTERESTED: 'Toggle publication not interested',
  DELETE: 'Delete publication',
  REPORT: 'Report publication',
  CLICK_OEMBED: 'Click publication oembed',
  CLICK_HASHTAG: 'Click publication hashtag',
  CLICK_MENTION: 'Click publication mention',
  OPEN_LIKES: 'Open likes modal',
  OPEN_MIRRORS: 'Open mirrors modal',
  OPEN_COLLECTORS: 'Open collectors modal',
  OPEN_GIFS: 'Open GIFs modal',
  ATTACHMENT: {
    IMAGE: {
      OPEN: 'Open image attachment'
    },
    AUDIO: {
      PLAY: 'Play audio',
      PAUSE: 'Pause audio'
    }
  },
  COLLECT_MODULE: {
    OPEN_COLLECT: 'Open collect modal',
    COLLECT: 'Collect publication',
    OPEN_UNISWAP: 'Open Uniswap'
  },
  TOKEN_GATED: {
    CHECKLIST_NAVIGATED_TO_COLLECT: 'Decrypt checklist navigated to collect',
    CHECKLIST_NAVIGATED_TO_TOKEN: 'Decrypt checklist navigated to token',
    CHECKLIST_NAVIGATED_TO_NFT: 'Decrypt checklist navigated to NFT',
    DECRYPT: 'Decrypt token gated publication'
  },
  WIDGET: {
    SNAPSHOT: {
      OPEN_CAST_VOTE: 'Snapshot: Open cast vote modal',
      VOTE: 'Snapshot: Vote'
    }
  }
};

export const NOTIFICATION = {
  SWITCH_NOTIFICATION_TAB: 'Switch notifications tab'
};

export const EXPLORE = {
  SWITCH_EXPLORE_FEED_TAB: 'Switch explore feed tab',
  SWITCH_EXPLORE_FEED_FOCUS: 'Switch explore feed focus'
};

export const MESSAGES = {
  SEND: 'Send message',
  OPEN_NEW_CONVERSATION: 'Open new conversation modal'
};

export const SETTINGS = {
  ACCOUNT: {
    SET_DEFAULT_PROFILE: 'Set default profile',
    SET_SUPER_FOLLOW: 'Set super follow'
  },
  PROFILE: {
    UPDATE: 'Update profile',
    SET_NFT_PICTURE: 'Set NFT profile picture',
    SET_PICTURE: 'Set profile picture',
    SET_STATUS: 'Set profile status',
    CLEAR_STATUS: 'Clear profile status'
  },
  DISPATCHER: {
    TOGGLE: 'Toggle dispatcher',
    UPDATE: 'Update dispatcher'
  },
  ALLOWANCE: {
    TOGGLE: 'Toggle allowance'
  },
  INTERESTS: {
    ADD: 'Add profile interest',
    REMOVE: 'Remove profile interest'
  },
  EXPORT: {
    PROFILE: 'Export profile',
    PUBLICATIONS: 'Export publications',
    NOTIFICATIONS: 'Export notifications',
    FOLLOWING: 'Export following',
    FOLLOWERS: 'Export followers'
  },
  DANGER: {
    PROTECT_PROFILE: 'Protect profile',
    UNPROTECT_PROFILE: 'Unprotect profile',
    DELETE_PROFILE: 'Delete profile'
  }
};

export const MOD = {
  TOGGLE_MODE: 'Toggle mod mode',
  REPORT: 'Mod report'
};

export const STAFFTOOLS = {
  TOGGLE_MODE: 'Toggle staff mode'
};

export const SYSTEM = {
  SWITCH_THEME: 'Switch theme',
  SWITCH_NETWORK: 'Switch network'
};

export const MISCELLANEOUS = {
  OPEN_RECOMMENDED_PROFILES: 'Open recommended profiles modal',
  OPEN_TRENDING_TAG: 'Open trending tag',
  SWITCH_FOR_YOU_FEED: 'Switch to for you feed',
  SWITCH_FOLLOWING_FEED: 'Switch to following feed',
  SWITCH_HIGHLIGHTS_FEED: 'Switch to highlights feed',
  SELECT_USER_FEED: 'Select user feed',
  SELECT_LOCALE: 'Select locale',
  FOOTER: {
    OPEN_DISCORD: 'Open Discord',
    OPEN_GITHUB: 'Open GitHub',
    OPEN_VERCEL: 'Open Vercel',
    OPEN_STATUS: 'Open status',
    OPEN_FEEDBACK: 'Open feedback',
    OPEN_TRANSLATE: 'Open translate',
    OPEN_DONATE: 'Open donate'
  }
};

export const ONBOARDING = {
  NAVIGATE_UPDATE_PROFILE: 'Navigate to update profile from onboarding',
  NAVIGATE_UPDATE_PROFILE_INTERESTS:
    'Navigate to update profile interests from onboarding'
};

// enums
export enum FollowUnfollowSource {
  WHO_TO_FOLLOW = 'who_to_follow',
  WHO_TO_FOLLOW_MODAL = 'who_to_follow_modal',
  LIKES_MODAL = 'likes_modal',
  MIRRORS_MODAL = 'mirrors_modal',
  COLLECTORS_MODAL = 'collectors_modal',
  FOLLOWERS_MODAL = 'followers_modal',
  FOLLOWING_MODAL = 'following_modal',
  MUTUAL_FOLLOWERS_MODAL = 'mutual_followers_modal',
  PUBLICATION_RELEVANT_PROFILES = 'publication_relevant_profiles',
  DIRECT_MESSAGE_HEADER = 'direct_message_header',
  PROFILE_PAGE = 'profile_page',
  PROFILE_POPOVER = 'profile_popover'
}

export const ALL_EVENTS = {
  PAGEVIEW,
  ...AUTH,
  ...PROFILE,
  ...PUBLICATION,
  ...NOTIFICATION,
  ...EXPLORE,
  ...MESSAGES,
  ...SETTINGS,
  ...MOD,
  ...STAFFTOOLS,
  ...SYSTEM,
  ...MISCELLANEOUS,
  ...ONBOARDING
};
