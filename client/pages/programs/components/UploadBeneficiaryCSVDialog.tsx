import { useState } from "react";
import Papa from "papaparse";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Download, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useBulkCreateBeneficiariesWithProgram } from "@/services/mutations/beneficiary";
import {
  bulkBeneficiaryItemSchema,
  type BulkBeneficiaryItem,
} from "@/services/schemas/beneficiary";
import { ProgramData } from "@/types/base";

interface UploadBeneficiaryCSVDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subProgram?: ProgramData;
  onSuccess?: () => void;
}

interface ParsedRowWithValidation extends BulkBeneficiaryItem {
  _rowNumber: number;
  _isValid: boolean;
  _errors?: string[];
}

export function UploadBeneficiaryCSVDialog({
  open,
  onOpenChange,
  subProgram,
  onSuccess,
}: UploadBeneficiaryCSVDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRowWithValidation[]>([]);
  const [parseErrors, setParseErrors] = useState<Papa.ParseError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const programId = subProgram?.id || 0;
  const expectedCategory = subProgram?.kategori;

  const bulkCreateMutation = useBulkCreateBeneficiariesWithProgram(programId, {
    onSuccess: () => {
      onSuccess?.();
      handleClose();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      toast.error("File tidak valid", {
        description: "Harap pilih file CSV",
      });
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);

    Papa.parse<Record<string, string>>(selectedFile, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      transformHeader: (header) => {
        // Transform headers to match expected field names
        const headerMap: Record<string, string> = {
          email: "email",
          "nama lengkap": "fullName",
          "full name": "fullName",
          fullname: "fullName",
          "nomor telepon": "phoneNumber",
          "phone number": "phoneNumber",
          phone: "phoneNumber",
          nik: "nik",
          "tanggal lahir": "dateOfBirth",
          "date of birth": "dateOfBirth",
          dateofbirth: "dateOfBirth",
          "ktp photo": "ktpPhotoUrl",
          "foto ktp": "ktpPhotoUrl",
          ktpphoto: "ktpPhotoUrl",
          "selfie photo": "selfiePhotoUrl",
          "foto selfie": "selfiePhotoUrl",
          selfiephoto: "selfiePhotoUrl",
        };

        const normalizedHeader = header.toLowerCase().trim();
        return headerMap[normalizedHeader] || header;
      },
      complete: (results) => {
        setIsProcessing(false);
        setParseErrors(results.errors);

        // Validate and process parsed data
        const processedData: ParsedRowWithValidation[] = results.data.map(
          (row, index) => {
            // Auto-apply default passwordHash and role for beneficiaries
            const rowWithDefaults: BulkBeneficiaryItem = {
              ...(row as BulkBeneficiaryItem),
              kategori: (expectedCategory ??
                (row as BulkBeneficiaryItem)
                  .kategori) as BulkBeneficiaryItem["kategori"],
              passwordHash: "password12345" as const,
              role: "BENEFICIARY" as const,
              blockchainWalletAddress: "" as const,
            };

            const validation =
              bulkBeneficiaryItemSchema.safeParse(rowWithDefaults);

            if (validation.success) {
              return {
                ...validation.data,
                _rowNumber: index + 2, // +2 because of header and 0-based index
                _isValid: true,
                _errors: undefined,
              };
            }

            const errors = validation.error.issues.map(
              (err) => `${err.path.join(".")}: ${err.message}`,
            );
            return {
              ...rowWithDefaults,
              _rowNumber: index + 2,
              _isValid: false,
              _errors: errors,
            };
          },
        );

        setParsedData(processedData);

        const validCount = processedData.filter((d) => d._isValid).length;
        const invalidCount = processedData.length - validCount;

        if (invalidCount > 0) {
          toast.warning(`${invalidCount} baris memiliki error validasi`, {
            description: `${validCount} baris valid siap untuk diunggah`,
          });
        } else {
          toast.success(`${validCount} baris berhasil diparse`, {
            description: "Semua data valid, siap untuk diunggah",
          });
        }
      },
      error: (error) => {
        setIsProcessing(false);
        toast.error("Gagal memparse CSV", {
          description: error.message,
        });
      },
    });
  };

  const handleSubmit = () => {
    const validData = parsedData
      .filter((d) => d._isValid)
      .map(({ _rowNumber, _isValid, _errors, ...data }) => data);

    if (validData.length === 0) {
      toast.error("Tidak ada data valid untuk diunggah");
      return;
    }

    bulkCreateMutation.mutate({ users: validData });
  };

  const handleDownloadTemplate = () => {
    const template: Omit<
      BulkBeneficiaryItem,
      "passwordHash" | "role" | "kategori"
    >[] = [
      {
        email: "beneficiary@example.com",
        fullName: "Nama Lengkap",
        phoneNumber: "6281234567890",
        nik: "3173010101010001",
        dateOfBirth: "1990-01-01",
        ktpPhotoUrl: "https://example.com/ktp.jpg",
        selfiePhotoUrl: "https://example.com/selfie.jpg",
      },
    ];

    const csv = Papa.unparse(template, {
      header: true,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "template_beneficiary.csv";
    link.click();
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setParseErrors([]);
    setIsProcessing(false);
    onOpenChange(false);
  };

  const validCount = parsedData.filter((d) => d._isValid).length;
  const invalidCount = parsedData.length - validCount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Unggah CSV Penerima Dana</DialogTitle>
          <DialogDescription>
            <div className="space-y-2">
              <p>
                Upload file CSV untuk mendaftarkan penerima dana (beneficiary)
                secara massal ke sub-program ini. Password akan otomatis
                dihasilkan.
              </p>
              {subProgram && (
                <div className="pt-1 space-y-1 border-t border-slate-300 text-sm">
                  <p className="font-medium text-slate-600">
                    Untuk Sub-Program{" "}
                    <span className="font-semibold">{subProgram.name}</span> di
                    kategori{" "}
                    <span className="font-semibold">{subProgram.kategori}</span>
                  </p>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Download Template */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex-1">
              <h4 className="font-medium text-sm text-blue-900">
                Belum punya template?
              </h4>
              <p className="text-xs text-blue-700 mt-1">
                Download template CSV untuk memudahkan input data
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
          </div>

          {/* File Input */}
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              disabled={isProcessing || bulkCreateMutation.isPending}
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="h-10 w-10 text-slate-400" />
              <div>
                <p className="text-sm font-medium">
                  {Boolean(file) ? file.name : "Klik untuk memilih file CSV"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  File CSV dengan format yang sesuai
                </p>
              </div>
            </label>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
              Memproses file...
            </div>
          )}

          {/* Parse Errors */}
          {parseErrors.length > 0 && (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-amber-900">
                    Peringatan Parsing ({parseErrors.length} error)
                  </h4>
                  <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                    {parseErrors.slice(0, 5).map((error, idx) => (
                      <p key={idx} className="text-xs text-amber-700">
                        Baris {error.row}: {error.message}
                      </p>
                    ))}
                    {parseErrors.length > 5 && (
                      <p className="text-xs text-amber-700 italic">
                        ...dan {parseErrors.length - 5} error lainnya
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Validation Summary */}
          {parsedData.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Data Valid
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {validCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">
                      Data Invalid
                    </p>
                    <p className="text-2xl font-bold text-red-700">
                      {invalidCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview Table */}
          {parsedData.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b">
                <h4 className="font-medium text-sm">
                  Preview Data (10 baris pertama)
                </h4>
              </div>
              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-xs">
                  <thead className="bg-slate-100 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">
                        Status
                      </th>
                      <th className="px-3 py-2 text-left font-medium">Baris</th>
                      <th className="px-3 py-2 text-left font-medium">Email</th>
                      <th className="px-3 py-2 text-left font-medium">
                        Nama Lengkap
                      </th>
                      <th className="px-3 py-2 text-left font-medium">NIK</th>
                      <th className="px-3 py-2 text-left font-medium">
                        Telepon
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {parsedData.slice(0, 10).map((row, idx) => (
                      <tr
                        key={idx}
                        className={Boolean(row._isValid) ? "" : "bg-red-50"}
                      >
                        <td className="px-3 py-2">
                          {Boolean(row._isValid) ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                        </td>
                        <td className="px-3 py-2 text-slate-600">
                          {row._rowNumber}
                        </td>
                        <td className="px-3 py-2">{row.email || "-"}</td>
                        <td className="px-3 py-2">{row.fullName || "-"}</td>
                        <td className="px-3 py-2">{row.nik || "-"}</td>
                        <td className="px-3 py-2">{row.phoneNumber || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Invalid Rows Details */}
              {invalidCount > 0 && (
                <div className="bg-red-50 p-4 border-t">
                  <h5 className="font-medium text-sm text-red-900 mb-2">
                    Error Validasi:
                  </h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {parsedData
                      .filter((d) => !d._isValid)
                      .slice(0, 5)
                      .map((row, idx) => (
                        <div key={idx} className="text-xs">
                          <p className="font-medium text-red-800">
                            Baris {row._rowNumber}:
                          </p>
                          <ul className="ml-4 list-disc text-red-700">
                            {row._errors?.map((error, i) => (
                              <li key={i}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    {invalidCount > 5 && (
                      <p className="text-xs text-red-700 italic">
                        ...dan {invalidCount - 5} baris invalid lainnya
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={bulkCreateMutation.isPending}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              validCount === 0 || isProcessing || bulkCreateMutation.isPending
            }
            className="gap-2"
          >
            {bulkCreateMutation.isPending ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Mengunggah...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Unggah {validCount} Penerima Dana
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
