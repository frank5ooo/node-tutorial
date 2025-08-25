'use client'

import { formatCurrency } from '@/app/lib/utils';
import { use, useMemo } from 'react';
import { Remarkable } from 'remarkable';

const md = new Remarkable();

type Props = {
  markdown?: {name:string; price: number}[];
};

export default function MarkdownPreview({ markdown }: Props) 
{
  const product = useMemo(() => {
    return markdown?.map(p => `- ${p.name}: ${formatCurrency(p.price)}`)
      .join('\n').toString();
  }, [markdown]);

  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(product??'')}}
    />
  );
}
