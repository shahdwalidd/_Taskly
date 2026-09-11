import { useEffect, useState } from "react";
import { Savesession, Clearsession, getsession } from "../store/Authstore";
import { refreshAccessToken } from "../services/AuthService";

interface Authstate {
  isauth: boolean;
  isloading: boolean;
}

export function useAuth(): Authstate {
  const [state, setState] = useState<Authstate>({
    isauth: false,
    isloading: true,
  });

  useEffect(() => {
    async function checkSession() {
      const session = getsession();

      if (!session) {
        setState({ isauth: false, isloading: false });
        return;
      }

      const isTokenExpired = Date.now() / 1000 > session.expires_at;

      if (!isTokenExpired) {
        setState({ isauth: true, isloading: false });
        return;
      }

      try {
        const refresh = await refreshAccessToken(session.refresh_token);

        Savesession(
          {
            access_token: refresh.access_token,
            refresh_token: refresh.refresh_token,
            expires_at: refresh.expires_at,
          },
          session.remember_me
        );

        setState({ isauth: true, isloading: false });
      } catch {
        Clearsession();
        setState({ isauth: false, isloading: false });
      }
    }

    checkSession();
  }, []);

  return state;
}