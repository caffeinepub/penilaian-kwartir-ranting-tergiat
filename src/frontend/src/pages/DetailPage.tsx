import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Principal } from "@icp-sdk/core/principal";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  CalendarCheck,
  CheckCircle,
  ChevronLeft,
  FileText,
  Printer,
  Star,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useIsAdmin, useKwartirRanting } from "../hooks/useQueries";
import {
  KEGIATAN_LIST,
  KategoriKegiatan,
  Status,
  Variant_hakGunaPakai_milikSendiri_tidakPunya,
} from "../types/form";
import type { KwartirRanting } from "../types/form";

function sekretariatLabel(s: Variant_hakGunaPakai_milikSendiri_tidakPunya) {
  if (s === Variant_hakGunaPakai_milikSendiri_tidakPunya.milikSendiri)
    return "Milik Sendiri";
  if (s === Variant_hakGunaPakai_milikSendiri_tidakPunya.hakGunaPakai)
    return "Hak Guna Pakai";
  return "Tidak Punya";
}

function ScoreBar({
  label,
  score,
  maxScore,
  color,
}: { label: string; score: number; maxScore: number; color: string }) {
  const pct = maxScore > 0 ? Math.min(100, (score / maxScore) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-body font-medium text-foreground">
          {label}
        </span>
        <span className={`text-sm font-display font-bold ${color}`}>
          {score}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color === "text-gold" ? "bg-gold" : color === "text-blue-600" ? "bg-blue-500" : color === "text-green-600" ? "bg-green-500" : "bg-primary"}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>
    </div>
  );
}

