"use client";

import { MA_AnalysisResult } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

export const columns: ColumnDef<MA_AnalysisResult>[] = [
  {
    accessorKey: "shortMA",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Short EMA Period" />
    ),
    cell: ({ row }) => {
      const shortMA = row.getValue("shortMA");

      return <div>{shortMA as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "longMA",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Long EMA Period" />
    ),
    cell: ({ row }) => {
      const longMA = row.getValue("longMA");

      return <div>{longMA as React.ReactNode}</div>;
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
  {
    accessorKey: "winPercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Win Percentage" />
    ),
    cell: ({ row }) => {
      const winPercentage = row.getValue("winPercentage");

      return <div>{winPercentage as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "numberOfTrades",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Number of Trades" />
    ),
    cell: ({ row }) => {
      const numberOfTrades = row.getValue("numberOfTrades");

      return <div>{numberOfTrades as React.ReactNode}</div>;
    },
  },
];
