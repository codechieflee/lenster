import {
  Comment,
  FeeCollectModuleSettings,
  FeeFollowModuleSettings,
  FreeCollectModuleSettings,
  LimitedFeeCollectModuleSettings,
  LimitedTimedFeeCollectModuleSettings,
  Mirror,
  Notification,
  Post,
  Profile,
  ProfileFollowModuleSettings,
  RevertCollectModuleSettings,
  RevertFollowModuleSettings,
  TimedFeeCollectModuleSettings
} from './types'

export type LensterPost = Post & Mirror & Comment & { pubId: string }
export type LensterNotification = Notification & { profile: Profile }
export type Community = Post
export type LensterCollectModule = FreeCollectModuleSettings &
  FeeCollectModuleSettings &
  LimitedFeeCollectModuleSettings &
  LimitedTimedFeeCollectModuleSettings &
  RevertCollectModuleSettings &
  TimedFeeCollectModuleSettings
export type LensterFollowModule = FeeFollowModuleSettings &
  ProfileFollowModuleSettings &
  RevertFollowModuleSettings
export type LensterAttachment = { item: string; type: string }
export type UserSuggestion = {
  uid: string
  id: string
  display: string
  name: string
  picture: string
}
