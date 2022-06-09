import { gql } from '@apollo/client'

import { MinimalCollectModuleFields } from './CollectModuleFields'
import { MetadataFields } from './MetadataFields'
import { MinimalProfileFields } from './MinimalProfileFields'
import { StatsFields } from './StatsFields'

export const PostFields = gql`
  fragment PostFields on Post {
    id
    profile {
      ...MinimalProfileFields
    }
    collectedBy {
      address
      defaultProfile {
        ...MinimalProfileFields
      }
    }
    collectModule {
      ...MinimalCollectModuleFields
    }
    stats {
      ...StatsFields
    }
    metadata {
      ...MetadataFields
      cover {
        original {
          url
        }
      }
    }
    hidden
    createdAt
    appId
  }
  ${MinimalProfileFields}
  ${MinimalCollectModuleFields}
  ${MetadataFields}
  ${StatsFields}
`
