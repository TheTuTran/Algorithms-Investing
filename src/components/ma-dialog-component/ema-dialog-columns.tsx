"use client";

import { MA_Signal } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";

export const dialogue_columns: ColumnDef<MA_Signal>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString(),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Closing Price" />
    ),
    cell: ({ row }) => {
      const price = row.getValue("price");

      return <div>{price as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "shortMA",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Short EMA" />
    ),
    cell: ({ row }) => {
      const shortMA = row.getValue("shortMA");

      return <div>{shortMA as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "longMA",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Long EMA" />
    ),
    cell: ({ row }) => {
      const longMA = row.getValue("longMA");

      return <div>{longMA as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "holding",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Holding Stock?" />
    ),
    cell: ({ row }) => {
      const holding = row.getValue("holding");

      return <div>{holding == 1 ? "Yes" : ("No" as React.ReactNode)}</div>;
    },
  },
  {
    accessorKey: "positions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Buy or Sell" />
    ),
    cell: ({ row }) => {
      const positions = row.getValue("positions");

      return (
        <div>
          {positions == 1
            ? "Buy"
            : positions == -1
            ? "Sell"
            : ("" as React.ReactNode)}
        </div>
      );
    },
  },
  {
    accessorKey: "signalProfit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Signal Profit" />
    ),
    cell: ({ row }) => {
      const signalProfit = row.getValue("signalProfit");

      return <div>{signalProfit as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "cumulativeProfit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cumulative Profit" />
    ),
    cell: ({ row }) => {
      const cumulativeProfit = row.getValue("cumulativeProfit");
      return <div>{cumulativeProfit as React.ReactNode}</div>;
    },
  },
];
