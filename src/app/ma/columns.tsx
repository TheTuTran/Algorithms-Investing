"use client";

import { SmaAnalysisResult } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";

export const columns: ColumnDef<SmaAnalysisResult>[] = [
  {
    accessorKey: "shortSma",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Short SMA Period" />
    ),
    cell: ({ row }) => {
      const shortSma = row.getValue("shortSma");

      return <div>{shortSma as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "longSma",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Long SMA Period" />
    ),
    cell: ({ row }) => {
      const longSma = row.getValue("longSma");

      return <div>{longSma as React.ReactNode}</div>;
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
