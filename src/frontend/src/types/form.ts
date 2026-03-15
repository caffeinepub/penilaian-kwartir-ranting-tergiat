import type {
  JudgingDocument,
  Kegiatan,
  KwartirRanting,
  Potensi,
  Profile,
  Rekap,
} from "../backend";
import {
  KategoriKegiatan,
  Status,
  Variant_hakGunaPakai_milikSendiri_tidakPunya,
} from "../backend";

export type {
  KwartirRanting,
  Profile,
  Potensi,
  Kegiatan,
  Rekap,
  JudgingDocument,
};
export {
  Variant_hakGunaPakai_milikSendiri_tidakPunya,
  KategoriKegiatan,
  Status,
};

export interface KegiatanFormItem {
  id: string;
  namaKegiatan: string;
  kategori: KategoriKegiatan;
  label: string;
}

export const KEGIATAN_LIST: KegiatanFormItem[] = [
  // C.1 Siaga
  {
    id: "siaga-pesta",
    namaKegiatan: "Pesta Siaga",
    label: "a. Pesta Siaga",
    kategori: KategoriKegiatan.siaga,
  },
  {
    id: "siaga-bazar",
    namaKegiatan: "Bazar Siaga",
    label: "b. Bazar Siaga",
    kategori: KategoriKegiatan.siaga,
  },
  {
    id: "siaga-garuda",
    namaKegiatan: "Rekruitmen Pramuka Siaga Garuda",
    label: "c. Rekruitmen Pramuka Siaga Garuda",
    kategori: KategoriKegiatan.siaga,
  },
  // C.2 Penggalang
  {
    id: "penggalang-jambore",
    namaKegiatan: "Jambore",
    label: "a. Jambore",
    kategori: KategoriKegiatan.penggalang,
  },
  {
    id: "penggalang-dianpinru",
    namaKegiatan: "Dianpinru",
    label: "b. Dianpinru",
    kategori: KategoriKegiatan.penggalang,
  },
  {
    id: "penggalang-lt2",
    namaKegiatan: "Lomba Tingkat II (LT II)",
    label: "c. Lomba Tingkat II (LT II)",
    kategori: KategoriKegiatan.penggalang,
  },
  {
    id: "penggalang-lt3",
    namaKegiatan: "Ikut serta Lomba Tingkat III (LT III)",
    label: "d. Ikut serta Lomba Tingkat III (LT III)",
    kategori: KategoriKegiatan.penggalang,
  },
  {
    id: "penggalang-garuda",
    namaKegiatan: "Rekruitmen Pramuka Penggalang Garuda",
    label: "e. Rekruitmen Pramuka Penggalang Garuda",
    kategori: KategoriKegiatan.penggalang,
  },
  // C.3 Penegak/Pandega
  {
    id: "penegak-raimuna",
    namaKegiatan: "Raimuna",
    label: "a. Raimuna",
    kategori: KategoriKegiatan.penegakPandega,
  },
  {
    id: "penegak-dianpinsat",
    namaKegiatan: "Dianpinsat",
    label: "b. Dianpinsat",
    kategori: KategoriKegiatan.penegakPandega,
  },
  {
    id: "penegak-baktikarya",
    namaKegiatan: "Perkemahan Bakti Satuan Karya (mengirimkan utusan)",
    label: "c. Perkemahan Bakti Satuan Karya",
    kategori: KategoriKegiatan.penegakPandega,
  },
  {
    id: "penegak-lgtm",
    namaKegiatan: "Lomba Gladi Tangkas Medan (LGTM)",
    label: "d. Lomba Gladi Tangkas Medan (LGTM)",
    kategori: KategoriKegiatan.penegakPandega,
  },
  {
    id: "penegak-lpk",
    namaKegiatan: "LPK Dewan Kerja",
    label: "e. Mengirimkan utusan LPK Dewan Kerja",
    kategori: KategoriKegiatan.penegakPandega,
  },
  {
    id: "penegak-kpdk",
    namaKegiatan: "KPDK (Kursus Pengelola Dewan Kerja)",
    label: "f. Mengirimkan utusan KPDK",
    kategori: KategoriKegiatan.penegakPandega,
  },
  {
    id: "penegak-garuda",
    namaKegiatan: "Rekruitmen Pramuka Penegak Garuda",
    label: "g. Rekruitmen Pramuka Penegak Garuda",
    kategori: KategoriKegiatan.penegakPandega,
  },
  {
    id: "penegak-bencana",
    namaKegiatan: "Partisipasi Penanganan Bencana",
    label: "h. Partisipasi Penanganan Bencana",
    kategori: KategoriKegiatan.penegakPandega,
  },
  {
    id: "penegak-natal",
    namaKegiatan: "Partisipasi Karya Bakti Natal dan Tahun Baru",
    label: "i. Partisipasi Karya Bakti Natal dan Tahun Baru",
    kategori: KategoriKegiatan.penegakPandega,
  },
  {
    id: "penegak-lebaran",
    namaKegiatan: "Partisipasi Karya Bakti Lebaran",
    label: "j. Partisipasi Karya Bakti Lebaran",
    kategori: KategoriKegiatan.penegakPandega,
  },
  // C.4 Anggota Dewasa
  {
    id: "dewasa-karangpamitran",
    namaKegiatan: "Karang Pamitran",
    label: "a. Karang Pamitran (Menyelenggarakan/mengirimkan utusan)",
    kategori: KategoriKegiatan.anggotaDewasa,
  },
  {
    id: "dewasa-kmd",
    namaKegiatan: "KMD (Kursus Mahir Dasar)",
    label: "b. KMD - Kursus Mahir Dasar (Menyelenggarakan/mengirimkan utusan)",
    kategori: KategoriKegiatan.anggotaDewasa,
  },
  {
    id: "dewasa-kml",
    namaKegiatan: "KML (Kursus Mahir Lanjutan)",
    label:
      "c. KML - Kursus Mahir Lanjutan (Menyelenggarakan/mengirimkan utusan)",
    kategori: KategoriKegiatan.anggotaDewasa,
  },
  {
    id: "dewasa-kpd",
    namaKegiatan: "KPD",
    label: "d. Mengirimkan utusan KPD",
    kategori: KategoriKegiatan.anggotaDewasa,
  },
  {
    id: "dewasa-kpl",
    namaKegiatan: "KPL",
    label: "e. Mengirimkan utusan KPL",
    kategori: KategoriKegiatan.anggotaDewasa,
  },
  {
    id: "dewasa-orientasi",
    namaKegiatan: "Orientasi Majelis Pembimbing",
    label:
      "f. Orientasi Majelis Pembimbing (Menyelenggarakan/mengirimkan utusan)",
    kategori: KategoriKegiatan.anggotaDewasa,
  },
  {
    id: "dewasa-bencana",
    namaKegiatan: "Partisipasi Penanganan Bencana (Dewasa)",
    label: "g. Partisipasi Penanganan Bencana",
    kategori: KategoriKegiatan.anggotaDewasa,
  },
  {
    id: "dewasa-natal",
    namaKegiatan: "Partisipasi Karya Bakti Natal dan Tahun Baru (Dewasa)",
    label: "h. Partisipasi Karya Bakti Natal dan Tahun Baru",
    kategori: KategoriKegiatan.anggotaDewasa,
  },
  {
    id: "dewasa-lebaran",
    namaKegiatan: "Partisipasi Karya Bakti Lebaran (Dewasa)",
    label: "i. Partisipasi Karya Bakti Lebaran",
    kategori: KategoriKegiatan.anggotaDewasa,
  },
];

