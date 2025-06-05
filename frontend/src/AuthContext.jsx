import { createContext, useState, useEffect } from "react";

function parseToken(tok) {
  try {
    const payload = JSON.parse(atob(tok.split(".")[1]));
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
