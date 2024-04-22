"use client";

import { MA_AnalysisResult } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

export const columns: ColumnDef<MA_AnalysisResult>[] = [
  {
    accessorKey: "fastMA",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fast SMA Period" />,
    cell: ({ row }) => {
      const fastMA = row.getValue("fastMA");

      return <div>{fastMA as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "slowMA",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Slow SMA Period" />,
    cell: ({ row }) => {
      const slowMA = row.getValue("slowMA");

      return <div>{slowMA as React.ReactNode}</div>;
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
  {
    accessorKey: "winPercentage",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Win Percentage" />,
    cell: ({ row }) => {
      const winPercentage = row.getValue("winPercentage");

      return <div>{winPercentage as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "numberOfTrades",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Number of Trades" />,
    cell: ({ row }) => {
      const numberOfTrades = row.getValue("numberOfTrades");

      return <div>{numberOfTrades as React.ReactNode}</div>;
    },
  },
];
