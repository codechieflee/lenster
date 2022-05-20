import { Profile } from '@generated/types'
import { NextRequest } from 'next/server'
import parser from 'ua-parser-js'

export async function middleware(req: NextRequest) {
  const { headers } = req
  const url = req.nextUrl.clone()
  const username = url.pathname.replace('/u/', '')
  const ua = parser(headers.get('user-agent')!)

  if (!ua.os.name) {
    const result = await fetch(
      `http://localhost:4783/api/profile?handle=${username}`
    )
    const data = await result.json()
    const profile: Profile = data?.profile

    return new Response(
      `<!DOCTYPE html>
<html lang="en">
  <title>${`${profile?.name} (@${profile?.handle}) • Lenster`}</title>
  <meta name="description" content="${profile?.bio}" />
</html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }
}
