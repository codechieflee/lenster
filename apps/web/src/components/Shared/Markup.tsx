import { HashtagMatcher } from '@components/utils/matchers/HashtagMatcher';
import { MDBoldMatcher } from '@components/utils/matchers/markdown/MDBoldMatcher';
import { MDCodeMatcher } from '@components/utils/matchers/markdown/MDCodeMatcher';
import { MDItalicMatcher } from '@components/utils/matchers/markdown/MDItalicMatcher';
import { MDLinkMatcher } from '@components/utils/matchers/markdown/MDLinkMatcher';
import { MentionMatcher } from '@components/utils/matchers/MentionMatcher';
import { ParenthesesUrlMatcher, UrlMatcher } from '@components/utils/matchers/UrlMatcher';
import trimify from '@lib/trimify';
import { Interweave } from 'interweave';
import type { FC, MouseEvent } from 'react';

interface Props {
  children: string;
  className?: string;
  matchOnlyUrl?: boolean;
}

const Markup: FC<Props> = ({ children, className = '', matchOnlyUrl }) => {
  const defaultMatchers = [
    new MDCodeMatcher('mdCode'),
    new MentionMatcher('mention'),
    new MDLinkMatcher('mdLink'),
    new ParenthesesUrlMatcher('pUrl'),
    new UrlMatcher('url'),
    new HashtagMatcher('hashtag'),
    new MDBoldMatcher('mdBold'),
    new MDItalicMatcher('mdItalic')
  ];

  return (
    <Interweave
      className={className}
      content={trimify(children)}
      escapeHtml
      allowList={['b', 'i', 'a', 'br', 'code', 'span']}
      matchers={matchOnlyUrl ? [new ParenthesesUrlMatcher('pUrl'), new UrlMatcher('url')] : defaultMatchers}
      onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
    />
  );
};

export default Markup;
