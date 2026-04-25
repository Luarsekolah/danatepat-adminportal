import { Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { id } from "zod/locales";

// Sample merchant data with realistic coordinates (Indonesia-based)
const SAMPLE_MERCHANTS = [
  {
    id: 1,
    businessName: "Warung Makan Sari",
    kategori: "PANGAN",
    alamat: "Jl. Merdeka No. 123, Jakarta Pusat",
    latlon: "-6.2088,106.8456",
    status: "ACTIVE",
  },
  {
    id: 2,
    businessName: "Klinik Sehat Bersama",
    kategori: "KESEHATAN",
    alamat: "Jl. Ahmad Yani No. 45, Bandung",
    latlon: "-6.9147,107.6098",
    status: "ACTIVE",
  },
  {
    id: 3,
    businessName: "Toko Buku Ilmu",
    kategori: "PENDIDIKAN",
    alamat: "Jl. Diponegoro No. 78, Surabaya",
    latlon: "-7.2504,112.7581",
    status: "ACTIVE",
  },
  {
    id: 4,
    businessName: "Rumah Makan Padang Indah",
    kategori: "PANGAN",
    alamat: "Jl. Gatot Subroto No. 12, Medan",
    latlon: "3.1521,98.6722",
    status: "ACTIVE",
  },
  {
    id: 5,
    businessName: "Apotek Sejahtera",
    kategori: "KESEHATAN",
    alamat: "Jl. Sudirman No. 56, Semarang",
    latlon: "-6.9726,110.4127",
    status: "ACTIVE",
  },
  {
    id: 6,
    businessName: "Toko Oleh-Oleh Nusantara",
    kategori: "PANGAN",
    alamat: "Jl. Raya Malioboro, Yogyakarta",
    latlon: "-7.7956,110.3695",
    status: "ACTIVE",
  },
  {
    id: 7,
    businessName: "Kursus Bahasa Inggris ABC",
    kategori: "PENDIDIKAN",
    alamat: "Jl. Pemuda No. 34, Palembang",
    latlon: "-2.9264,104.7520",
    status: "ACTIVE",
  },
  {
    id: 8,
    businessName: "Rumah Sakit Harapan",
    kategori: "KESEHATAN",
    alamat: "Jl. K.S. Tubun No. 23, Makassar",
    latlon: "-5.1477,119.4327",
    status: "ACTIVE",
  },
  {
    id: 9,
    businessName: "Warung Kopi Tradisional",
    kategori: "PANGAN",
    alamat: "Jl. Imam Bonjol No. 67, Denpasar",
    latlon: "-8.6705,115.2126",
    status: "ACTIVE",
  },
  {
    id: 10,
    businessName: "Toko Buku dan Alat Tulis",
    kategori: "PENDIDIKAN",
    alamat: "Jl. Diponegoro No. 89, Bandung",
    latlon: "-6.9227,107.6062",
    status: "ACTIVE",
  },
 {
    id: 11,
    businessName: "Masjidil Haram",
    kategori: "RELIGIOUS",
    alamat: "Makkah, Arab Saudi",
    latlon: "21.4225,39.826167", // Koordinat Kabah
    status: "ACTIVE",
  },
];

interface ViewMapsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MerchantLocation {
  id: number;
  businessName: string;
  kategori: string;
  alamat: string;
  latlon: string;
  status: string;
}

function stringToLatLngTuple(str: string): [number, number] {
  const [lat, lng] = str.split(",").map((val) => parseFloat(val.trim()));
  return [lat, lng];
}

function MerchantsMap({ merchants }: { merchants: MerchantLocation[] }) {
  // Calculate center point from all merchants
  const positions = merchants.map((m) => stringToLatLngTuple(m.latlon));
  const centerLat =
    positions.reduce((sum, pos) => sum + pos[0], 0) / positions.length;
  const centerLng =
    positions.reduce((sum, pos) => sum + pos[1], 0) / positions.length;
  const center: [number, number] = [centerLat, centerLng];

  // Get category color
  const getCategoryColor = (kategori: string): string => {
    const colors: Record<string, string> = {
      PANGAN: "#ef4444",
      KESEHATAN: "#3b82f6",
      PENDIDIKAN: "#10b981",
    };
    return colors[kategori] || "#6b7280";
  };

  return (
    <MapContainer
      center={center}
      zoom={6}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {merchants.map((merchant) => {
        const position = stringToLatLngTuple(merchant.latlon);
        const categoryColor = getCategoryColor(merchant.kategori);

        return (
          <Marker
            key={merchant.id}
            position={position}
            title={merchant.businessName}
          >
            <Popup>
              <div className="space-y-2 min-w-max">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {merchant.businessName}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {merchant.alamat}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: categoryColor }}
                  />
                  <span className="text-xs font-medium text-slate-700">
                    {merchant.kategori}
                  </span>
                </div>

                <div className="text-xs">
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-white font-medium"
                    style={{ backgroundColor: categoryColor }}
                  >
                    {merchant.status}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export function ViewMapsDialog({
  open,
  onOpenChange,
}: ViewMapsDialogProps) {
  const [isLoading] = useState(false);
  const merchants = SAMPLE_MERCHANTS;

  // Get category counts
  const categoryCounts = merchants.reduce(
    (acc, m) => {
      acc[m.kategori] = (acc[m.kategori] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
        <div className="px-6 py-4 border-b border-slate-200">
          <DialogHeader>
            <DialogTitle>Peta Lokasi Merchant</DialogTitle>
            <DialogDescription>
              Tampilan interaktif semua lokasi merchant pada peta
            </DialogDescription>
          </DialogHeader>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Map Container */}
            <div className="flex-1 overflow-hidden">
              <MerchantsMap merchants={merchants} />
            </div>

            {/* Legend */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#ef4444" }}
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Pangan
                    </p>
                    <p className="text-xs text-slate-600">
                      {categoryCounts.PANGAN || 0} lokasi
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#3b82f6" }}
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Kesehatan
                    </p>
                    <p className="text-xs text-slate-600">
                      {categoryCounts.KESEHATAN || 0} lokasi
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#10b981" }}
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Pendidikan
                    </p>
                    <p className="text-xs text-slate-600">
                      {categoryCounts.PENDIDIKAN || 0} lokasi
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                <p className="font-medium text-slate-900 mb-1">Cara Menggunakan:</p>
                <ul className="space-y-1 text-slate-600">
                  <li>• Klik penanda untuk melihat detail merchant</li>
                  <li>• Gunakan scroll mouse untuk zoom in/out</li>
                  <li>• Drag peta untuk menggeser area tampilan</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-200">
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
