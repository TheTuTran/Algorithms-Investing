"use client";

import * as React from "react";
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/find-stock-table";
import { Input } from "../ui/input";
import { StockSecuritySectorFormat } from "@/lib/types";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setSelectedRows: React.Dispatch<React.SetStateAction<StockSecuritySectorFormat[]>>;
}

export function FindStockFilterDataTable<TData, TValue>({ columns, data, setSelectedRows }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-8 items-center py-4">
        <Input
          placeholder="Filter Symbol..."
          value={(table.getColumn("Symbol")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("Symbol")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <Input
          placeholder="Filter Stock Name..."
          value={(table.getColumn("Security")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("Security")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <Input
          placeholder="Filter Sector..."
          value={(table.getColumn("GICS Sector")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("GICS Sector")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    row.toggleSelected(!row.getIsSelected());
                  }}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        <Button
          className="ml-auto"
          type="button"
          onClick={() => {
            let filteredRows = table.getSelectedRowModel().rows;
            let temp: StockSecuritySectorFormat[] = [];
            filteredRows.forEach((row) => {
              temp.push({
                Symbol: row.getValue("Symbol"),
                Security: row.getValue("Security"),
                "GICS Sector": row.getValue("GICS Sector"),
              });
            });
            setSelectedRows(temp);
            toast({
              title: "Sucess",
              description: "Saved filtered stocks, you may close out of this window.",
            });
          }}
        >
          Save changes
        </Button>
      </div>
    </div>
  );
}
