import { ChildrenNode, Matcher } from 'interweave'
import React from 'react'

export class MDItalicMatcher extends Matcher {
  replaceWith(children: ChildrenNode) {
    return <i>{children}</i>
  }

  asTag(): string {
    return 'i'
  }

  match(value: string) {
    return this.doMatch(value, /\*(.*?)\*/u, (matches) => ({
      match: matches[1]
    }))
  }
}
