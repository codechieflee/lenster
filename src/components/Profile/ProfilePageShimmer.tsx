import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import React from 'react'

const ProfilePageShimmer: React.FC = () => {
  return (
    <>
      <div className="shimmer h-52 sm:h-80" />
      <GridLayout className="pt-6">
        <GridItemFour>
          <div className="px-5 mb-4 sm:px-0">
            <div className="space-y-10">
              <div className="relative w-32 h-32 -mt-24 sm:-mt-32 sm:w-52 sm:h-52">
                <div className="w-32 h-32 bg-gray-200 rounded-xl ring-8 ring-gray-50 sm:w-52 sm:h-52 dark:bg-gray-700 dark:ring-black shimmer" />
              </div>
              <div className="space-y-3">
                <div className="w-1/3 h-5 rounded-lg shimmer" />
                <div className="w-1/4 h-3 rounded-lg shimmer" />
              </div>
              <div className="space-y-5">
                <div className="flex gap-5">
                  <div className="space-y-2">
                    <div className="rounded-lg h-7 w-7 shimmer" />
                    <div className="w-20 h-3 rounded-lg shimmer" />
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-lg h-7 w-7 shimmer" />
                    <div className="w-20 h-3 rounded-lg shimmer" />
                  </div>
                </div>
                <div className="w-28 rounded-lg h-[34px] shimmer" />
                <div className="space-y-2">
                  <div className="w-7/12 h-3 rounded-lg shimmer" />
                  <div className="w-1/3 h-3 rounded-lg shimmer" />
                </div>
              </div>
            </div>
          </div>
        </GridItemFour>
        <GridItemEight className="space-y-5">
          <div className="flex gap-3 px-5 mt-3 sm:px-0 sm:mt-0">
            <div className="h-8 rounded-lg w-14 sm:w-28 shimmer" />
            <div className="h-8 rounded-lg w-14 sm:w-28 shimmer" />
            <div className="h-8 rounded-lg w-14 sm:w-28 shimmer" />
            <div className="h-8 rounded-lg w-14 sm:w-28 shimmer" />
          </div>
          <PostsShimmer />
        </GridItemEight>
      </GridLayout>
    </>
  )
}

export default ProfilePageShimmer
