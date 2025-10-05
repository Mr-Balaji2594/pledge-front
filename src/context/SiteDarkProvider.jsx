import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import PageLoader from "../components/Page-Loader/PageLoader";
import { message } from "antd";

const SiteContext = createContext();
export const useSiteContext = () => {
  return useContext(SiteContext);
};

const ThemeContext = createContext();
export const useThemeContext = () => useContext(ThemeContext);

export const SiteProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("user");
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const setLoading = useCallback((status, msg = "") => {
    setIsLoading(status);
    setLoadingMsg(msg);
  }, []);

  const login = useCallback((userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const jwtLogin = useCallback((userData) => {
    localStorage.setItem("token", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    message.success("Logged out successfully");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  }, []);

  return (
    <SiteContext.Provider
      value={{
        login,
        logout,
        setLoading,
        user,
        jwtLogin,
      }}
    >
      <ThemeContext.Provider
        value={{
          theme,
          toggleTheme,
        }}
      >
        {children}
        <PageLoader loading={isLoading} msg={loadingMsg} />
      </ThemeContext.Provider>
    </SiteContext.Provider>
  );
};

SiteProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
