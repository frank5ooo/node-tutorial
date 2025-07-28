import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function ProductStatus({ invoice_id }: { invoice_id: string | null }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100 text-gray-500': invoice_id === 'OnStock',
          'bg-green-500 text-white': invoice_id === 'Sell',
        },
      )}
    >
      {invoice_id === null ? (
        <>
          OnStock
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {invoice_id === 'Sell' ? (
        <>
          Sell
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
