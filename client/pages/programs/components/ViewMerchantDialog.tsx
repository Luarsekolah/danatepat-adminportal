import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetMerchantProfile } from "@/services/queries/merchant";
import type { MerchantItem } from "../merchant";
import QRCode from "react-qr-code";
import { stringToLatLngTuple } from "@/lib/utils";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface ViewMerchantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchant: MerchantItem | null;
}

function MerchantMap({ profile }: { profile: any }) {
  const position: [number, number] = stringToLatLngTuple(profile.latlon);

  return (
    <MapContainer
      center={position}
      zoom={16}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position}>
        <Popup>
          <div className="space-y-1 min-w-max">
            <p className="text-sm font-semibold text-slate-900 mt-0.5">
              {profile.businessName}
            </p>
            <p className="text-xs text-slate-700 mt-0.5 max-w-xs leading-snug">
              {profile.alamat}
            </p>

            {profile.kategori && (
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase">
                  Kategori
                </p>
                <p className="text-xs text-slate-700 mt-0.5">
                  {profile.kategori}
                </p>
              </div>
            )}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export function ViewMerchantDialog({
  open,
  onOpenChange,
  merchant,
}: ViewMerchantDialogProps) {
  // Fetch detailed merchant profile
  const profileQuery = useGetMerchantProfile(merchant?.id || 0, {
    enabled: open && !!merchant?.id,
  });

  if (!merchant) return null;

  const profile = profileQuery.data?.data;
  const isLoading = profileQuery.isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detail Merchant</DialogTitle>
          <DialogDescription>Informasi lengkap merchant</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Business Information */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Nama Bisnis
                </p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {profile.businessName || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Kategori
                </p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {profile.kategori || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {profile.status || "—"}
                </p>
              </div>
            </div>

            {/* Bank Information */}
            <div className="border-t border-slate-200 pt-4 space-y-4">
              <h3 className="font-semibold text-slate-900">Informasi Bank</h3>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Nama Bank
                </p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {profile.bankName || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Nomor Rekening
                </p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {profile.bankAccountNumber || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Pemilik Rekening
                </p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {profile.bankAccountHolder || "—"}
                </p>
              </div>
            </div>

            {/* Location Information */}
            {profile.alamat && (
              <div className="border-t border-slate-200 pt-4 space-y-4">
                <h3 className="font-semibold text-slate-900">
                  Informasi Lokasi
                </h3>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Alamat
                  </p>
                  <p className="text-sm font-medium text-slate-900 mt-1">
                    {profile.alamat}
                  </p>
                </div>

                {profile.latlon && (
                  <div>
                    <p className="mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Peta Lokasi
                    </p>
                    <p className="text-xs text-slate-600 mb-2">
                      Klik penanda untuk melihat detail lokasi
                    </p>
                    <div className="h-64 w-full rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                      <MerchantMap profile={profile} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* QRIS Data */}
            {profile.qrisData && (
              <div className="border-t border-slate-200 pt-4 space-y-4">
                <h3 className="font-semibold text-slate-900">Data QRIS</h3>

                <div className="flex items-center justify-center">
                  {profile.qrisData ? (
                    <QRCode value={profile.qrisData} />
                  ) : (
                    <p>Tidak ada data QRIS yang tersedia untuk merchant ini</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">Gagal memuat data merchant</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
