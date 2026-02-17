import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

type UserData = {
  user: User | null;
  session: Session | null;
};

type SessionState = {
  isLoggedIn: boolean;
  setLoggedInState: (userInfo: UserData) => void;
  user: UserData | null;
  getUser: () => UserData | null;
};

export const useSession = create<SessionState>((set, get) => ({
  isLoggedIn: false,
  user: null,
  setLoggedInState: (userInfo) =>
    set(() => ({ isLoggedIn: true, user: userInfo })),
  getUser: () => get().user,
}));
