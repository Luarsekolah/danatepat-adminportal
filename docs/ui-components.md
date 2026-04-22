# UI Components & Styling

## Sistem Styling

Proyek menggunakan **TailwindCSS 3** sebagai fondasi styling. Design tokens (warna, radius, dll.) dikonfigurasi di `client/global.css` menggunakan CSS variables.

### Utility `cn()`

Fungsi `cn()` dari `client/lib/utils.ts` menggabungkan `clsx` dan `tailwind-merge` untuk penulisan class yang kondisional dan aman dari konflik:

```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "base-class px-4 py-2",
  { "bg-red-500": isError, "bg-green-500": isSuccess },
  props.className  // memungkinkan override dari luar
)} />
```

---

## Komponen UI (`client/components/ui/`)

Komponen UI dibangun di atas **Radix UI** primitives dengan styling TailwindCSS (pola shadcn/ui). Semua komponen sudah tersedia dan siap pakai.

### Komponen yang Tersedia

| Komponen | Kegunaan |
|---|---|
| `Button` | Tombol dengan berbagai variant (default, outline, ghost, destructive) |
| `Input` | Input teks standar |
| `Dialog` | Modal dialog |
| `Select` | Dropdown select |
| `Table` | Tabel data |
| `Badge` | Label/tag status |
| `Card` | Container konten |
| `Form` | Wrapper form dengan React Hook Form |
| `Checkbox` | Input checkbox |
| `Tabs` | Tab navigation |
| `Tooltip` | Tooltip on hover |
| `Dropdown Menu` | Context menu / action menu |
| `Alert Dialog` | Dialog konfirmasi (destructive actions) |
| `Sonner` | Toast notifications |
| `Calendar` | Date picker |
| `Pagination` | Navigasi halaman |

### Contoh Penggunaan

**Button:**
```tsx
import { Button } from "@/components/ui/button";

<Button variant="outline" size="sm" onClick={handleClick}>
  Tambah Data
</Button>
```

**Dialog:**
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Judul Dialog</DialogTitle>
    </DialogHeader>
    {/* konten */}
  </DialogContent>
</Dialog>
```

**Toast (Sonner):**
```tsx
import { toast } from "sonner";

toast.success("Data berhasil disimpan");
toast.error("Terjadi kesalahan");
```

**Form dengan React Hook Form + Zod:**
```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: { name: "" },
});

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nama</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

---

## Layout Komponen

### `Layout.tsx`
Wrapper utama halaman dashboard yang menyertakan `Header` dan `Sidebar`.

### `Sidebar.tsx`
Navigasi sidebar dengan link ke semua halaman dashboard.

### `Header.tsx`
Header aplikasi dengan info user dan tombol logout.

---

## Ikon

Proyek menggunakan **Lucide React** untuk ikon:

```tsx
import { Plus, Trash2, Edit, Search } from "lucide-react";

<Plus className="w-4 h-4" />
```

Cari ikon yang tersedia di [lucide.dev](https://lucide.dev).
