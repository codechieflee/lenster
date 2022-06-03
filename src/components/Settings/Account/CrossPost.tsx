import Beta from '@components/Shared/Beta'
import { Card, CardBody } from '@components/UI/Card'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import React, { FC } from 'react'

const CrossPost: FC = () => {
  return (
    <Card>
      <CardBody className="space-y-2 linkify">
        <div className="flex items-center space-x-2">
          <div className="text-lg font-bold">Cross post to Twitter</div>
          <Beta />
        </div>
        <div className="pb-3">
          Reflect will auto-tweet new Lenster posts, so you can finally escape
          the bird site.
        </div>
        <a
          className="flex items-center space-x-1.5"
          href="https://reflect.withlens.app/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <span>Setup now</span>
          <ExternalLinkIcon className="h-4 w-4" />
        </a>
      </CardBody>
    </Card>
  )
}

export default CrossPost
