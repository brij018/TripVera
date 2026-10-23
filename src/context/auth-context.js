import { createContext } from "react";

const authContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  signup: () => {},
  loginWithGoogle: () => {},
  logout: () => {},
});

export default authContext;
