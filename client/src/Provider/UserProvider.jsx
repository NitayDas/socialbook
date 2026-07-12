import { createContext, useState, useContext, useEffect } from "react";
import AxiosInstance from "../Components/AxiosInstance";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [tokens, setTokens] = useState({
    access: localStorage.getItem("access_token"),
    refresh: localStorage.getItem("refresh_token"),
  });

  // Start true — we don't know auth status until we've checked
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storeTokens = (accessToken, refreshToken) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    setTokens({ access: accessToken, refresh: refreshToken });
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await AxiosInstance.get("auth/profile/");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setTokens({ access: null, refresh: null });
    setUser(null);
  };

  useEffect(() => {
    if (tokens.access) {
      fetchUserData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        storeTokens,
        loading,
        error,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};