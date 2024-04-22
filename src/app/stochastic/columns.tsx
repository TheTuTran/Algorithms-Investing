"use client";

import { Stoch_AnalysisResult } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

export const columns: ColumnDef<Stoch_AnalysisResult>[] = [
  {
    accessorKey: "oversoldStoch",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Oversold Stoch Lv" />,
    cell: ({ row }) => {
      const oversoldStoch = row.getValue("oversoldStoch");

      return <div>{oversoldStoch as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "overboughtStoch",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Overbought Stoch Lv" />,
    cell: ({ row }) => {
      const overboughtStoch = row.getValue("overboughtStoch");

      return <div>{overboughtStoch as React.ReactNode}</div>;
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
