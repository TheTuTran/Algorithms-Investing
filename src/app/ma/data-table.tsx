"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BeatLoader } from "react-spinners";
import { DataTablePagination } from "@/components/data-table-pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/table-dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { DialogDataTable } from "../../components/ma-dialog-component/dialog-data-table";
import { dialogue_columns } from "../../components/ma-dialog-component/sma-dialog-columns";
import { MA_Signal, MA_AnalysisResult, StrategyType, Quote } from "@/lib/types";
import { generateMovingAverageSignals } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [smaData, setSmaData] = React.useState<MA_Signal[]>([]);
  const [selectedShortSma, setSelectedShortSma] = React.useState<number>(0);
  const [selectedLongSma, setSelectedLongSma] = React.useState<number>(0);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const dialogTriggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
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
                  className="cursor-pointer"
                  onClick={() => {
                    const storedData = localStorage.getItem("fetchedData");

                    if (storedData) {
                      const parsedData: Quote[] = JSON.parse(storedData);
                      const dates = parsedData.map((entry) => entry.date);
                      const closingPrices = parsedData.map(
                        (entry) => entry.close
                      );
                      const shortSma = (row.original as MA_AnalysisResult)
                        .shortMA;
                      const longSma = (row.original as MA_AnalysisResult)
                        .longMA;
                      setSelectedShortSma(shortSma);
                      setSelectedLongSma(longSma);

                      const considerLongEntries = localStorage.getItem(
                        "considerLongEntries"
                      );
                      const considerShortEntries = localStorage.getItem(
                        "considerShortEntries"
                      );
                      let strategyType;
                      if (
                        considerLongEntries &&
                        considerShortEntries === "false"
                      ) {
                        strategyType = StrategyType.Buying;
                      } else if (
                        considerLongEntries === "false" &&
                        considerShortEntries
                      ) {
                        strategyType = StrategyType.Shorting;
                      } else if (considerLongEntries && considerShortEntries) {
                        strategyType = StrategyType.Both;
                      }

                      if (!strategyType) {
                        return;
                      }
                      const signals = generateMovingAverageSignals(
                        dates,
                        closingPrices,
                        shortSma,
                        longSma,
                        true,
                        strategyType
                      );
                      setSmaData(signals.reverse());
                    } else {
                      console.error(
                        "No fetched data available in localStorage."
                      );
                    }

                    dialogTriggerRef.current?.click();
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoading ? (
                    <div>
                      <BeatLoader color="#94a3b7" size={8} />
                    </div>
                  ) : (
                    <>No results.</>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      <Dialog>
        <DialogTrigger ref={dialogTriggerRef} asChild>
          <button hidden>Open</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {`Table with ${selectedShortSma} day SMA for Short and ${selectedLongSma} day SMA for Long`}
            </DialogTitle>
            <DialogDescription>
              <DialogDataTable columns={dialogue_columns} data={smaData} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
