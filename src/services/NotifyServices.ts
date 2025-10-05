import { toast, ToastOptions } from "react-hot-toast";
import Swal, { SweetAlertOptions } from "sweetalert2";

/**
 * Show a toast using react-hot-toast with dark/light styling.
 */
const showDarkNotify = (
  type: "success" | "error" | "warn" | "info",
  msg: string,
  options: ToastOptions = {}
) => {
  const baseOptions: ToastOptions = {
    duration: 1000,
    position: "top-right",
    style: {
      padding: "12px 16px",
      borderRadius: "8px",
      background: "white",
      color: "black",
    },
    ...options,
  };

  const typeStyles: Record<string, Partial<ToastOptions>> = {
    success: {
      style: { color: "green", borderLeft: "5px solid green" },
      icon: "✅",
    },
    error: {
      style: { color: "red", borderLeft: "5px solid red" },
      icon: "❌",
    },
    warn: {
      style: { color: "orange", borderLeft: "5px solid orange" },
      icon: "⚠️",
    },
    info: {
      style: { color: "blue", borderLeft: "5px solid blue" },
      icon: "ℹ️",
    },
  };

  const toastOptions = {
    ...baseOptions,
    ...(typeStyles[type] || {}),
  };

  return toast(msg, toastOptions);
};

/**
 * Show SweetAlert2 modal
 */
const showAlert = (
  title: string,
  text: string,
  icon: SweetAlertOptions["icon"] = "info"
) => {
  Swal.fire({
    title,
    text,
    icon,
  });
};

/**
 * Auto-close SweetAlert2 modal
 */
const showAlertAutoClose = (
  text: string,
  icon: SweetAlertOptions["icon"] = "info",
  timer: number = 2000
) => {
  Swal.fire({
    title: "",
    text,
    icon,
    timer,
    showConfirmButton: false,
  });
};

/**
 * Show confirmation dialog with Yes or No
 */
const showYesOrNoAlert = (
  text: string,
  callBack: (response: "yes" | "no") => void,
  icon: SweetAlertOptions["icon"] = "question"
) => {
  Swal.fire({
    title: "",
    text,
    icon,
    showConfirmButton: true,
    showCancelButton: true,
    cancelButtonText: "No",
    confirmButtonText: "Yes",
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      callBack("yes");
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      callBack("no");
    }
  });
};

export { showDarkNotify, showAlert, showAlertAutoClose, showYesOrNoAlert };
