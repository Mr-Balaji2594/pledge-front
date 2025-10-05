import ParentRoute from "./routing/BaseRoute";
import { SiteProvider } from "./context/SiteDarkProvider";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
const App = () => {
  useEffect(() => {
    const disableRightClick = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", disableRightClick);
    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);
  return (
    <SiteProvider>
      <div className="App">
        <ParentRoute />
        <Toaster position="top-right" />
      </div>
    </SiteProvider>
  );
};

export default App;
