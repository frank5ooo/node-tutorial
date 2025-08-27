"use client";

import { useState, Suspense } from "react";
import Loading from "./loading";
import { fetchProductsByInvoiceId } from "@/app/lib/data/fetch-products-by-invoiceId";
import { LinkIcon } from "@heroicons/react/24/outline";
import "react-tooltip/dist/react-tooltip.css";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MarkdownPreview from "./clickModal";

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 15,
    maxWidth: 300, // limita ancho para que no sea muy ancho
  },
}));

type ProductData = { name: string; price: BigInt };

export default function MarkdownEditor({ id }: { id: string }) {
  const [open, setOpen] = React.useState(false);
  const [fetchDatos, setFetchDatos] = React.useState<ProductData[] | null>(
    null
  );

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);

    if (!fetchDatos) {
      fetchProductsByInvoiceId({ id }).then((res) => {
        if (res.data) {
          // Nos quedamos solo con el array de productos
          setFetchDatos(res.data);
        } else {
          console.error("Error al traer productos:", res);
        }
      });
    }
  };

  // console.log("fetchDatos1", fetchDatos);
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
            title={
              <Suspense fallback={<Loading />}>
                {fetchDatos ? (
                  <MarkdownPreview markdown={fetchDatos} />
                ) : (
                  <Loading />
                )}
              </Suspense>
            }
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
