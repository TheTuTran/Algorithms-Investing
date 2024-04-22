import { Dispatch, FC, SetStateAction } from "react";
import { findStockColumns } from "@/components/find-stock-data-table-components/find-stock-data-table-columns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/table-dialog";
import { FindStockFilterDataTable } from "@/components/find-stock-data-table-components/find-stock-data-table";
import { Button } from "../ui/button";
import { snp_array } from "@/lib/data/snp_500";
import { StockSecuritySectorFormat } from "@/lib/types";

interface FindStockFilterProps {
  selectedRows: StockSecuritySectorFormat[];
  setSelectedRows: Dispatch<SetStateAction<StockSecuritySectorFormat[]>>;
}

const FindStockFilter: FC<FindStockFilterProps> = ({ selectedRows, setSelectedRows }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{selectedRows.length > 0 ? selectedRows.length : 503} Stocks</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Stocks</DialogTitle>
          <DialogDescription>Filter stocks based on the sector or the stock name. Click save changes when you are done.</DialogDescription>
        </DialogHeader>
        <FindStockFilterDataTable columns={findStockColumns} data={snp_array} setSelectedRows={setSelectedRows} />
      </DialogContent>
    </Dialog>
  );
};

export default FindStockFilter;
