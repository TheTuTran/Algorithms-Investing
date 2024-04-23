"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

export const columns: ColumnDef<{
  symbol: string;
  security: string;
  industry: string;
  date: Date;
}>[] = [
  {
    accessorKey: "symbol",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Symbol" />,
    cell: ({ row }) => {
      const symbol = row.getValue("symbol");

      return <div>{symbol as React.ReactNode}</div>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "security",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock Name" />,
    cell: ({ row }) => {
      const security = row.getValue("security");

      return <div>{security as React.ReactNode}</div>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "industry",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Sector" />,
    cell: ({ row }) => {
      const industry = row.getValue("industry");

      return <div>{industry as React.ReactNode}</div>;
    },
    enableHiding: false,
  },
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
    },
    enableHiding: false,
  },
  {
    accessorKey: "buyPrice",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock Price at Date" />,
    cell: ({ row }) => {
      const buyPrice = row.getValue("buyPrice");

      return <div>{Number(buyPrice).toFixed(2) as React.ReactNode}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "curPrice",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Current Stock Price" />,
    cell: ({ row }) => {
      const curPrice = row.getValue("curPrice");

      return <div>{curPrice as React.ReactNode}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
];
