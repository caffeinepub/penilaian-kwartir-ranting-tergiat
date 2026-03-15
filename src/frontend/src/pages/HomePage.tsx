import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Principal } from "@icp-sdk/core/principal";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  ClipboardList,
  Clock,
  Edit,
  Eye,
  Loader2,
  PlusCircle,
  Shield,
  Trash2,
  Trophy,
  UserCog,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllKwartirRanting,
  useApproveAdminPembantu,
  useApprovedAdminPembantu,
  useIsAdmin,
  useIsAdminPembantu,
  useIsAdminPembantuPending,
  useKwartirRanting,
  usePendingAdminPembantu,
  useRejectAdminPembantu,
  useRemoveAdminPembantu,
  useRequestAdminPembantu,
} from "../hooks/useQueries";
import { Status } from "../types/form";

function StatusBadge({ status }: { status: Status }) {
  if (status === Status.submitted)
    return (
      <Badge className="bg-blue-600 text-white font-body text-xs">
        Diajukan
      </Badge>
    );
  if (status === Status.reviewed)
    return (
      <Badge className="bg-gold text-foreground font-body text-xs">
        Direview
      </Badge>
    );
  return (
    <Badge variant="secondary" className="font-body text-xs">
      Draft
    </Badge>
  );
}

function KelolaPembantuTab() {
  const { data: pending = [], isLoading: pendingLoading } =
    usePendingAdminPembantu();
  const { data: approved = [], isLoading: approvedLoading } =
    useApprovedAdminPembantu();
  const approveMutation = useApproveAdminPembantu();
  const rejectMutation = useRejectAdminPembantu();
  const removeMutation = useRemoveAdminPembantu();

  const truncatePrincipal = (p: Principal) => {
    const s = p.toString();
    return s.length > 20 ? `${s.slice(0, 10)}...${s.slice(-6)}` : s;
  };

  return (
    <div className="space-y-8">
      {/* Permintaan Masuk */}
      <div className="p-5 bg-muted/40 rounded-xl border border-border">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-amber-500" />
          Permintaan Masuk
          {pending.length > 0 && (
            <Badge className="bg-amber-500 text-white text-xs ml-1">
              {pending.length}
            </Badge>
          )}
        </h3>

        {pendingLoading ? (
          <div className="space-y-2" data-ocid="pending.loading_state">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        ) : pending.length === 0 ? (
          <div
            className="text-center py-8 text-muted-foreground font-body text-sm"
            data-ocid="pending.empty_state"
          >
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-30" />
            Tidak ada permintaan masuk saat ini
          </div>
        ) : (
          <div className="space-y-2">
            {pending.map((principal, idx) => (
              <motion.div
                key={principal.toString()}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="flex items-center justify-between gap-3 p-3 bg-background rounded-lg border border-border"
                data-ocid={`pending.item.${idx + 1}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <UserCog className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <span className="font-mono text-xs text-foreground truncate">
                    {truncatePrincipal(principal)}
                  </span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white font-body text-xs h-7 px-3"
                    disabled={approveMutation.isPending}
                    onClick={async () => {
                      try {
                        await approveMutation.mutateAsync(principal);
                        toast.success("Admin Pembantu berhasil disetujui");
                      } catch (e) {
                        toast.error(
                          `Gagal menyetujui: ${
                            e instanceof Error ? e.message : String(e)
                          }`,
                        );
                      }
                    }}
                    data-ocid={`pending.approve_button.${idx + 1}`}
                  >
                    {approveMutation.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    )}
                    Setujui
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="font-body text-xs h-7 px-3"
                    disabled={rejectMutation.isPending}
                    onClick={async () => {
                      try {
                        await rejectMutation.mutateAsync(principal);
                        toast.success("Permintaan berhasil ditolak");
                      } catch (e) {
                        toast.error(
                          `Gagal menolak: ${
                            e instanceof Error ? e.message : String(e)
                          }`,
                        );
                      }
                    }}
                    data-ocid={`pending.delete_button.${idx + 1}`}
                  >
                    {rejectMutation.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3 mr-1" />
                    )}
                    Tolak
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Pembantu Aktif */}
      <div className="p-5 bg-muted/40 rounded-xl border border-border">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Admin Pembantu Aktif
          {approved.length > 0 && (
            <Badge className="bg-primary text-primary-foreground text-xs ml-1">
              {approved.length}
            </Badge>
          )}
        </h3>

        {approvedLoading ? (
          <div className="space-y-2" data-ocid="approved.loading_state">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        ) : approved.length === 0 ? (
          <div
            className="text-center py-8 text-muted-foreground font-body text-sm"
            data-ocid="approved.empty_state"
          >
            <Shield className="h-8 w-8 mx-auto mb-2 opacity-30" />
            Belum ada Admin Pembantu aktif
          </div>
        ) : (
          <div className="space-y-2">
            {approved.map((principal, idx) => (
              <motion.div
                key={principal.toString()}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="flex items-center justify-between gap-3 p-3 bg-background rounded-lg border border-border"
                data-ocid={`approved.item.${idx + 1}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-mono text-xs text-foreground truncate">
                    {truncatePrincipal(principal)}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="font-body text-xs h-7 px-3 shrink-0"
                  disabled={removeMutation.isPending}
                  onClick={async () => {
                    try {
                      await removeMutation.mutateAsync(principal);
                      toast.success("Admin Pembantu berhasil dihapus");
                    } catch (e) {
                      toast.error(
                        `Gagal menghapus: ${
                          e instanceof Error ? e.message : String(e)
                        }`,
                      );
                    }
                  }}
                  data-ocid={`approved.delete_button.${idx + 1}`}
                >
                  {removeMutation.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3 mr-1" />
                  )}
                  Hapus
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminPenilaianList() {
  const { data: records, isLoading } = useAllKwartirRanting();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">
          Semua Penilaian
        </h2>
        <Badge className="bg-primary text-primary-foreground font-body">
          {records?.length ?? 0} Kwartir Ranting
        </Badge>
      </div>

      {isLoading ? (
        <div className="space-y-3" data-ocid="penilaian.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : !records?.length ? (
        <div className="text-center py-16" data-ocid="penilaian.empty_state">
          <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-body">
            Belum ada penilaian yang masuk
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record, idx) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              data-ocid={`penilaian.item.${idx + 1}`}
            >
              <Card className="shadow-xs hover:shadow-scout transition-shadow cursor-pointer border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-body font-semibold text-foreground text-sm">
                          {record.profile.namaKwarran ||
                            "Nama Kwartir Belum Diisi"}
                        </div>
                        <div className="text-xs text-muted-foreground font-body">
                          Ketua: {record.profile.ketua || "-"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <div className="flex items-center gap-1 text-gold font-display font-bold text-lg">
                          <Trophy className="h-4 w-4" />
                          {record.rekapan.skorTotal.toString()}
                        </div>
                        <div className="text-xs text-muted-foreground font-body">
                          Total Skor
                        </div>
                      </div>
                      <StatusBadge status={record.status} />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate({
                            to: "/detail/$ownerId",
                            params: { ownerId: record.owner.toString() },
                          })
                        }
                        data-ocid={`penilaian.edit_button.${idx + 1}`}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Lihat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminView() {
  return (
    <Tabs defaultValue="penilaian" className="w-full">
      <TabsList className="mb-6 bg-muted border border-border">
        <TabsTrigger
          value="penilaian"
          className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          data-ocid="admin.tab"
        >
          <ClipboardList className="h-4 w-4 mr-2" />
          Daftar Penilaian
        </TabsTrigger>
        <TabsTrigger
          value="pembantu"
          className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          data-ocid="admin.tab"
        >
          <UserCog className="h-4 w-4 mr-2" />
          Kelola Admin Pembantu
        </TabsTrigger>
      </TabsList>
      <TabsContent value="penilaian">
        <AdminPenilaianList />
      </TabsContent>
      <TabsContent value="pembantu">
        <KelolaPembantuTab />
      </TabsContent>
    </Tabs>
  );
}

function AdminPembantuView() {
  const { data: records, isLoading } = useAllKwartirRanting();
  const navigate = useNavigate();
  const [buatBaru, setBuatBaru] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Bantu Isi Form Penilaian
          </h2>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Pilih Kwartir Ranting yang ingin diisi formulirnya
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary text-primary-foreground font-body font-semibold"
              data-ocid="pembantu.open_modal_button"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Buat Baru
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="pembantu.dialog">
            <DialogHeader>
              <DialogTitle className="font-display font-bold">
                Isi Form untuk Principal Baru
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label
                htmlFor="buat-baru-input"
                className="font-body text-sm mb-2 block"
              >
                Principal ID Kwartir Ranting
              </Label>
              <Input
                id="buat-baru-input"
                value={buatBaru}
                onChange={(e) => setBuatBaru(e.target.value)}
                placeholder="Masukkan Principal ID"
                className="font-mono text-sm"
                data-ocid="pembantu.input"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                data-ocid="pembantu.cancel_button"
              >
                Batal
              </Button>
              <Button
                onClick={() => {
                  const trimmed = buatBaru.trim();
                  if (!trimmed) {
                    toast.error("Masukkan Principal ID terlebih dahulu");
                    return;
                  }
                  setDialogOpen(false);
                  navigate({
                    to: "/form",
                    search: { targetOwner: trimmed },
                  });
                }}
                className="bg-primary text-primary-foreground font-body"
                data-ocid="pembantu.confirm_button"
              >
                Lanjut Isi Form
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3" data-ocid="pembantu.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : !records?.length ? (
        <div className="text-center py-16" data-ocid="pembantu.empty_state">
          <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-body">
            Belum ada Kwartir Ranting terdaftar
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record, idx) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              data-ocid={`pembantu.item.${idx + 1}`}
            >
              <Card className="shadow-xs hover:shadow-scout transition-shadow border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-sm shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="font-body font-semibold text-foreground text-sm truncate">
                          {record.profile.namaKwarran ||
                            "Nama Kwartir Belum Diisi"}
                        </div>
                        <div className="text-xs text-muted-foreground font-body">
                          Ketua: {record.profile.ketua || "-"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={record.status} />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate({
                            to: "/detail/$ownerId",
                            params: { ownerId: record.owner.toString() },
                          })
                        }
                        data-ocid={`pembantu.secondary_button.${idx + 1}`}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Lihat
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          navigate({
                            to: "/form",
                            search: { targetOwner: record.owner.toString() },
                          })
                        }
                        className="bg-primary text-primary-foreground font-body"
                        data-ocid={`pembantu.edit_button.${idx + 1}`}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Isi Form
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function PendingVerificationView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20"
      data-ocid="pending-verification.panel"
    >
      <div className="max-w-md mx-auto text-center p-10 bg-card rounded-2xl shadow-scout border border-amber-200">
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
          <Clock className="h-10 w-10 text-amber-500" />
        </div>
        <h2 className="font-display font-bold text-2xl text-foreground mb-3">
          Menunggu Verifikasi
        </h2>
        <p className="text-muted-foreground font-body text-sm leading-relaxed">
          Permintaan Anda untuk menjadi Admin Pembantu sedang dalam proses
          verifikasi oleh Admin Utama. Silakan tunggu konfirmasi.
        </p>
        <div className="mt-6 px-4 py-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-amber-700 font-body text-xs font-medium">
            ⏳ Proses verifikasi biasanya memerlukan beberapa saat. Halaman ini
            akan diperbarui otomatis setelah disetujui.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function RegisterPembantuSection() {
  const { data: isPending, isLoading: pendingLoading } =
    useIsAdminPembantuPending();
  const requestMutation = useRequestAdminPembantu();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Separator className="my-8" />
      <Card className="border border-dashed border-primary/40 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Ingin Membantu Mengisi Penilaian?
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingLoading ? (
            <Skeleton
              className="h-9 w-48 rounded-lg"
              data-ocid="register-pembantu.loading_state"
            />
          ) : isPending ? (
            <div
              className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200"
              data-ocid="register-pembantu.loading_state"
            >
              <Clock className="h-5 w-5 text-amber-500 shrink-0" />
              <p className="text-amber-700 font-body text-sm">
                Permintaan Anda sedang menunggu verifikasi admin
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <p className="text-muted-foreground font-body text-sm flex-1">
                Daftar sebagai Admin Pembantu untuk membantu mengisi formulir
                penilaian Kwartir Ranting.
              </p>
              <Button
                onClick={async () => {
                  try {
                    await requestMutation.mutateAsync();
                    toast.success(
                      "Permintaan terkirim! Menunggu persetujuan admin.",
                    );
                  } catch (e) {
                    toast.error(
                      `Gagal mengirim permintaan: ${
                        e instanceof Error ? e.message : String(e)
                      }`,
                    );
                  }
                }}
                disabled={requestMutation.isPending}
                className="bg-primary text-primary-foreground font-body font-semibold shrink-0"
                data-ocid="register-pembantu.primary_button"
              >
                {requestMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                Daftar sebagai Admin Pembantu
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function UserView({ principal }: { principal: Principal }) {
  const { data: record, isLoading } = useKwartirRanting(principal);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div data-ocid="penilaian.loading_state">
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      {!record ? (
        <div className="text-center py-16" data-ocid="penilaian.empty_state">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <ClipboardList className="h-16 w-16 text-primary/40 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-foreground mb-2">
              Belum Ada Penilaian
            </h3>
            <p className="text-muted-foreground font-body text-sm mb-6">
              Anda belum mengisi formulir penilaian. Mulai sekarang untuk
              mendaftarkan Kwartir Ranting Anda.
            </p>
            <Button
              onClick={() =>
                navigate({ to: "/form", search: { targetOwner: undefined } })
              }
              className="bg-primary text-primary-foreground hover:bg-forest-dark font-body font-semibold"
              data-ocid="penilaian.primary_button"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Mulai Penilaian
            </Button>
          </motion.div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="shadow-scout border-border">
            <CardHeader className="form-section-header rounded-t-lg">
              <CardTitle className="font-display text-white text-lg">
                {record.profile.namaKwarran || "Kwartir Ranting Saya"}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={record.status} />
                <span className="text-white/70 font-body text-xs">
                  Ketua: {record.profile.ketua || "-"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    label: "Skor Profil",
                    value: record.rekapan.skorProfil.toString(),
                    color: "text-primary",
                  },
                  {
                    label: "Skor Potensi",
                    value: record.rekapan.skorPotensi.toString(),
                    color: "text-blue-600",
                  },
                  {
                    label: "Skor Kegiatan",
                    value: record.rekapan.skorKegiatan.toString(),
                    color: "text-green-600",
                  },
                  {
                    label: "Total Skor",
                    value: record.rekapan.skorTotal.toString(),
                    color: "text-gold",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="text-center p-3 bg-muted/50 rounded-lg"
                  >
                    <div
                      className={`font-display font-bold text-2xl ${item.color}`}
                    >
                      {item.value}
                    </div>
                    <div className="text-xs text-muted-foreground font-body mt-1">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() =>
                    navigate({
                      to: "/detail/$ownerId",
                      params: { ownerId: principal.toString() },
                    })
                  }
                  variant="outline"
                  className="font-body"
                  data-ocid="penilaian.secondary_button"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Lihat Rekap
                </Button>
                {record.status !== Status.submitted && (
                  <Button
                    onClick={() =>
                      navigate({
                        to: "/form",
                        search: { targetOwner: undefined },
                      })
                    }
                    className="bg-primary text-primary-foreground font-body"
                    data-ocid="penilaian.edit_button.1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Penilaian
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <RegisterPembantuSection />
    </div>
  );
}

export default function HomePage() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const { data: isAdminPembantu } = useIsAdminPembantu();
  const { data: isAdminPembantuPending } = useIsAdminPembantuPending();
  const isLoggedIn = !!identity;
  const isInitializing = loginStatus === "initializing";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-body font-semibold tracking-wide uppercase mb-3">
            Kwarcab Subang
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
            Penilaian Kwartir Ranting Tergiat
          </h1>
          <p className="text-muted-foreground font-body text-sm max-w-xl mx-auto">
            Sistem penilaian resmi untuk menentukan Kwartir Ranting Tergiat
            dalam lingkungan Kwartir Cabang Subang.
          </p>
        </div>

        {isInitializing ? (
          <div className="text-center py-10">
            <Skeleton className="h-40 w-full max-w-md mx-auto rounded-2xl" />
          </div>
        ) : !isLoggedIn ? (
          <div className="text-center py-10">
            <div className="max-w-md mx-auto p-8 bg-card rounded-2xl shadow-scout border border-border">
              <Trophy className="h-12 w-12 text-gold mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl mb-2">
                Silakan Masuk
              </h3>
              <p className="text-muted-foreground font-body text-sm mb-4">
                Login untuk mengakses formulir penilaian Kwartir Ranting Anda.
              </p>
            </div>
          </div>
        ) : isAdmin ? (
          <AdminView />
        ) : isAdminPembantu ? (
          <AdminPembantuView />
        ) : isAdminPembantuPending ? (
          <PendingVerificationView />
        ) : identity ? (
          <UserView principal={identity.getPrincipal()} />
        ) : null}
      </motion.div>
    </div>
  );
}
