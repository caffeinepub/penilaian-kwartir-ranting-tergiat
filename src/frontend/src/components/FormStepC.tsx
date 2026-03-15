import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import type { JudgingDocument, Kegiatan } from "../types/form";
import { KEGIATAN_LIST, KategoriKegiatan } from "../types/form";

interface Props {
  kegiatan: Kegiatan[];
  onChange: (kegiatan: Kegiatan[]) => void;
}

const SECTIONS = [
  {
    title: "C.1 Frekuensi Kegiatan Anggota Muda Siaga",
    kategori: KategoriKegiatan.siaga,
  },
  {
    title: "C.2 Frekuensi Kegiatan Anggota Muda Penggalang",
    kategori: KategoriKegiatan.penggalang,
  },
  {
    title: "C.3 Frekuensi Kegiatan Anggota Muda Penegak/Pandega",
    kategori: KategoriKegiatan.penegakPandega,
  },
  {
    title: "C.4 Frekuensi Kegiatan Anggota Dewasa",
    kategori: KategoriKegiatan.anggotaDewasa,
  },
];

function UploadArea({
  kegiatanId,
  bukti,
  onUploaded,
}: {
  kegiatanId: string;
  bukti: JudgingDocument[];
  onUploaded: (docs: JudgingDocument[]) => void;
}) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !actor || !identity) return;

    setUploading(true);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      const now = BigInt(Date.now()) * 1_000_000n;
      const doc: JudgingDocument = {
        id: `${kegiatanId}-${Date.now()}`,
        owner: identity.getPrincipal(),
        blob,
        name: file.name,
        createdAt: now,
        updatedAt: now,
      };
      await actor.uploadDocument(doc);
      onUploaded([...bukti, doc]);
      toast.success(`Berkas "${file.name}" berhasil diunggah`);
    } catch (err) {
      toast.error(
        `Gagal mengunggah berkas: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeDoc = (docId: string) => {
    onUploaded(bukti.filter((d) => d.id !== docId));
  };

  return (
    <div className="mt-3 p-3 bg-muted/40 rounded-lg border border-dashed border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-body text-muted-foreground font-semibold">
          Bukti Fisik (Proposal, Surat Edaran, Foto Kegiatan)
        </span>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
            id={`upload-${kegiatanId}`}
          />
          <Button
            size="sm"
            variant="outline"
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="h-7 text-xs font-body"
            data-ocid="kegiatan.upload_button"
          >
            {uploading ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <Upload className="h-3 w-3 mr-1" />
            )}
            Upload
          </Button>
        </div>
      </div>
      {bukti.length > 0 && (
        <div className="space-y-1">
          {bukti.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between text-xs font-body bg-card rounded px-2 py-1"
            >
              <div className="flex items-center gap-1 text-muted-foreground truncate">
                <FileText className="h-3 w-3 flex-shrink-0" />
                <span className="truncate max-w-[200px]">{doc.name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeDoc(doc.id)}
                className="text-muted-foreground hover:text-destructive ml-2 flex-shrink-0"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FormStepC({ kegiatan, onChange }: Props) {
  const updateFrekuensi = (id: string, frekuensi: bigint) => {
    onChange(kegiatan.map((k) => (k.id === id ? { ...k, frekuensi } : k)));
  };

  const updateBukti = (id: string, bukti: JudgingDocument[]) => {
    onChange(kegiatan.map((k) => (k.id === id ? { ...k, bukti } : k)));
  };

  return (
    <div className="space-y-6">
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs font-body text-amber-800">
          <strong>Catatan:</strong> Isi frekuensi kegiatan dalam 5 tahun
          terakhir. Bukti fisik berupa Proposal, Surat Edaran, Surat Tugas, dan
          Foto Kegiatan dapat diunggah per sub-bagian.
        </p>
      </div>

      {SECTIONS.map((section) => {
        const items = KEGIATAN_LIST.filter(
          (k) => k.kategori === section.kategori,
        );
        const sectionKegiatan = items
          .map((item) => kegiatan.find((k) => k.id === item.id))
          .filter(Boolean) as Kegiatan[];
        const hasAnyActivity = sectionKegiatan.some((k) => k.frekuensi > 0n);

        return (
          <Card key={section.kategori} className="border-border shadow-xs">
            <CardHeader className="form-section-header rounded-t-lg py-3 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white font-display text-sm">
                  {section.title}
                </CardTitle>
                {hasAnyActivity && (
                  <Badge className="bg-gold text-foreground text-xs font-body">
                    {sectionKegiatan.filter((k) => k.frekuensi > 0n).length}{" "}
                    kegiatan aktif
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-4">
                {items.map((item, itemIdx) => {
                  const kegiatanItem = kegiatan.find((k) => k.id === item.id);
                  if (!kegiatanItem) return null;
                  const freq = kegiatanItem.frekuensi;
                  const pointClass =
                    freq >= 3n
                      ? "text-green-700 bg-green-50"
                      : freq > 0n
                        ? "text-blue-700 bg-blue-50"
                        : "text-muted-foreground bg-muted/30";

                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-muted/20 border border-border/50"
                      data-ocid={`kegiatan.item.${itemIdx + 1}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Label className="font-body text-sm text-foreground font-medium">
                            {item.label}
                          </Label>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`text-xs font-body font-semibold px-2 py-0.5 rounded-full ${pointClass}`}
                          >
                            {freq >= 3n
                              ? "+10 poin"
                              : freq > 0n
                                ? "+5 poin"
                                : "0 poin"}
                          </span>
                          <div className="flex items-center gap-1">
                            <Label className="text-xs text-muted-foreground font-body whitespace-nowrap">
                              Frekuensi:
                            </Label>
                            <Input
                              type="number"
                              min={0}
                              value={Number(freq)}
                              onChange={(e) =>
                                updateFrekuensi(
                                  item.id,
                                  BigInt(
                                    Math.max(
                                      0,
                                      Number.parseInt(e.target.value) || 0,
                                    ),
                                  ),
                                )
                              }
                              className="w-16 h-8 text-center font-body text-sm"
                              data-ocid="kegiatan.input"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <UploadArea
                kegiatanId={`section-${section.kategori}`}
                bukti={sectionKegiatan.flatMap((k) => k.bukti)}
                onUploaded={(docs) => {
                  const firstItem = items[0];
                  if (firstItem) {
                    updateBukti(firstItem.id, docs);
                  }
                }}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
