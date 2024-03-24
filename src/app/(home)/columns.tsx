"use client";

import { StockData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

export const columns: ColumnDef<StockData>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString(),
  },
  {
    accessorKey: "open",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Open" />
    ),
    cell: ({ row }) => {
      const open = row.getValue("open");

      return <div>{open as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "high",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="High" />
    ),
    cell: ({ row }) => {
      const high = row.getValue("high");

      return <div>{high as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "low",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Low" />
    ),
    cell: ({ row }) => {
      const low = row.getValue("low");

      return <div>{low as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "close",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Close" />
    ),
    cell: ({ row }) => {
      const close = row.getValue("close");

      return <div>{close as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "adjClose",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Adjusted Close" />
    ),
    cell: ({ row }) => {
      const adjClose = row.getValue("adjClose");

      return <div>{adjClose as React.ReactNode}</div>;
    },
  },
  {
    accessorKey: "volume",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Volume" />
    ),
    cell: ({ row }) => {
      const volume = row.getValue("volume");
      return <div>{volume as React.ReactNode}</div>;
    },
  },
];
