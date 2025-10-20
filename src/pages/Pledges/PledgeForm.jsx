import { useState, useEffect, useCallback } from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Button,
  Card,
  Row,
  Col,
  Upload,
  message,
  Spin,
  Divider,
  Tooltip,
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  InfoCircleOutlined,
  CalculatorOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/ApiServices";
import { CUSTOMER_URL, PLEDGE_URL } from "../../api/CommonApi";

const { Option } = Select;

const PledgeForm = ({ isEdit = false }) => {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState([]);
  const [imageFileList, setImageFileList] = useState([]);
  const [aadharFileList, setAadharFileList] = useState([]);
  const navigate = useNavigate();
  const { hashid } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  // Fetch customers for dropdown
  const fetchCustomers = useCallback(async () => {
    try {
      const response = await axiosInstance.get(CUSTOMER_URL.GET_CUSTOMERS);
      const customerData = Array.isArray(response.data) ? response.data : [];
      setCustomers(customerData);
    } catch (error) {
      console.error("Error fetching customers:", error);
      message.error("Failed to load customers");
      setCustomers([]);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Fetch pledge data for edit mode
  useEffect(() => {
    if (isEdit) {
      if (!hashid) {
        message.error("Invalid pledge ID");
        navigate("/admin/pledges");
        return;
      }

      setFetchingData(true);
      axiosInstance
        .get(`${PLEDGE_URL.GET_PLEDGE_BY_HASHID}/${hashid}`)
        .then((response) => {
          const pledgeData = response.data;
          if (pledgeData) {
            const formattedData = {
              ...pledgeData,
              date_of_pledge: pledgeData.date_of_pledge
                ? dayjs(pledgeData.date_of_pledge)
                : null,
              date_of_maturity: pledgeData.date_of_maturity
                ? dayjs(pledgeData.date_of_maturity)
                : null,
            };
            form.setFieldsValue(formattedData);

            // Restore file lists if available
            if (pledgeData.image_upload) {
              setImageFileList([
                {
                  uid: "-1",
                  name: "ornament-image",
                  status: "done",
                  url: pledgeData.image_upload,
                },
              ]);
            }
            if (pledgeData.aadhar_upload) {
              setAadharFileList([
                {
                  uid: "-1",
                  name: "aadhar-document",
                  status: "done",
                  url: pledgeData.aadhar_upload,
                },
              ]);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching pledge data:", error);
          message.error("Failed to load pledge data");
          navigate("/admin/pledges");
        })
        .finally(() => {
          setFetchingData(false);
        });
    }
  }, [isEdit, hashid, form, navigate]);

  // Calculate grand total with taxes
  const calculateGrandTotal = useCallback(
    (amount = null) => {
      const baseAmount = amount ?? form.getFieldValue("amount") ?? 0;
      const gstRate = form.getFieldValue("gst_rate") || 5;

      // Split GST equally between SGST and CGST
      const totalGstPercent = gstRate / 100;
      const sgstPercent = totalGstPercent / 2;
      const cgstPercent = totalGstPercent / 2;

      const sgst = baseAmount * sgstPercent;
      const cgst = baseAmount * cgstPercent;
      const grandTotal = baseAmount + sgst + cgst;

      form.setFieldsValue({
        sgst: parseFloat(sgst.toFixed(2)),
        cgst: parseFloat(cgst.toFixed(2)),
        grand_total: parseFloat(grandTotal.toFixed(2)),
      });
    },
    [form]
  );

  // Calculate amount based on weight, rate, and loan percentage
  const calculateAmount = useCallback(() => {
    const weight = form.getFieldValue("weight");
    const rate = form.getFieldValue("current_rate_per_gram");
    const loanPercent = form.getFieldValue("fixed_percent_loan");

    if (weight && rate && loanPercent) {
      const amount = (weight * rate * loanPercent) / 100;
      const roundedAmount = parseFloat(amount.toFixed(2));
      form.setFieldsValue({ amount: roundedAmount });
      calculateGrandTotal(roundedAmount);
    }
  }, [form, calculateGrandTotal]);

  // Calculate maturity date (12 months from pledge date)
  const handlePledgeDateChange = (date) => {
    if (date) {
      const maturityDate = date.add(12, "months");
      form.setFieldsValue({ date_of_maturity: maturityDate });
    }
  };

  // Handle customer selection
  const handleCustomerChange = (customerId) => {
    const selectedCustomer = customers.find(
      (c) => c.customer_id === customerId
    );
    if (selectedCustomer) {
      form.setFieldsValue({ customer_name: selectedCustomer.customer_name });
    }
  };

  // Handle GST rate change
  const handleGstRateChange = () => {
    const amount = form.getFieldValue("amount");
    if (amount) {
      calculateGrandTotal(amount);
    }
  };

  // Handle file upload for images
  const handleImageUpload = ({ fileList }) => {
    setImageFileList(fileList.slice(-1)); // Keep only the latest file
  };

  // Handle file upload for Aadhar
  const handleAadharUpload = ({ fileList }) => {
    setAadharFileList(fileList.slice(-1)); // Keep only the latest file
  };

  // Form submission
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append all form fields
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined && values[key] !== null) {
          if (dayjs.isDayjs(values[key])) {
            formData.append(key, values[key].format("YYYY-MM-DD"));
          } else if (key !== "image_upload" && key !== "aadhar_upload") {
            formData.append(key, values[key]);
          }
        }
      });

      // Append files if they exist
      if (imageFileList.length > 0 && imageFileList[0].originFileObj) {
        formData.append("image_upload", imageFileList[0].originFileObj);
      }
      if (aadharFileList.length > 0 && aadharFileList[0].originFileObj) {
        formData.append("aadhar_upload", aadharFileList[0].originFileObj);
      }

      if (isEdit) {
        const response = await axiosInstance.put(
          `${PLEDGE_URL.UPDATE_PLEDGE}/${hashid}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        message.success(response.data.message || "Pledge updated successfully");
      } else {
        const response = await axiosInstance.post(
          PLEDGE_URL.CREATE_PLEDGE,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        message.success(response.data.message || "Pledge created successfully");
      }
      navigate("/admin/pledges");
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
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("File must be smaller than 5MB!");
      }
      return false; // Prevent automatic upload
    },
    maxCount: 1,
    accept: "image/*,.pdf",
  };

  return (
    <Spin spinning={fetchingData} tip="Loading pledge data...">
      <Button
        type="primary"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Go Back
      </Button>

      <Card
        title={
          <span style={{ fontSize: "18px", fontWeight: 600 }}>
            {isEdit ? "Edit Pledge" : "Create New Pledge"}
          </span>
        }
        bordered
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            fixed_percent_loan: 75,
            interest_rate: 12,
            late_payment_interest: 2,
            gst_rate: 5,
          }}
        >
          {/* Customer Information */}
          <Divider orientation="left">Customer Information</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="customer_id"
                label="Customer"
                rules={[
                  { required: true, message: "Please select a customer" },
                ]}
              >
                <Select
                  placeholder="Select Customer"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={handleCustomerChange}
                  disabled={isEdit}
                >
                  {customers.map((customer) => (
                    <Option
                      key={customer.customer_id}
                      value={customer.customer_id}
                    >
                      {customer.customer_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="customer_name" label="Customer Name">
                <Input disabled placeholder="Auto-filled from selection" />
              </Form.Item>
            </Col>
          </Row>

          {/* Ornament Details */}
          <Divider orientation="left">Ornament Details</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="ornament_name"
                label="Ornament Name"
                rules={[
                  { required: true, message: "Please enter ornament name" },
                  { max: 100, message: "Name cannot exceed 100 characters" },
                ]}
              >
                <Input placeholder="e.g., Gold Necklace" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="ornament_nature"
                label="Ornament Nature"
                rules={[
                  { required: true, message: "Please select ornament nature" },
                ]}
              >
                <Select placeholder="Select Nature">
                  <Option value="Gold">Gold</Option>
                  <Option value="Silver">Silver</Option>
                  <Option value="Diamond">Diamond</Option>
                  <Option value="Platinum">Platinum</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="weight"
                label={
                  <span>
                    Weight (grams){" "}
                    <Tooltip title="Enter the weight of the ornament in grams">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter weight" },
                  {
                    type: "number",
                    min: 0.01,
                    message: "Weight must be greater than 0",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter weight"
                  min={0.01}
                  step={0.01}
                  precision={2}
                  onChange={calculateAmount}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="current_rate_per_gram"
                label={
                  <span>
                    Rate per Gram (₹){" "}
                    <Tooltip title="Current market rate per gram">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter rate" },
                  {
                    type: "number",
                    min: 0.01,
                    message: "Rate must be greater than 0",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter rate"
                  min={0.01}
                  step={0.01}
                  precision={2}
                  onChange={calculateAmount}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="fixed_percent_loan"
                label={
                  <span>
                    Loan Percentage (%){" "}
                    <Tooltip title="Percentage of ornament value to be given as loan">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter loan percentage" },
                  {
                    type: "number",
                    min: 1,
                    max: 100,
                    message: "Percentage must be between 1 and 100",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter percentage"
                  min={1}
                  max={100}
                  step={1}
                  onChange={calculateAmount}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Loan Details */}
          <Divider orientation="left">Loan Details</Divider>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="date_of_pledge"
                label="Date of Pledge"
                rules={[
                  { required: true, message: "Please select pledge date" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  onChange={handlePledgeDateChange}
                  disabledDate={(current) => {
                    return current && current > dayjs().endOf("day");
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="date_of_maturity"
                label={
                  <span>
                    Date of Maturity{" "}
                    <Tooltip title="Auto-calculated as 12 months from pledge date">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: true, message: "Please select maturity date" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  disabled
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="interest_rate"
                label="Interest Rate (% per annum)"
                rules={[
                  { required: true, message: "Please enter interest rate" },
                  {
                    type: "number",
                    min: 0,
                    max: 100,
                    message: "Rate must be between 0 and 100",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter interest rate"
                  min={0}
                  max={100}
                  step={0.1}
                  precision={2}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="late_payment_interest"
                label={
                  <span>
                    Late Payment Interest (% per month){" "}
                    <Tooltip title="Additional interest charged for late payments">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </span>
                }
                rules={[
                  {
                    type: "number",
                    min: 0,
                    max: 100,
                    message: "Rate must be between 0 and 100",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter late payment interest"
                  min={0}
                  max={100}
                  step={0.1}
                  precision={2}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Financial Details */}
          <Divider orientation="left">
            <CalculatorOutlined /> Financial Details
          </Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="amount"
                label="Loan Amount (₹)"
                rules={[
                  { required: true, message: "Please enter amount" },
                  {
                    type: "number",
                    min: 0.01,
                    message: "Amount must be greater than 0",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Calculated automatically"
                  min={0.01}
                  step={0.01}
                  precision={2}
                  onChange={() => calculateGrandTotal()}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="gst_rate"
                label="GST Rate (%)"
                rules={[{ required: true, message: "Please select GST rate" }]}
              >
                <Select
                  placeholder="Select GST rate"
                  onChange={handleGstRateChange}
                >
                  <Option value={5}>5%</Option>
                  <Option value={12}>12%</Option>
                  <Option value={18}>18%</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="sgst" label="SGST (₹)">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Auto-calculated"
                  disabled
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="cgst" label="CGST (₹)">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Auto-calculated"
                  disabled
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="grand_total" label="Grand Total (₹)">
                <InputNumber
                  style={{
                    width: "100%",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                  placeholder="Auto-calculated"
                  disabled
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Document Uploads */}
          <Divider orientation="left">Document Uploads</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="image_upload"
                label="Ornament Image"
                tooltip="Upload an image of the ornament (Max 5MB)"
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
            <Col xs={24} md={12}>
              <Form.Item
                name="aadhar_upload"
                label="Aadhar Document"
                tooltip="Upload customer's Aadhar card (Max 5MB)"
              >
                <Upload
                  {...uploadProps}
                  fileList={aadharFileList}
                  onChange={handleAadharUpload}
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Upload Aadhar</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
              block
            >
              {isEdit ? "Update Pledge" : "Create Pledge"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default PledgeForm;
