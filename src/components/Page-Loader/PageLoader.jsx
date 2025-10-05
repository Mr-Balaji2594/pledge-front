import "./PageLoader.css";

const PageLoader = ({
  loading = false,
  msg = "Please wait...",
  size = 40,
  color = "#bf00ff",
}) => {
  if (!loading) return null;

  return (
    <div className="smart-page-loader" role="status" aria-live="polite">
      <div
        className="smart-spinner"
        style={{
          width: size,
          height: size,
          borderLeftColor: color,
        }}
      />
      <p className="smart-spinner-msg">{msg}</p>
    </div>
  );
};

export default PageLoader;
