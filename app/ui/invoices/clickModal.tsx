'use client'

import { Remarkable } from 'remarkable';

const md = new Remarkable();

type Props = {
  markdown: string;
};

export default function MarkdownPreview({ markdown }: Props) 
{
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}