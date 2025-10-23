import {
  Form,
  message,
  Input,
  DatePicker,
  Button,
  Row,
  Col,
  Card,
  Divider,
  Spin,
  Upload,
} from "antd";
import axiosInstance from "../../services/ApiServices";
import { CUSTOMER_URL } from "../../api/CommonApi";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import useFormAutoFill from "../../services/useFormAutoFill";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";

const CustomerForm = ({ isEdit }) => {
  const { uuid } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const navigate = useNavigate();
  const { handleChange } = useFormAutoFill(form);
  const [imageFileList, setImageFileList] = useState([]);

  useEffect(() => {
    if (isEdit) {
      if (!uuid) {
        message.error("Invalid customer ID");
        navigate("/admin/customers");
        return;
      }

      setFetchingData(true);
      axiosInstance
        .get(`${CUSTOMER_URL.GET_CUSTOMER_BY_UUID}/${uuid}`)
        .then((response) => {
          const customerData = response.data;
          if (customerData) {
            const formattedData = {
              ...customerData,
              dob: customerData.dob ? dayjs(customerData.dob) : null,
            };
            form.setFieldsValue(formattedData);
          }
        })
        .catch((error) => {
          console.error("Error fetching customer data:", error);
          message.error("Failed to load customer data");
          navigate("/admin/customers");
        })
        .finally(() => {
          setFetchingData(false);
        });
    }
  }, [isEdit, uuid, form, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append all form fields
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined && values[key] !== null) {
          if (dayjs.isDayjs(values[key])) {
            formData.append(key, values[key].format("YYYY-MM-DD"));
          } else if (key !== "customer_image") {
            formData.append(key, values[key]);
          }
        }
      });

      // Append files if they exist
      if (imageFileList.length > 0 && imageFileList[0].originFileObj) {
        formData.append("customer_image", imageFileList[0].originFileObj);
      }

      if (isEdit) {
        const response = await axiosInstance.put(
          `${CUSTOMER_URL.UPDATE_CUSTOMER}/${uuid}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        message.success(
          response.data.message || "Customer updated successfully"
        );
      } else {
        const response = await axiosInstance.post(
          CUSTOMER_URL.CREATE_CUSTOMER,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        message.success(
          response.data.message || "Customer created successfully"
        );
      }
      navigate("/admin/customers");
    } catch (error) {
      console.error("Form submission failed:", error);
      message.error(
        error.response?.data?.message || "Operation failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Upload configuration
  const uploadProps = {
    beforeUpload: (file) => {
      const isValidType =
        file.type.startsWith("image/") || file.type === "application/pdf";
      if (!isValidType) {
        message.error("You can only upload image or PDF files!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("File must be smaller than 2MB!");
      }
      return false;
    },
    maxCount: 1,
    accept: "image/*,.pdf",
  };

  // Handle file upload for images
  const handleImageUpload = ({ fileList }) => {
    setImageFileList(fileList.slice(-1));
  };

  return (
    <>
      <Spin spinning={fetchingData} tip="Loading customer data...">
        {/* Customer Form Card */}
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: 16 }}
        >
          Go Back
        </Button>
        <Card
          title={<p> Customer {isEdit ? "Edit" : "Add"} Form</p>}
          variant="bordered"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        >
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
          >
            {/* Personal Information */}
            <Divider
              orientation="left"
              style={{ fontSize: "16px", fontWeight: "500" }}
            >
              Personal Information
            </Divider>
            <Row gutter={24}>
              <Col xs={24} sm={12} lg={8}>
                <Form.Item
                  label="Customer Name"
                  name="customer_name"
                  rules={[
                    { required: true, message: "Please input customer name" },
                  ]}
                >
                  <Input placeholder="Enter full name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Form.Item
                  label="Date of Birth"
                  name="dob"
                  rules={[
                    { required: true, message: "Please select date of birth" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="DD/MM/YYYY"
                    format="DD/MM/YYYY"
                    disabledDate={(current) => current && current > dayjs()}
                    inputReadOnly
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Form.Item
                  name="customer_image"
                  label="Customer Image"
                  tooltip="Upload an image of the customer (Max 2MB)"
                >
                  <Upload
                    {...uploadProps}
                    fileList={imageFileList}
                    onChange={handleImageUpload}
                    listType="picture"
                  >
                    <Button icon={<UploadOutlined />}>Upload Image</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            {/* Address Information */}
            <Divider
              orientation="left"
              style={{ fontSize: "16px", fontWeight: "500", marginTop: "32px" }}
            >
              Address Details
            </Divider>

            <Row gutter={24}>
              <Col xs={24} sm={12} lg={6}>
                <Form.Item
                  label="Pincode"
                  name="pincode"
                  rules={[
                    { required: true, message: "Please input pincode" },
                    {
                      pattern: /^\d{6}$/,
                      message: "Please enter valid 6-digit pincode",
                    },
                  ]}
                  onChange={handleChange("pincode")}
                >
                  <Input
                    placeholder="Enter pincode"
                    maxLength={6}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) e.preventDefault();
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Form.Item
                  label="Taluk"
                  name="taluk"
                  rules={[{ required: true, message: "Please input taluk" }]}
                >
                  <Input placeholder="Enter taluk" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Form.Item
                  label="District"
                  name="district"
                  rules={[{ required: true, message: "Please input district" }]}
                >
                  <Input placeholder="Enter district" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Form.Item
                  label="State"
                  name="state"
                  rules={[{ required: true, message: "Please input state" }]}
                >
                  <Input placeholder="Enter state" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Door & Street"
                  name="door_street"
                  rules={[
                    { required: true, message: "Please input door & street" },
                  ]}
                >
                  <Input placeholder="Enter door no. and street" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Area"
                  name="area"
                  rules={[{ required: true, message: "Please input area" }]}
                >
                  <Input placeholder="Enter area/locality" />
                </Form.Item>
              </Col>
            </Row>

            {/* Contact Information */}
            <Divider
              orientation="left"
              style={{ fontSize: "16px", fontWeight: "500", marginTop: "32px" }}
            >
              Contact Information
            </Divider>
            <Row gutter={24}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Mobile Number"
                  name="mobile_no"
                  rules={[
                    { required: true, message: "Please input mobile number" },
                    {
                      pattern: /^\d{10}$/,
                      message: "Please enter valid 10-digit mobile number",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter mobile number"
                    maxLength={10}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) e.preventDefault();
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Email ID"
                  name="email_id"
                  rules={[
                    { required: true, message: "Please input email ID" },
                    { type: "email", message: "Please enter valid email" },
                  ]}
                >
                  <Input placeholder="Enter email address" />
                </Form.Item>
              </Col>
            </Row>

            {/* Identity & Tax Information */}
            <Divider
              orientation="left"
              style={{ fontSize: "16px", fontWeight: "500", marginTop: "32px" }}
            >
              Identity & Tax Details
            </Divider>
            <Row gutter={24}>
              <Col xs={24} sm={12} lg={8}>
                <Form.Item
                  label="PAN Number"
                  name="pan_no"
                  rules={[
                    { required: true, message: "Please input PAN number" },
                    {
                      pattern: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}$/,
                      message: "Please enter valid PAN",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter PAN (e.g., ABCDE1234F)"
                    maxLength={10}
                    style={{ textTransform: "uppercase" }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Form.Item
                  label="Aadhar Number"
                  name="aadhar_no"
                  rules={[
                    { required: true, message: "Please input Aadhar number" },
                    {
                      pattern: /^\d{12}$/,
                      message: "Please enter valid 12-digit Aadhar",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter Aadhar number"
                    maxLength={12}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) e.preventDefault();
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Form.Item
                  label="GST Number"
                  name="gst_no"
                  rules={[
                    { required: true, message: "Please input GST number" },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();

                        // Convert input to uppercase
                        const gst = value.toUpperCase();
                        <Col xs={24} sm={12} lg={8}>
                          <Form.Item
                            label="GST Number"
                            name="gst_no"
                            rules={[
                              {
                                required: true,
                                message: "Please input GST number",
                              },
                              {
                                validator: (_, value) => {
                                  if (!value) return Promise.resolve();

                                  // Convert input to uppercase
                                  const gst = value.toUpperCase();

                                  // GST regex
                                  const gstRegex =
                                    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

                                  if (gstRegex.test(gst)) {
                                    return Promise.resolve();
                                  } else {
                                    return Promise.reject(
                                      new Error(
                                        "Please enter a valid 15-character GST number"
                                      )
                                    );
                                  }
                                },
                              },
                            ]}
                          >
                            <Input
                              placeholder="Enter GST number"
                              maxLength={15}
                              style={{ textTransform: "uppercase" }}
                            />
                          </Form.Item>
                        </Col>;

                        // GST regex
                        const gstRegex =
                          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

                        if (gstRegex.test(gst)) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject(
                            new Error(
                              "Please enter a valid 15-character GST number"
                            )
                          );
                        }
                      },
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter GST number"
                    maxLength={15}
                    style={{ textTransform: "uppercase" }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Bank Details */}
            <Divider
              orientation="left"
              style={{ fontSize: "16px", fontWeight: "500", marginTop: "32px" }}
            >
              Bank Details
            </Divider>
            <Row gutter={24}>
              <Col xs={24} sm={12} lg={8}>
                <Form.Item
                  label="IFSC Code"
                  name="ifsc_code"
                  rules={[
                    { required: true, message: "Please input IFSC code" },
                    {
                      pattern: /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/,
                      message: "Please enter valid IFSC code",
                    },
                    {
                      max: 12,
                      message: "IFSC code should not exceed 12 characters",
                    },
                  ]}
                  onChange={handleChange("ifsc")}
                >
                  <Input
                    placeholder="Enter IFSC code"
                    maxLength={12}
                    style={{ textTransform: "uppercase" }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  label="Branch"
                  name="branch"
                  rules={[{ required: true, message: "Please input branch" }]}
                >
                  <Input placeholder="Enter branch name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  label="Address"
                  name="address"
                  rules={[{ required: true, message: "Please input address" }]}
                >
                  <Input placeholder="Enter address" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xs={24} sm={12} lg={8}>
                <Form.Item
                  label="Account Number"
                  name="account_no"
                  rules={[
                    { required: true, message: "Please input account number" },
                    {
                      pattern: /^[0-9]{9,18}$/,
                      message: "Please enter valid account number",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter account number"
                    minLength={9}
                    maxLength={18}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  label="Bank Name"
                  name="bank_name"
                  rules={[
                    { required: true, message: "Please input bank name" },
                  ]}
                >
                  <Input placeholder="Enter bank name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Form.Item
                  label="MICR Code"
                  name="micr_code"
                  rules={[
                    { required: true, message: "Please input MICR code" },
                    {
                      pattern: /^\d{9}$/,
                      message: "Please enter valid 9-digit MICR code",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter MICR code"
                    maxLength={9}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) e.preventDefault();
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Form Actions */}
            <Row justify="end" style={{ marginTop: "40px" }} gutter={16}>
              <Col>
                <Button size="large" onClick={() => form.resetFields()}>
                  Reset
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                >
                  {isEdit ? "Update" : "Submit"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Spin>
    </>
  );
};

export default CustomerForm;
