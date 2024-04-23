"use client";

import { MA_Signal } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";

export const dialogue_columns: ColumnDef<MA_Signal>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        return date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
    }
  },
  {
    accessorKey: "price",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Closing Price" />,
    cell: ({ row }) => {
      const price = row.getValue("price");

      return <div>{price as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "fastMA",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fast SMA" />,
    cell: ({ row }) => {
      const fastMA = row.getValue("fastMA");

      return <div>{fastMA as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "slowMA",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Slow SMA" />,
    cell: ({ row }) => {
      const slowMA = row.getValue("slowMA");

      return <div>{slowMA as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "holding",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Holding Stock?" />,
    cell: ({ row }) => {
      const holding = row.getValue("holding");
      const considerLongEntries = localStorage.getItem("considerLongEntries");
      const considerShortEntries = localStorage.getItem("considerShortEntries");

      return <div>{holding === 1 && considerLongEntries === "true" ? "Long Position" : holding === -1 && considerShortEntries === "true" ? "Short Position" : "No"}</div>;
    },
  },
  {
    accessorKey: "positions",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Buy or Sell" />,
    cell: ({ row }) => {
      const positions = row.getValue("positions");

      return <div>{positions == 1 ? "Buy" : positions == -1 ? "Sell" : ("" as React.ReactNode)}</div>;
    },
  },
  {
    accessorKey: "signalProfit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Signal Profit" />,
    cell: ({ row }) => {
      const signalProfit = row.getValue("signalProfit");

      return <div>{signalProfit as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "cumulativeProfit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cumulative Profit" />,
    cell: ({ row }) => {
      const cumulativeProfit = row.getValue("cumulativeProfit");
      return <div>{cumulativeProfit as React.ReactNode}</div>;
    },
  },
];
