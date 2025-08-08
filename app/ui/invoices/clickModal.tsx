'use client'

import { formatCurrency } from '@/app/lib/utils';
import { use, useMemo } from 'react';
import { Remarkable } from 'remarkable';

const md = new Remarkable();

type Props = {
  markdown?: Promise<{name:string; price: number}[]>;
};

export default function MarkdownPreview({ markdown }: Props) 
{
  const datos = markdown && use(markdown);
  const product = useMemo(() => {
    return datos?.map(p => `- ${p.name}: ${formatCurrency(p.price)}`)
      .join('\n').toString();
  }, [datos]);

  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(product??'')}}
    />
  );
}