function ProfilSection({ record }: { record: KwartirRanting }) {
  const p = record.profile;
  const masaBaktiDari =
    Number(p.masaBakti[0]) > 0
      ? new Date(Number(p.masaBakti[0]) / 1_000_000).getFullYear()
      : "-";
  const masaBaktiSampai =
    Number(p.masaBakti[1]) > 0
      ? new Date(Number(p.masaBakti[1]) / 1_000_000).getFullYear()
      : "-";

  const items = [
    { label: "Nama Kwartir Ranting", value: p.namaKwarran || "-" },
    { label: "Nama Ketua", value: p.ketua || "-" },
    { label: "Status Sekretariat", value: sekretariatLabel(p.sekretariat) },
    { label: "Alamat Sekretariat", value: p.alamat || "-" },
    { label: "Email", value: p.email || "-" },
    { label: "Media Sosial", value: p.sosialMedia || "-" },
    {
      label: "Bumi Perkemahan",
      value: p.bumiPerkemahan
        ? `Ya (${p.statusBumiPerkemahan === "milikSendiri" ? "Milik Sendiri" : "Hak Guna Pakai"})`
        : "Tidak",
    },
    { label: "Masa Bakti", value: `${masaBaktiDari} s/d ${masaBaktiSampai}` },
    { label: "Nomor SK Terakhir", value: p.noSKTerakhir || "-" },
  ];

  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="form-section-header rounded-t-lg py-3 px-5">
        <CardTitle className="text-white font-display text-base flex items-center gap-2">
          <FileText className="h-4 w-4" />
          A. Profil Kwartir Ranting
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col">
              <span className="text-xs text-muted-foreground font-body">
                {item.label}
              </span>
              <span className="text-sm font-body font-medium text-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PotensiSection({ record }: { record: KwartirRanting }) {
  const p = record.potensi;
  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="form-section-header rounded-t-lg py-3 px-5">
        <CardTitle className="text-white font-display text-base flex items-center gap-2">
          <Users className="h-4 w-4" />
          B. Data Potensi
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <div>
          <h4 className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Anggota Muda
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: "Siaga Putera", val: p.anggotaMuda.siagaPutera },
              { label: "Siaga Puteri", val: p.anggotaMuda.siagaPuteri },
              {
                label: "Penggalang Putera",
                val: p.anggotaMuda.penggalangPutera,
              },
              {
                label: "Penggalang Puteri",
                val: p.anggotaMuda.penggalangPuteri,
              },
              { label: "Penegak Putera", val: p.anggotaMuda.penegakPutera },
              { label: "Penegak Puteri", val: p.anggotaMuda.penegakPuteri },
              { label: "Pandega Putera", val: p.anggotaMuda.pandegaPutera },
              { label: "Pandega Puteri", val: p.anggotaMuda.pandegaPuteri },
            ].map((item) => (
              <div
                key={item.label}
                className="text-center p-2 bg-muted/40 rounded"
              >
                <div className="font-display font-bold text-xl text-primary">
                  {Number(item.val)}
                </div>
                <div className="text-xs text-muted-foreground font-body mt-0.5">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <h4 className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Anggota Dewasa
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Pembina", val: p.anggotaDewasa.pembina },
              { label: "Pelatih", val: p.anggotaDewasa.pelatih },
              { label: "Andalan", val: p.anggotaDewasa.andalan },
            ].map((item) => (
              <div
                key={item.label}
                className="text-center p-2 bg-muted/40 rounded"
              >
                <div className="font-display font-bold text-xl text-primary">
                  {Number(item.val)}
                </div>
                <div className="text-xs text-muted-foreground font-body mt-0.5">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: "Gudep Putera", val: p.gudep.putera },
            { label: "Gudep Puteri", val: p.gudep.puteri },
            { label: "Satgas Pramuka Peduli", val: p.satgasPramukaPeduli },
            { label: "Karyawan Sekretariat", val: p.karyawanSekretariat },
          ].map((item) => (
            <div
              key={item.label}
              className="text-center p-2 bg-muted/40 rounded"
            >
              <div className="font-display font-bold text-xl text-primary">
                {Number(item.val)}
              </div>
              <div className="text-xs text-muted-foreground font-body">
                {item.label}
              </div>
            </div>
          ))}
        </div>
        {p.satuanKaryaAktif.length > 0 && (
          <div>
            <h4 className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Satuan Karya Aktif
            </h4>
            <div className="flex flex-wrap gap-2">
              {p.satuanKaryaAktif.map((sk) => (
                <Badge
                  key={sk}
                  variant="secondary"
                  className="font-body text-xs"
                >
                  {sk}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function KegiatanSection({ record }: { record: KwartirRanting }) {
  const sections = [
    {
      title: "C.1 Kegiatan Anggota Muda Siaga",
      kategori: KategoriKegiatan.siaga,
    },
    {
      title: "C.2 Kegiatan Anggota Muda Penggalang",
      kategori: KategoriKegiatan.penggalang,
    },
    {
      title: "C.3 Kegiatan Anggota Muda Penegak/Pandega",
      kategori: KategoriKegiatan.penegakPandega,
    },
    {
      title: "C.4 Kegiatan Anggota Dewasa",
      kategori: KategoriKegiatan.anggotaDewasa,
    },
  ];

  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="form-section-header rounded-t-lg py-3 px-5">
        <CardTitle className="text-white font-display text-base flex items-center gap-2">
          <CalendarCheck className="h-4 w-4" />
          C. Realisasi Program Kegiatan (5 Tahun)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        {sections.map((section) => {
          const items = KEGIATAN_LIST.filter(
            (k) => k.kategori === section.kategori,
          );
          return (
            <div key={section.kategori}>
              <h4 className="font-body font-semibold text-sm text-foreground mb-3">
                {section.title}
              </h4>
              <div className="space-y-1.5">
                {items.map((item) => {
                  const k = record.kegiatan.find((kg) => kg.id === item.id);
                  const freq = k ? Number(k.frekuensi) : 0;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-1.5 px-3 bg-muted/20 rounded"
                    >
                      <div className="flex items-center gap-2">
                        {freq > 0 ? (
                          <CheckCircle className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0" />
                        )}
                        <span className="text-sm font-body text-foreground">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {k?.bukti && k.bukti.length > 0 && (
                          <Badge
                            variant="outline"
                            className="text-xs font-body"
                          >
                            <FileText className="h-2.5 w-2.5 mr-1" />
                            {k.bukti.length} berkas
                          </Badge>
                        )}
                        <Badge
                          className={`text-xs font-body ${
                            freq >= 3
                              ? "bg-green-100 text-green-700 border-green-200"
                              : freq > 0
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : "bg-muted text-muted-foreground"
                          }`}
                          variant="outline"
                        >
                          {freq}x
                        </Badge>
                        <span
                          className={`text-xs font-body font-semibold ${
                            freq >= 3
                              ? "text-green-600"
                              : freq > 0
                                ? "text-blue-600"
                                : "text-muted-foreground"
                          }`}
                        >
                          {freq >= 3 ? "+10" : freq > 0 ? "+5" : "0"} poin
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function makePrincipal(str: string): Principal {
  return { toString: () => str, compareTo: () => 0 } as unknown as Principal;
}

export default function DetailPage() {
  const { ownerId } = useParams({ from: "/detail/$ownerId" });
  const navigate = useNavigate();
  const principal = makePrincipal(ownerId);
  const { data: record, isLoading } = useKwartirRanting(principal);
  const { data: isAdmin } = useIsAdmin();

  if (isLoading) {
    return (
      <div
        className="max-w-3xl mx-auto px-4 py-8 space-y-4"
        data-ocid="detail.loading_state"
      >
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (!record) {
    return (
      <div
        className="max-w-3xl mx-auto px-4 py-16 text-center"
        data-ocid="detail.error_state"
      >
        <p className="text-muted-foreground font-body">
          Data penilaian tidak ditemukan.
        </p>
        <Button
          onClick={() => navigate({ to: "/" })}
          variant="outline"
          className="mt-4 font-body"
        >
          Kembali
        </Button>
      </div>
    );
  }

  const rekap = record.rekapan;
  const maxProfil = 40;
  const maxPotensi = 55;
  const maxKegiatan = KEGIATAN_LIST.length * 10;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground font-body transition-colors"
            data-ocid="detail.link"
          >
            <ChevronLeft className="h-4 w-4" />
            Kembali
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 font-body border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground print:hidden"
            data-ocid="detail.primary_button"
          >
            <Printer className="h-4 w-4" />
            Cetak PDF
          </Button>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              {record.profile.namaKwarran || "Kwartir Ranting"}
            </h1>
            <p className="text-muted-foreground font-body text-sm mt-1">
              Ketua: {record.profile.ketua || "-"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {record.status === Status.submitted && (
              <Badge className="bg-blue-600 text-white font-body">
                Diajukan
              </Badge>
            )}
            {record.status === Status.reviewed && (
              <Badge className="bg-gold text-foreground font-body">
                Direview
              </Badge>
            )}
            {record.status === Status.draft && (
              <Badge variant="secondary" className="font-body">
                Draft
              </Badge>
            )}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="border-2 border-gold/40 shadow-scout">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg text-foreground flex items-center gap-2">
              <Trophy className="h-5 w-5 text-gold" />
              Rekap Skor Penilaian
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                {
                  label: "Skor Profil",
                  value: Number(rekap.skorProfil),
                  color: "text-primary",
                },
                {
                  label: "Skor Potensi",
                  value: Number(rekap.skorPotensi),
                  color: "text-blue-600",
                },
                {
                  label: "Skor Kegiatan",
                  value: Number(rekap.skorKegiatan),
                  color: "text-green-600",
                },
                {
                  label: "Total Skor",
                  value: Number(rekap.skorTotal),
                  color: "text-gold",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="text-center p-3 bg-muted/40 rounded-lg"
                >
                  <div
                    className={`font-display font-bold text-2xl ${item.color}`}
                  >
                    {item.value}
                  </div>
                  <div className="text-xs text-muted-foreground font-body mt-0.5">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <ScoreBar
                label="Profil Kwartir Ranting"
                score={Number(rekap.skorProfil)}
                maxScore={maxProfil}
                color="text-primary"
              />
              <ScoreBar
                label="Data Potensi"
                score={Number(rekap.skorPotensi)}
                maxScore={maxPotensi}
                color="text-blue-600"
              />
              <ScoreBar
                label="Realisasi Kegiatan"
                score={Number(rekap.skorKegiatan)}
                maxScore={maxKegiatan}
                color="text-green-600"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ProfilSection record={record} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <PotensiSection record={record} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <KegiatanSection record={record} />
        </motion.div>
      </div>

      {isAdmin && record.status !== Status.reviewed && (
        <div className="mt-6 flex justify-end">
          <Badge className="text-sm font-body bg-muted text-muted-foreground">
            <Star className="h-3 w-3 mr-1" />
            Penilaian oleh Admin
          </Badge>
        </div>
      )}
    </div>
  );
}
