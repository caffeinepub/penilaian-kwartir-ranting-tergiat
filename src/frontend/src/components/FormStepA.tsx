import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { Profile } from "../types/form";
import { Variant_hakGunaPakai_milikSendiri_tidakPunya } from "../types/form";

interface Props {
  profile: Profile;
  onChange: (profile: Profile) => void;
}

export default function FormStepA({ profile, onChange }: Props) {
  const update = (key: keyof Profile, value: any) =>
    onChange({ ...profile, [key]: value });

  const hasSekretariat =
    profile.sekretariat !==
    Variant_hakGunaPakai_milikSendiri_tidakPunya.tidakPunya;

  return (
    <div className="space-y-6">
      <Card className="border-border shadow-xs">
        <CardHeader className="form-section-header rounded-t-lg py-3 px-5">
          <CardTitle className="text-white font-display text-base">
            A. Profil Kwartir Ranting
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-5">
          <div className="space-y-1.5">
            <Label className="font-body font-semibold text-sm text-foreground">
              1. Nama Kwartir Ranting{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              value={profile.namaKwarran}
              onChange={(e) => update("namaKwarran", e.target.value)}
              placeholder="Contoh: Kwartir Ranting Subang Kota"
              className="font-body"
              data-ocid="profil.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-body font-semibold text-sm text-foreground">
              2. Nama Ketua Kwarran <span className="text-destructive">*</span>
            </Label>
            <Input
              value={profile.ketua}
              onChange={(e) => update("ketua", e.target.value)}
              placeholder="Nama lengkap ketua"
              className="font-body"
              data-ocid="profil.input"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-body font-semibold text-sm text-foreground">
              3. Memiliki Sekretariat
            </Label>
            <RadioGroup
              value={profile.sekretariat}
              onValueChange={(v) =>
                update(
                  "sekretariat",
                  v as Variant_hakGunaPakai_milikSendiri_tidakPunya,
                )
              }
              className="flex flex-wrap gap-4"
              data-ocid="profil.radio"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value={
                    Variant_hakGunaPakai_milikSendiri_tidakPunya.milikSendiri
                  }
                  id="sek-ya"
                />
                <Label htmlFor="sek-ya" className="font-body cursor-pointer">
                  YA (Milik Sendiri)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value={
                    Variant_hakGunaPakai_milikSendiri_tidakPunya.hakGunaPakai
                  }
                  id="sek-hgp"
                />
                <Label htmlFor="sek-hgp" className="font-body cursor-pointer">
                  YA (Hak Guna Pakai)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value={
                    Variant_hakGunaPakai_milikSendiri_tidakPunya.tidakPunya
                  }
                  id="sek-tidak"
                />
                <Label htmlFor="sek-tidak" className="font-body cursor-pointer">
                  TIDAK
                </Label>
              </div>
            </RadioGroup>
          </div>

          {hasSekretariat && (
            <div className="space-y-1.5 pl-4 border-l-2 border-primary/30">
              <Label className="font-body font-semibold text-sm text-foreground">
                Alamat Sekretariat
              </Label>
              <Textarea
                value={profile.alamat}
                onChange={(e) => update("alamat", e.target.value)}
                placeholder="Alamat lengkap sekretariat"
                rows={3}
                className="font-body"
                data-ocid="profil.textarea"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="font-body font-semibold text-sm text-foreground">
              Email
            </Label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="email@kwarran.id"
              className="font-body"
              data-ocid="profil.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-body font-semibold text-sm text-foreground">
              4. Media Sosial (FB, IG, dll)
            </Label>
            <Input
              value={profile.sosialMedia}
              onChange={(e) => update("sosialMedia", e.target.value)}
              placeholder="@username atau URL media sosial"
              className="font-body"
              data-ocid="profil.input"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-body font-semibold text-sm text-foreground">
              5. Memiliki Bumi Perkemahan
            </Label>
            <RadioGroup
              value={profile.bumiPerkemahan ? "ya" : "tidak"}
              onValueChange={(v) => update("bumiPerkemahan", v === "ya")}
              className="flex gap-4"
              data-ocid="profil.radio"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="ya" id="bumi-ya" />
                <Label htmlFor="bumi-ya" className="font-body cursor-pointer">
                  YA
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="tidak" id="bumi-tidak" />
                <Label
                  htmlFor="bumi-tidak"
                  className="font-body cursor-pointer"
                >
                  TIDAK
                </Label>
              </div>
            </RadioGroup>

            {profile.bumiPerkemahan && (
              <div className="pl-4 border-l-2 border-primary/30 mt-2">
                <Label className="font-body font-semibold text-sm text-foreground mb-2 block">
                  Status Bumi Perkemahan
                </Label>
                <RadioGroup
                  value={profile.statusBumiPerkemahan}
                  onValueChange={(v) => update("statusBumiPerkemahan", v)}
                  className="flex gap-4"
                  data-ocid="profil.radio"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="milikSendiri" id="bumi-ms" />
                    <Label
                      htmlFor="bumi-ms"
                      className="font-body cursor-pointer"
                    >
                      Milik Sendiri
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="hakGunaPakai" id="bumi-hgp" />
                    <Label
                      htmlFor="bumi-hgp"
                      className="font-body cursor-pointer"
                    >
                      Hak Guna Pakai
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-body font-semibold text-sm text-foreground">
              6. Masa Bakti Pengurus (Menyerahkan SK terakhir)
            </Label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground font-body">
                  Dari Tahun
                </Label>
                <Input
                  type="number"
                  value={
                    Number(profile.masaBakti[0]) === 0
                      ? ""
                      : new Date(
                          Number(profile.masaBakti[0]) / 1_000_000,
                        ).getFullYear()
                  }
                  onChange={(e) => {
                    const year = Number.parseInt(e.target.value);
                    if (!Number.isNaN(year)) {
                      const ts =
                        BigInt(new Date(year, 0, 1).getTime()) * 1_000_000n;
                      update("masaBakti", [ts, profile.masaBakti[1]]);
                    }
                  }}
                  placeholder="2020"
                  min={2000}
                  max={2099}
                  className="font-body mt-1"
                  data-ocid="profil.input"
                />
              </div>
              <span className="mt-6 text-muted-foreground font-body">s/d</span>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground font-body">
                  Sampai Tahun
                </Label>
                <Input
                  type="number"
                  value={
                    Number(profile.masaBakti[1]) === 0
                      ? ""
                      : new Date(
                          Number(profile.masaBakti[1]) / 1_000_000,
                        ).getFullYear()
                  }
                  onChange={(e) => {
                    const year = Number.parseInt(e.target.value);
                    if (!Number.isNaN(year)) {
                      const ts =
                        BigInt(new Date(year, 0, 1).getTime()) * 1_000_000n;
                      update("masaBakti", [profile.masaBakti[0], ts]);
                    }
                  }}
                  placeholder="2025"
                  min={2000}
                  max={2099}
                  className="font-body mt-1"
                  data-ocid="profil.input"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-body font-semibold text-sm text-foreground">
              7. Nomor SK Terakhir
            </Label>
            <Input
              value={profile.noSKTerakhir}
              onChange={(e) => update("noSKTerakhir", e.target.value)}
              placeholder="Nomor surat keputusan terakhir"
              className="font-body"
              data-ocid="profil.input"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
