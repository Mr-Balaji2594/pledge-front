import { useRef } from "react";
import axios from "axios";
import { message } from "antd";

const useFormAutoFill = (form) => {
  const debounceTimeout = useRef(null);

  const fetchData = async (type, value) => {
    try {
      let response, data;

      if (type === "pincode") {
        response = await axios.get(
          `https://api.postalpincode.in/pincode/${value}`
        );
        data = response.data;

        if (data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
          const postOffice = data[0].PostOffice[0];
          form.setFieldsValue({
            state: postOffice.State,
            district: postOffice.District,
            taluk: postOffice.Block,
          });
        } else {
          message.warning("Invalid Pincode");
        }
      }

      if (type === "ifsc") {
        response = await axios.get(`https://ifsc.razorpay.com/${value}`);
        data = response.data;

        if (data && data.BANK) {
          form.setFieldsValue({
            bank_name: data.BANK,
            branch: data.BRANCH,
            address: data.ADDRESS,
            ifsc_code: data.IFSC,
            micr_code: data.MICR,
          });
        } else {
          message.warning("Invalid IFSC Code");
        }
      }
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      message.error(`Failed to fetch ${type} details`);
    }
  };

  const handleChange = (type) => (e) => {
    const value = e.target.value.trim().toUpperCase();

    // clear old debounce
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    if (type === "pincode" && /^\d+$/.test(value)) {
      debounceTimeout.current = setTimeout(
        () => fetchData("pincode", value),
        500
      );
    }

    if (type === "ifsc" && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) {
      debounceTimeout.current = setTimeout(() => fetchData("ifsc", value), 500);
    }
  };

  return { handleChange };
};

export default useFormAutoFill;
