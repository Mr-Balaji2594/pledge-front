import { ClipLoader } from "react-spinners";
// import { AppLogo } from "../../services/ImageServices";

const Loader = () => {
  return (
    <div 
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
      }}
    >
      {/* <img
        src={AppLogo}
        alt="Pledge Logo"
        style={{ width: "100px", height: "100px", marginBottom: "20px" }}
      /> */}
      <ClipLoader size={50} color="#4f46e5" />
    </div>
  );
};

export default Loader;
