import { createContext, useState, useEffect } from "react";

function parseToken(tok) {
  try {
    const segment = tok.split(".")[1];
    const padded = segment.padEnd(
      segment.length + ((4 - (segment.length % 4)) % 4),
      "=",
    );
    const payload = JSON.parse(
      atob(padded.replace(/-/g, "+").replace(/_/g, "/")),
    );
    return payload.dietist_id || null;
  } catch {
    return null;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [dietistId, setDietistId] = useState(() => {
    const t = localStorage.getItem("token");
    return t ? parseToken(t) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setDietistId(parseToken(token));
    } else {
      localStorage.removeItem("token");
      setDietistId(null);
    }
  }, [token]);

  const login = (tok) => {
    setToken(tok);
    setDietistId(parseToken(tok));
  };
  const logout = () => {
    setToken(null);
    setDietistId(null);
  };

  return (
    <AuthContext.Provider value={{ token, dietistId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
