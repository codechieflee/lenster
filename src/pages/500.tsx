import { Button } from '@components/UI/Button'
import SEO from '@components/utils/SEO'
import { HomeIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { APP_NAME } from 'src/constants'

export default function Custom500() {
  return (
    <div className="flex-col page-center">
      <SEO title={`500 • ${APP_NAME}`} />
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">
          Looks like something went wrong!
        </h1>
        <div className="mb-4 text-gray-500">
          We track these errors automatically, but if the problem persists feel
          free to contact us. In the meantime, try refreshing.
        </div>
        <Link href="/">
          <a href="/">
            <Button
              className="flex mx-auto item-center"
              size="lg"
              icon={<HomeIcon className="w-4 h-4" />}
            >
              <div>Go to home</div>
            </Button>
          </a>
        </Link>
      </div>
    </div>
  )
}
