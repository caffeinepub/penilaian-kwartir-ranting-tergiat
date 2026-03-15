import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Order "mo:core/Order";

actor {
  include MixinStorage();

  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    kwarranName : ?Text;
  };

  // Types
  module KwartirRanting {
    public type Status = {
      #draft;
      #submitted;
      #reviewed;
    };

    public type JudgingDocument = {
      id : Text;
      name : Text;
      blob : Storage.ExternalBlob;
      createdAt : Int;
      updatedAt : Int;
      owner : Principal;
    };

    public type Profile = {
      namaKwarran : Text;
      ketua : Text;
      sekretariat : { #milikSendiri; #hakGunaPakai; #tidakPunya };
      alamat : Text;
      email : Text;
      sosialMedia : Text;
      bumiPerkemahan : Bool;
      statusBumiPerkemahan : Text;
      masaBakti : (Nat, Nat);
      noSKTerakhir : Text;
    };

    public type Potensi = {
      anggotaMuda : {
        siagaPutera : Nat;
        siagaPuteri : Nat;
        penggalangPutera : Nat;
        penggalangPuteri : Nat;
        penegakPutera : Nat;
        penegakPuteri : Nat;
        pandegaPutera : Nat;
        pandegaPuteri : Nat;
      };
      anggotaDewasa : {
        pembina : Nat;
        pelatih : Nat;
        andalan : Nat;
      };
      gudep : {
        putera : Nat;
        puteri : Nat;
      };
      satgasPramukaPeduli : Nat;
      karyawanSekretariat : Nat;
      satuanKaryaAktif : [Text];
    };

    public type Kegiatan = {
      id : Text;
      namaKegiatan : Text;
      kategori : KategoriKegiatan;
      frekuensi : Nat;
      bukti : [JudgingDocument];
    };

    public type Rekap = {
      skorProfil : Nat;
      skorPotensi : Nat;
      skorKegiatan : Nat;
      skorTotal : Nat;
    };

    public type KwartirRanting = {
      id : Text;
      owner : Principal;
      profile : Profile;
      potensi : Potensi;
      rekapan : Rekap;
      kegiatan : [Kegiatan];
      status : Status;
    };

    public type KategoriKegiatan = { #siaga; #penggalang; #penegakPandega; #anggotaDewasa };

    public func compareBySkorTotal(a : KwartirRanting, b : KwartirRanting) : Order.Order {
      func compareByProfile(p1 : Profile, p2 : Profile) : Order.Order {
        switch (Text.compare(p1.namaKwarran, p2.namaKwarran)) {
          case (#equal) {
            switch (Text.compare(p1.ketua, p2.ketua)) {
              case (#equal) { switch (Text.compare(p1.alamat, p2.alamat)) {
                case (#equal) { return #greater };
                case (order) { return order };
              } };
              case (order) { return order };
            };
          };
          case (order) { return order };
        };
      };
      switch (Nat.compare(a.rekapan.skorTotal, b.rekapan.skorTotal)) {
        case (#equal) { compareByProfile(a.profile, b.profile) };
        case (order) { order };
      };
    };
  };

  // Canister state
  let records = Map.empty<Principal, KwartirRanting.KwartirRanting>();
  let documents = Map.empty<Text, KwartirRanting.JudgingDocument>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Admin/Reviewer functions
  public query ({ caller }) func getAllSortedByScore() : async [KwartirRanting.KwartirRanting] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all rankings");
    };
    records.values().toArray().sort(KwartirRanting.compareBySkorTotal);
  };

  // Kwartir Ranting Functions
  public query ({ caller }) func getRecord(kwarranId : Principal) : async KwartirRanting.KwartirRanting {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    if (caller != kwarranId and not isAdmin) {
      Runtime.trap("Unauthorized: Can only view your own record or be an admin");
    };
    switch (records.get(kwarranId)) {
      case (?record) { record };
      case (null) { Runtime.trap("Rekening tidak ditemukan") };
    };
  };

  public shared ({ caller }) func createOrUpdateKwartirRanting(record : KwartirRanting.KwartirRanting) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create or update records");
    };
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    if (record.owner != caller and not isAdmin) {
      Runtime.trap("Akses ditolak: Hanya pemilik record yang dapat memperbarui atau admin");
    };
    records.add(record.owner, record);
  };

  public shared ({ caller }) func submitKwartirRanting(record : KwartirRanting.KwartirRanting) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit records");
    };
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    if (record.owner != caller and not isAdmin) {
      Runtime.trap("Akses ditolak: Hanya pemilik record yang dapat submit atau admin");
    };
    records.add(record.owner, {
      record with
      status = #submitted;
    });
  };

  // Document Management
  public shared ({ caller }) func uploadDocument(document : KwartirRanting.JudgingDocument) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload documents");
    };
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    if (not (isAdmin or document.owner == caller)) {
      Runtime.trap("Akses ditolak: Can only upload your own documents");
    };
    let existing = documents.get(document.id);
    let newDocument = switch (existing) {
      case (?existingDoc) {
        { existingDoc with
          blob = document.blob;
          updatedAt = document.updatedAt;
        };
      };
      case (null) { document };
    };
    documents.add(document.id, newDocument);
  };

  public query ({ caller }) func getDocument(documentId : Text) : async KwartirRanting.JudgingDocument {
    switch (documents.get(documentId)) {
      case (?document) {
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        if (document.owner != caller and not isAdmin) {
          Runtime.trap("Unauthorized: Can only view your own documents or be an admin");
        };
        document;
      };
      case (null) { Runtime.trap("Dokumen tidak ditemukan") };
    };
  };
};
