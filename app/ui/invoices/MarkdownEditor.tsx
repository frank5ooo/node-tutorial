'use client'

import { useState, Suspense} from 'react';
import Loading from './loading';
import { fetchProducts } from '@/app/lib/actions';
import { LinkIcon } from '@heroicons/react/24/outline';
import 'react-tooltip/dist/react-tooltip.css'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 15,
    maxWidth: 300, // limita ancho para que no sea muy ancho
  },
}));


import MarkdownPreview from './clickModal';


export default function MarkdownEditor({ id }: { id: string }) 
{
  const [open, setOpen] = React.useState(false);
  const [fetchDatos, setFetchDatos] = useState<ReturnType<typeof fetchProducts>>();
  
  const handleTooltipClose = () => {
    setOpen(false);
  };
  
  const handleTooltipOpen = () => {
    setOpen(true);

    if(!fetchDatos) setFetchDatos(fetchProducts(id));
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <div>
          <LightTooltip
            onClose={handleTooltipClose}
            arrow
            open={open}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title={(
              <Suspense fallback={<Loading />}>
                <MarkdownPreview markdown={fetchDatos} />
              </Suspense>
            )}
          >
            <button
              onClick={handleTooltipOpen}
              className="relative pl-10 py-2 px-4 rounded border border-gray-300 hover:bg-gray-100"
              type="button"
              aria-label="Ver preview"
            >
              <LinkIcon
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                aria-hidden="true"
              />
            </button>
          </LightTooltip>
        </div>
      </ClickAwayListener>
    </>
  );
}
