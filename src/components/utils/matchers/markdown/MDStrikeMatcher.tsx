import { ChildrenNode, Matcher } from 'interweave'
import React from 'react'

export class MDStrikeMatcher extends Matcher {
  replaceWith(children: ChildrenNode) {
    return <s>{children}</s>
  }

  asTag(): string {
    return 's'
  }

  match(value: string) {
    return this.doMatch(value, /~~(.*?)~~/u, (matches) => ({
      match: matches[1]
    }))
  }
}
