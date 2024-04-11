"use client";

import { Stoch_AnalysisResult } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

export const columns: ColumnDef<Stoch_AnalysisResult>[] = [
  {
<<<<<<< HEAD:src/app/stochastic/columns.tsx
    accessorKey: "oversoldStoch",
=======
    accessorKey: "fastMA",
>>>>>>> 272a5c3d4bfb2430c9ef894ac02c243bc6b5e9c9:src/app/stochastic-ma/columns.tsx
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Oversold Stoch Lv" />
    ),
    cell: ({ row }) => {
<<<<<<< HEAD:src/app/stochastic/columns.tsx
      const oversoldStoch = row.getValue("oversoldStoch");

      return <div>{oversoldStoch as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "overboughtStoch",
=======
      const fastMA = row.getValue("fastMA");

      return <div>{fastMA as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "slowMA",
>>>>>>> 272a5c3d4bfb2430c9ef894ac02c243bc6b5e9c9:src/app/stochastic-ma/columns.tsx
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Overbought Stoch Lv" />
    ),
    cell: ({ row }) => {
<<<<<<< HEAD:src/app/stochastic/columns.tsx
      const overboughtStoch = row.getValue("overboughtStoch");

      return <div>{overboughtStoch as React.ReactNode}</div>;
=======
      const slowMA = row.getValue("slowMA");

      return <div>{slowMA as React.ReactNode}</div>;
>>>>>>> 272a5c3d4bfb2430c9ef894ac02c243bc6b5e9c9:src/app/stochastic-ma/columns.tsx
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
