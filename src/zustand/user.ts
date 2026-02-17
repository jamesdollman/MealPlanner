import { create } from "zustand";

type SessionState = {
  isLoggedIn: boolean;
  setLoggedInState: (newLoginState: boolean) => void
}

export const useSession = create<SessionState>((set) => ({
  isLoggedIn: false,
  setLoggedInState: (newLoginState) => set(() => ({isLoggedIn: newLoginState})),
}))