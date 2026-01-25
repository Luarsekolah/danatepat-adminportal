import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePickerInput } from "@/components/ui/calendar";

interface FiltersProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onApplySearch: () => void;
  queryStartDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  queryEndDate: Date | undefined;
  onEndDateChange: (date: Date | undefined) => void;
}

export function Filters({
  searchInput,
  onSearchInputChange,
  onSearchKeyDown,
  onApplySearch,
  queryStartDate,
  onStartDateChange,
  queryEndDate,
  onEndDateChange,
}: FiltersProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Hash Transaksi
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Cari hash transaksi blockchain..."
                value={searchInput}
                onChange={(e) => onSearchInputChange(e.target.value)}
                onKeyDown={onSearchKeyDown}
                className="flex-1"
              />
              <Button
                onClick={onApplySearch}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Search className="h-4 w-4" />
                Cari
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Tanggal Mulai
            </label>
            <DatePickerInput
              value={queryStartDate}
              onChange={onStartDateChange}
              placeholder="Pilih tanggal mulai"
              displayFormat="dd MMMM yyyy"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Tanggal Selesai
            </label>
            <DatePickerInput
              value={queryEndDate}
              onChange={onEndDateChange}
              placeholder="Pilih tanggal selesai"
              displayFormat="dd MMMM yyyy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
