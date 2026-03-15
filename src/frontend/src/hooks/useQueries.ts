import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { KwartirRanting, UserProfile, UserRole } from "../backend";
import { useActor } from "./useActor";

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCallerRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["callerRole"],
    queryFn: async () => {
      if (!actor) return "guest" as UserRole;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllKwartirRanting() {
  const { actor, isFetching } = useActor();
  return useQuery<KwartirRanting[]>({
    queryKey: ["allKwartirRanting"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSortedByScore();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useKwartirRanting(principal: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<KwartirRanting | null>({
    queryKey: ["kwartirRanting", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      try {
        return await actor.getRecord(principal);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useSaveKwartirRanting() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (record: KwartirRanting) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.createOrUpdateKwartirRanting(record);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allKwartirRanting"] });
      qc.invalidateQueries({ queryKey: ["kwartirRanting"] });
    },
  });
}

export function useSubmitKwartirRanting() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (record: KwartirRanting) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.submitKwartirRanting(record);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allKwartirRanting"] });
      qc.invalidateQueries({ queryKey: ["kwartirRanting"] });
    },
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

export function useAssignRole() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerRole"] });
      qc.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}
