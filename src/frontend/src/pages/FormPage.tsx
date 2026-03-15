import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FormStepA from "../components/FormStepA";
import FormStepB from "../components/FormStepB";
import FormStepC from "../components/FormStepC";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useKwartirRanting,
  useSaveKwartirRanting,
  useSubmitKwartirRanting,
} from "../hooks/useQueries";
import { calculateScore, defaultKwartirRanting } from "../types/form";
import type { KwartirRanting } from "../types/form";

const STEPS = [
  { id: 1, label: "A", title: "Profil Kwartir Ranting" },
  { id: 2, label: "B", title: "Data Potensi" },
  { id: 3, label: "C", title: "Realisasi Program Kegiatan" },
];

export default function FormPage() {
  const navigate = useNavigate();
  const { identity, loginStatus } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success";
  const principal = identity?.getPrincipal() ?? null;

  const { data: existingRecord, isLoading } = useKwartirRanting(principal);
  const saveMutation = useSaveKwartirRanting();
  const submitMutation = useSubmitKwartirRanting();

  const [step, setStep] = useState(1);
  const [record, setRecord] = useState<KwartirRanting | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (existingRecord) {
        setRecord(existingRecord);
      } else if (principal) {
        setRecord(defaultKwartirRanting(principal.toString()));
      }
    }
  }, [existingRecord, isLoading, principal]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground font-body">
          Silakan login terlebih dahulu untuk mengisi formulir.
        </p>
      </div>
    );
  }

  if (isLoading || !record) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
          <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    const scored = { ...record, rekapan: calculateScore(record) };
    try {
      await saveMutation.mutateAsync(scored);
      toast.success("Data berhasil disimpan sebagai draft");
    } catch (e) {
      toast.error(
        `Gagal menyimpan: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  };

  const handleSubmit = async () => {
    const scored = { ...record, rekapan: calculateScore(record) };
    try {
      await submitMutation.mutateAsync(scored);
      toast.success("Penilaian berhasil diajukan!");
      navigate({ to: "/" });
    } catch (e) {
      toast.error(
        `Gagal mengajukan: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  };

  const isSaving = saveMutation.isPending;
  const isSubmitting = submitMutation.isPending;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground font-body mb-4 transition-colors"
          data-ocid="form.link"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali ke Beranda
        </button>
        <h1 className="font-display font-bold text-2xl text-foreground mb-1">
          Formulir Penilaian Kwartir Ranting Tergiat
        </h1>
        <p className="text-muted-foreground font-body text-sm">
          Kwartir Cabang Subang
        </p>
      </div>

      <div className="mb-8" data-ocid="form.panel">
        <div className="flex items-center justify-between relative">
          <div className="absolute inset-x-0 top-5 h-0.5 bg-border z-0" />
          {STEPS.map((s) => (
            <div key={s.id} className="flex flex-col items-center z-10 flex-1">
              <button
                type="button"
                onClick={() => s.id <= step && setStep(s.id)}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-display font-bold text-sm transition-all ${
                  s.id < step
                    ? "step-done cursor-pointer"
                    : s.id === step
                      ? "step-active"
                      : "step-pending cursor-default"
                }`}
                data-ocid="form.tab"
              >
                {s.id < step ? <CheckCircle className="h-5 w-5" /> : s.label}
              </button>
              <span
                className={`mt-2 text-xs font-body font-medium hidden md:block ${
                  s.id === step ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {s.title}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 md:hidden text-center">
          <span className="text-sm font-body font-semibold text-primary">
            Bagian {STEPS[step - 1].label}: {STEPS[step - 1].title}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === 1 && (
            <FormStepA
              profile={record.profile}
              onChange={(profile) =>
                setRecord((r) => (r ? { ...r, profile } : r))
              }
            />
          )}
          {step === 2 && (
            <FormStepB
              potensi={record.potensi}
              onChange={(potensi) =>
                setRecord((r) => (r ? { ...r, potensi } : r))
              }
            />
          )}
          {step === 3 && (
            <FormStepC
              kegiatan={record.kegiatan}
              onChange={(kegiatan) =>
                setRecord((r) => (r ? { ...r, kegiatan } : r))
              }
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              className="font-body"
              data-ocid="form.secondary_button"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Sebelumnya
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={isSaving}
            className="font-body"
            data-ocid="form.save_button"
          >
            <Save className="h-4 w-4 mr-1" />
            {isSaving ? "Menyimpan..." : "Simpan Draft"}
          </Button>
          {step < STEPS.length ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              className="bg-primary text-primary-foreground font-body font-semibold"
              data-ocid="form.primary_button"
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gold text-foreground font-body font-semibold"
              data-ocid="form.submit_button"
            >
              <Send className="h-4 w-4 mr-1" />
              {isSubmitting ? "Mengajukan..." : "Ajukan Penilaian"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
