import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import { Eye, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useAllKwartirRanting } from "../hooks/useQueries";
import { Status } from "../types/form";

function MedalIcon({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-2xl">🥇</span>;
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-display font-bold text-sm">
      {rank}
    </span>
  );
}

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

function TopThreeCard({
  record,
  rank,
}: {
  record: {
    profile: { namaKwarran: string; ketua: string };
    rekapan: {
      skorTotal: bigint;
      skorProfil: bigint;
      skorPotensi: bigint;
      skorKegiatan: bigint;
    };
    status: Status;
    owner: { toString: () => string };
  };
  rank: number;
}) {
  const navigate = useNavigate();
  const medals = ["🥇", "🥈", "🥉"];
  const ringColors = [
    "ring-2 ring-yellow-400 shadow-[0_0_24px_rgba(250,204,21,0.35)]",
    "ring-2 ring-slate-400 shadow-[0_0_16px_rgba(148,163,184,0.25)]",
    "ring-2 ring-amber-600 shadow-[0_0_16px_rgba(217,119,6,0.25)]",
  ];
  const headerBg = [
    "from-yellow-600/20 to-yellow-400/10",
    "from-slate-400/20 to-slate-300/10",
    "from-amber-700/20 to-amber-500/10",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1, type: "spring", stiffness: 120 }}
      whileHover={{ scale: 1.02 }}
      className={`rounded-2xl bg-card border border-border ${ringColors[rank - 1]} overflow-hidden cursor-pointer`}
      onClick={() =>
        navigate({
          to: "/detail/$ownerId",
          params: { ownerId: record.owner.toString() },
        })
      }
      data-ocid={`ranking.item.${rank}`}
    >
      <div className={`px-5 py-4 bg-gradient-to-br ${headerBg[rank - 1]}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl">{medals[rank - 1]}</span>
          <StatusBadge status={record.status} />
        </div>
        <div className="font-display font-bold text-lg text-foreground leading-tight">
          {record.profile.namaKwarran || "—"}
        </div>
        <div className="text-xs text-muted-foreground font-body mt-1">
          Ketua: {record.profile.ketua || "—"}
        </div>
      </div>
      <div className="px-5 py-4 grid grid-cols-2 gap-x-4 gap-y-2">
        <div className="col-span-2 flex items-center gap-2 mb-1">
          <Trophy className="h-4 w-4 gold-accent" />
          <span className="font-display font-bold text-2xl gold-accent">
            {record.rekapan.skorTotal.toString()}
          </span>
          <span className="text-xs text-muted-foreground font-body">
            Total Skor
          </span>
        </div>
        {[
          { label: "Profil", val: record.rekapan.skorProfil },
          { label: "Potensi", val: record.rekapan.skorPotensi },
          { label: "Kegiatan", val: record.rekapan.skorKegiatan },
        ].map((s) => (
          <div
            key={s.label}
            className="text-xs text-muted-foreground font-body"
          >
            <span className="font-semibold text-foreground">
              {s.val.toString()}
            </span>{" "}
            {s.label}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function RankingPage() {
  const { data: records, isLoading } = useAllKwartirRanting();
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-body font-semibold tracking-wide uppercase mb-4">
          <Trophy className="h-3.5 w-3.5" />
          Kwarcab Subang
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
          Papan Peringkat Kwartir Ranting
        </h1>
        <p className="text-muted-foreground font-body text-sm max-w-xl mx-auto">
          Peringkat Kwartir Ranting berdasarkan total skor penilaian tergiat
          dalam lingkungan Kwartir Cabang Subang.
        </p>
      </motion.div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-4" data-ocid="ranking.loading_state">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!records || records.length === 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
          data-ocid="ranking.empty_state"
        >
          <Trophy className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-foreground mb-2">
            Belum Ada Data Peringkat
          </h3>
          <p className="text-muted-foreground font-body text-sm">
            Peringkat akan muncul setelah Kwartir Ranting mengisi formulir
            penilaian.
          </p>
        </motion.div>
      )}

      {/* Top 3 podium */}
      {!isLoading && records && records.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {records.slice(0, 3).map((record, idx) => (
              <TopThreeCard
                key={record.owner.toString()}
                record={record}
                rank={idx + 1}
              />
            ))}
          </div>

          {/* Full ranking table */}
          {records.length > 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="shadow-scout border-border overflow-hidden">
                <div className="form-section-header px-6 py-4">
                  <h2 className="font-display font-semibold text-white text-lg">
                    Peringkat Lengkap
                  </h2>
                </div>
                <CardContent className="p-0">
                  <Table data-ocid="ranking.table">
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="font-body font-semibold text-foreground w-16 pl-6">
                          #
                        </TableHead>
                        <TableHead className="font-body font-semibold text-foreground">
                          Kwartir Ranting
                        </TableHead>
                        <TableHead className="font-body font-semibold text-foreground hidden md:table-cell">
                          Profil
                        </TableHead>
                        <TableHead className="font-body font-semibold text-foreground hidden md:table-cell">
                          Potensi
                        </TableHead>
                        <TableHead className="font-body font-semibold text-foreground hidden md:table-cell">
                          Kegiatan
                        </TableHead>
                        <TableHead className="font-body font-semibold text-foreground">
                          Total
                        </TableHead>
                        <TableHead className="font-body font-semibold text-foreground">
                          Status
                        </TableHead>
                        <TableHead className="w-12" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.slice(3).map((record, idx) => {
                        const rank = idx + 4;
                        return (
                          <TableRow
                            key={record.owner.toString()}
                            className="border-border hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() =>
                              navigate({
                                to: "/detail/$ownerId",
                                params: { ownerId: record.owner.toString() },
                              })
                            }
                            data-ocid={`ranking.row.${rank}`}
                          >
                            <TableCell className="pl-6">
                              <MedalIcon rank={rank} />
                            </TableCell>
                            <TableCell>
                              <div className="font-body font-semibold text-foreground text-sm">
                                {record.profile.namaKwarran || "—"}
                              </div>
                              <div className="text-xs text-muted-foreground font-body">
                                Ketua: {record.profile.ketua || "—"}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell font-body text-sm">
                              {record.rekapan.skorProfil.toString()}
                            </TableCell>
                            <TableCell className="hidden md:table-cell font-body text-sm">
                              {record.rekapan.skorPotensi.toString()}
                            </TableCell>
                            <TableCell className="hidden md:table-cell font-body text-sm">
                              {record.rekapan.skorKegiatan.toString()}
                            </TableCell>
                            <TableCell>
                              <span className="font-display font-bold text-gold">
                                {record.rekapan.skorTotal.toString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={record.status} />
                            </TableCell>
                            <TableCell>
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
