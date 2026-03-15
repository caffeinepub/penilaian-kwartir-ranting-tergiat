import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Potensi } from "../types/form";

interface Props {
  potensi: Potensi;
  onChange: (potensi: Potensi) => void;
}

function NumberInput({
  label,
  value,
  onChange,
  ocid,
}: {
  label: string;
  value: bigint;
  onChange: (v: bigint) => void;
  ocid?: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground font-body leading-tight">
        {label}
      </Label>
      <Input
        type="number"
        min={0}
        value={Number(value)}
        onChange={(e) =>
          onChange(BigInt(Math.max(0, Number.parseInt(e.target.value) || 0)))
        }
        className="font-body h-9 text-center"
        data-ocid={ocid ?? "potensi.input"}
      />
    </div>
  );
}

export default function FormStepB({ potensi, onChange }: Props) {
  const updateMuda = (key: keyof Potensi["anggotaMuda"], val: bigint) =>
    onChange({
      ...potensi,
      anggotaMuda: { ...potensi.anggotaMuda, [key]: val },
    });

  const updateDewasa = (key: keyof Potensi["anggotaDewasa"], val: bigint) =>
    onChange({
      ...potensi,
      anggotaDewasa: { ...potensi.anggotaDewasa, [key]: val },
    });

  const updateGudep = (key: keyof Potensi["gudep"], val: bigint) =>
    onChange({ ...potensi, gudep: { ...potensi.gudep, [key]: val } });

  const handleSatuanKarya = (text: string) => {
    const list = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    onChange({ ...potensi, satuanKaryaAktif: list });
  };

  return (
    <div className="space-y-6">
      {/* Anggota Muda */}
      <Card className="border-border shadow-xs">
        <CardHeader className="form-section-header rounded-t-lg py-3 px-5">
          <CardTitle className="text-white font-display text-base">
            B. Data Potensi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-6">
          <div>
            <h3 className="font-body font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                1
              </span>
              Data Potensi Anggota Muda
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <NumberInput
                label="Siaga Putera"
                value={potensi.anggotaMuda.siagaPutera}
                onChange={(v) => updateMuda("siagaPutera", v)}
              />
              <NumberInput
                label="Siaga Puteri"
                value={potensi.anggotaMuda.siagaPuteri}
                onChange={(v) => updateMuda("siagaPuteri", v)}
              />
              <NumberInput
                label="Penggalang Putera"
                value={potensi.anggotaMuda.penggalangPutera}
                onChange={(v) => updateMuda("penggalangPutera", v)}
              />
              <NumberInput
                label="Penggalang Puteri"
                value={potensi.anggotaMuda.penggalangPuteri}
                onChange={(v) => updateMuda("penggalangPuteri", v)}
              />
              <NumberInput
                label="Penegak Putera"
                value={potensi.anggotaMuda.penegakPutera}
                onChange={(v) => updateMuda("penegakPutera", v)}
              />
              <NumberInput
                label="Penegak Puteri"
                value={potensi.anggotaMuda.penegakPuteri}
                onChange={(v) => updateMuda("penegakPuteri", v)}
              />
              <NumberInput
                label="Pandega Putera"
                value={potensi.anggotaMuda.pandegaPutera}
                onChange={(v) => updateMuda("pandegaPutera", v)}
              />
              <NumberInput
                label="Pandega Puteri"
                value={potensi.anggotaMuda.pandegaPuteri}
                onChange={(v) => updateMuda("pandegaPuteri", v)}
              />
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-body font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                2
              </span>
              Data Potensi Anggota Dewasa
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <NumberInput
                label="Pembina"
                value={potensi.anggotaDewasa.pembina}
                onChange={(v) => updateDewasa("pembina", v)}
              />
              <NumberInput
                label="Pelatih"
                value={potensi.anggotaDewasa.pelatih}
                onChange={(v) => updateDewasa("pelatih", v)}
              />
              <NumberInput
                label="Andalan"
                value={potensi.anggotaDewasa.andalan}
                onChange={(v) => updateDewasa("andalan", v)}
              />
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-body font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                3
              </span>
              Data Potensi Gugusdepan
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <NumberInput
                label="Gudep Putera"
                value={potensi.gudep.putera}
                onChange={(v) => updateGudep("putera", v)}
              />
              <NumberInput
                label="Gudep Puteri"
                value={potensi.gudep.puteri}
                onChange={(v) => updateGudep("puteri", v)}
              />
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-body font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                4
              </span>
              Data Lainnya
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <NumberInput
                label="Anggota Satgas Pramuka Peduli"
                value={potensi.satgasPramukaPeduli}
                onChange={(v) =>
                  onChange({ ...potensi, satgasPramukaPeduli: v })
                }
              />
              <NumberInput
                label="Karyawan Sekretariat"
                value={potensi.karyawanSekretariat}
                onChange={(v) =>
                  onChange({ ...potensi, karyawanSekretariat: v })
                }
              />
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-body font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                5
              </span>
              Satuan Karya Aktif
            </h3>
            <p className="text-xs text-muted-foreground font-body mb-2">
              Sebutkan nama Satuan Karya yang aktif (satu per baris)
            </p>
            <Textarea
              value={potensi.satuanKaryaAktif.join("\n")}
              onChange={(e) => handleSatuanKarya(e.target.value)}
              placeholder="Contoh:\nSaka Bhayangkara\nSaka Wanabakti\nSaka Bahari"
              rows={4}
              className="font-body"
              data-ocid="potensi.textarea"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
