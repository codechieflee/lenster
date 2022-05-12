import * as Sentry from '@sentry/nextjs'

import { IS_PRODUCTION } from './src/constants'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: IS_PRODUCTION,
  tracesSampleRate: 1.0
})