export function calculateScore(record: KwartirRanting): Rekap {
  let skorProfil = 0;
  const p = record.profile;

  if (
    p.sekretariat === Variant_hakGunaPakai_milikSendiri_tidakPunya.milikSendiri
  )
    skorProfil += 10;
  else if (
    p.sekretariat === Variant_hakGunaPakai_milikSendiri_tidakPunya.hakGunaPakai
  )
    skorProfil += 5;

  if (p.bumiPerkemahan) {
    if (p.statusBumiPerkemahan === "milikSendiri") skorProfil += 10;
    else if (p.statusBumiPerkemahan === "hakGunaPakai") skorProfil += 5;
  }

  if (p.namaKwarran) skorProfil += 2;
  if (p.ketua) skorProfil += 2;
  if (p.alamat) skorProfil += 2;
  if (p.email) skorProfil += 2;
  if (p.noSKTerakhir) skorProfil += 2;

  const pot = record.potensi;
  const totalMuda =
    Number(pot.anggotaMuda.siagaPutera) +
    Number(pot.anggotaMuda.siagaPuteri) +
    Number(pot.anggotaMuda.penggalangPutera) +
    Number(pot.anggotaMuda.penggalangPuteri) +
    Number(pot.anggotaMuda.penegakPutera) +
    Number(pot.anggotaMuda.penegakPuteri) +
    Number(pot.anggotaMuda.pandegaPutera) +
    Number(pot.anggotaMuda.pandegaPuteri);
  const totalDewasa =
    Number(pot.anggotaDewasa.pembina) +
    Number(pot.anggotaDewasa.pelatih) +
    Number(pot.anggotaDewasa.andalan);
  const totalGudep = Number(pot.gudep.putera) + Number(pot.gudep.puteri);

  let skorPotensi = 0;
  if (totalMuda > 0) skorPotensi += Math.min(20, Math.floor(totalMuda / 10));
  if (totalDewasa > 0) skorPotensi += Math.min(10, totalDewasa);
  if (totalGudep > 0) skorPotensi += Math.min(10, totalGudep * 2);
  if (Number(pot.satgasPramukaPeduli) > 0) skorPotensi += 5;
  if (pot.satuanKaryaAktif.length > 0)
    skorPotensi += Math.min(10, pot.satuanKaryaAktif.length * 2);

  let skorKegiatan = 0;
  for (const k of record.kegiatan) {
    if (k.frekuensi >= 3n) skorKegiatan += 10;
    else if (k.frekuensi > 0n) skorKegiatan += 5;
  }

  return {
    skorProfil: BigInt(skorProfil),
    skorPotensi: BigInt(skorPotensi),
    skorKegiatan: BigInt(skorKegiatan),
    skorTotal: BigInt(skorProfil + skorPotensi + skorKegiatan),
  };
}

