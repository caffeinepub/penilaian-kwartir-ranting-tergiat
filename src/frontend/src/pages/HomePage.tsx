import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Principal } from "@icp-sdk/core/principal";
import { useNavigate } from "@tanstack/react-router";
import { ClipboardList, Edit, Eye, PlusCircle, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllKwartirRanting,
  useIsAdmin,
  useKwartirRanting,
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

function AdminView() {
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

  if (!record) {
    return (
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
            onClick={() => navigate({ to: "/form" })}
            className="bg-primary text-primary-foreground hover:bg-forest-dark font-body font-semibold"
            data-ocid="penilaian.primary_button"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Mulai Penilaian
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
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
                onClick={() => navigate({ to: "/form" })}
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
  );
}

export default function HomePage() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const isLoggedIn = loginStatus === "success";

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

        {!isLoggedIn ? (
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
        ) : identity ? (
          <UserView principal={identity.getPrincipal()} />
        ) : null}
      </motion.div>
    </div>
  );
}
