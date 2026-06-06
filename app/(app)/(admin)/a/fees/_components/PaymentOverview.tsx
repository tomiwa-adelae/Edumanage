import React from "react";
import { FeesSearchComponent } from "../../_components/FeesSearchComponent";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FeeRow } from "./FeeRow";
import { FeeCard } from "./FeeCard";

export const PaymentOverview = () => {
  return (
    <div className="space-y-4">
      <FeesSearchComponent />
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Student</TableHead>
              <TableHead>Fee type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Paid date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <FeeRow />
            <FeeRow />
            <FeeRow />
            <FeeRow />
            <FeeRow />
            <FeeRow />
          </TableBody>
        </Table>
      </div>
      <div className="md:hidden space-y-4">
        <FeeCard />
        <FeeCard />
        <FeeCard />
        <FeeCard />
        <FeeCard />
      </div>
    </div>
  );
};
