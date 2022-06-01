import { hashflags } from 'data/hashflags'
import { Matcher } from 'interweave'
import Link from 'next/link'
import React from 'react'
import { STATIC_ASSETS } from 'src/constants'

export function Hashtag({ ...props }: any) {
  const hashflag = props.display.slice(1).toLowerCase()
  const hasHashflag = hashflags.includes(hashflag)

  return (
    <span className="inline-flex items-center space-x-1">
      <span>
        <Link
          href={`/search?q=${props.display.slice(1)}&type=pubs&src=link_click`}
          prefetch={false}
        >
          {props.display}
        </Link>
      </span>
      {hasHashflag && (
        <img
          className="h-4 !mr-0.5"
          height={16}
          src={`${STATIC_ASSETS}/hashflags/${hashflag}.png`}
          alt={hashflag}
        />
      )}
    </span>
  )
}

export class HashtagMatcher extends Matcher {
  replaceWith(match: string, props: any) {
    return React.createElement(Hashtag, props, match)
  }

  asTag(): string {
    return 'a'
  }

  match(value: string) {
    return this.doMatch(value, /\B#(\w+)/, (matches) => {
      return {
        display: matches[0]
      }
    })
  }
}
