import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Rekap {
    skorPotensi: bigint;
    skorKegiatan: bigint;
    skorProfil: bigint;
    skorTotal: bigint;
}
export interface Potensi {
    satuanKaryaAktif: Array<string>;
    karyawanSekretariat: bigint;
    gudep: {
        putera: bigint;
        puteri: bigint;
    };
    anggotaDewasa: {
        pelatih: bigint;
        andalan: bigint;
        pembina: bigint;
    };
    anggotaMuda: {
        siagaPutera: bigint;
        siagaPuteri: bigint;
        penegakPutera: bigint;
        penegakPuteri: bigint;
        pandegaPutera: bigint;
        pandegaPuteri: bigint;
        penggalangPutera: bigint;
        penggalangPuteri: bigint;
    };
    satgasPramukaPeduli: bigint;
}
export interface Kegiatan {
    id: string;
    frekuensi: bigint;
    kategori: KategoriKegiatan;
    bukti: Array<JudgingDocument>;
    namaKegiatan: string;
}
export interface KwartirRanting {
    id: string;
    status: Status;
    kegiatan: Array<Kegiatan>;
    owner: Principal;
    potensi: Potensi;
    rekapan: Rekap;
    profile: Profile;
}
export interface JudgingDocument {
    id: string;
    owner: Principal;
    blob: ExternalBlob;
    name: string;
    createdAt: bigint;
    updatedAt: bigint;
}
export interface Profile {
    sosialMedia: string;
    statusBumiPerkemahan: string;
    noSKTerakhir: string;
    masaBakti: [bigint, bigint];
    alamat: string;
    sekretariat: Variant_hakGunaPakai_milikSendiri_tidakPunya;
    email: string;
    namaKwarran: string;
    bumiPerkemahan: boolean;
    ketua: string;
}
export interface UserProfile {
    name: string;
    kwarranName?: string;
}
export enum KategoriKegiatan {
    penegakPandega = "penegakPandega",
    siaga = "siaga",
    anggotaDewasa = "anggotaDewasa",
    penggalang = "penggalang"
}
export enum Status {
    submitted = "submitted",
    reviewed = "reviewed",
    draft = "draft"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_hakGunaPakai_milikSendiri_tidakPunya {
    hakGunaPakai = "hakGunaPakai",
    milikSendiri = "milikSendiri",
    tidakPunya = "tidakPunya"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdateKwartirRanting(record: KwartirRanting): Promise<void>;
    getAllSortedByScore(): Promise<Array<KwartirRanting>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDocument(documentId: string): Promise<JudgingDocument>;
    getRecord(kwarranId: Principal): Promise<KwartirRanting>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitKwartirRanting(record: KwartirRanting): Promise<void>;
    uploadDocument(document: JudgingDocument): Promise<void>;
}
