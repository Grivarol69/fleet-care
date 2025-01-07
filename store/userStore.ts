// import create from "zustand";

// type UserRole = "SUPER_ADMIN" | "TENANT_ADMIN" | "USER";

// interface UserState {
//   userId: string | null;
//   tenantId: string | null;
//   role: UserRole | null;
//   permissions: string[];
//   setUser: (
//     userId: string,
//     tenantId: string,
//     role: UserRole,
//     permissions: string[]
//   ) => void;
//   clearUser: () => void;
// }

// export const useUserStore = create<UserState>((set: UserState) => ({
//   userId: null,
//   tenantId: null,
//   role: null,
//   permissions: [],
//   setUser: (userId: string, tenantId: string, role: UserRole, permissions: string) =>
//     set({ userId, tenantId, role, permissions }),
//   clearUser: () =>
//     set({ userId: null, tenantId: null, role: null, permissions: [] }),
// }));