export function defaultKwartirRanting(ownerId: string): KwartirRanting {
  const now = BigInt(Date.now()) * 1_000_000n;
  const kegiatan = KEGIATAN_LIST.map((k) => ({
    id: k.id,
    namaKegiatan: k.namaKegiatan,
    kategori: k.kategori,
    frekuensi: 0n,
    bukti: [],
  }));

  const record: KwartirRanting = {
    id: crypto.randomUUID(),
    status: Status.draft,
    owner: { toString: () => ownerId } as any,
    kegiatan,
    profile: {
      namaKwarran: "",
      ketua: "",
      sekretariat: Variant_hakGunaPakai_milikSendiri_tidakPunya.tidakPunya,
      statusBumiPerkemahan: "",
      alamat: "",
      email: "",
      sosialMedia: "",
      bumiPerkemahan: false,
      masaBakti: [BigInt(now), BigInt(now)],
      noSKTerakhir: "",
    },
    potensi: {
      anggotaMuda: {
        siagaPutera: 0n,
        siagaPuteri: 0n,
        penggalangPutera: 0n,
        penggalangPuteri: 0n,
        penegakPutera: 0n,
        penegakPuteri: 0n,
        pandegaPutera: 0n,
        pandegaPuteri: 0n,
      },
      anggotaDewasa: { pembina: 0n, pelatih: 0n, andalan: 0n },
      gudep: { putera: 0n, puteri: 0n },
      satgasPramukaPeduli: 0n,
      karyawanSekretariat: 0n,
      satuanKaryaAktif: [],
    },
    rekapan: {
      skorProfil: 0n,
      skorPotensi: 0n,
      skorKegiatan: 0n,
      skorTotal: 0n,
    },
  };
  return record;
}
