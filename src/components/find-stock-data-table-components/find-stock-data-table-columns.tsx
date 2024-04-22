"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { StockSecuritySectorFormat } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";

export const findStockColumns: ColumnDef<StockSecuritySectorFormat>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Symbol",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Symbol" />,
    cell: ({ row }) => {
      const symbol = row.getValue("Symbol");

      return <div>{symbol as React.ReactNode}</div>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "Security",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock Name" />,
    cell: ({ row }) => {
      const security = row.getValue("Security");

      return <div>{security as React.ReactNode}</div>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "GICS Sector",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Sector" />,
    cell: ({ row }) => {
      const sector = row.getValue("GICS Sector");

      return <div>{sector as React.ReactNode}</div>;
    },
    enableHiding: false,
  },
];
