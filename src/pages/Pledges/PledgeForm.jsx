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
} from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import axiosInstance from "../../services/ApiServices";
import { CUSTOMER_URL, PLEDGE_URL } from "../../api/CommonApi";

const { Option } = Select;

const PledgeForm = ({ isEdit }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [imageFileList, setImageFileList] = useState([]);
  const [aadharFileList, setAadharFileList] = useState([]);
  const navigate = useNavigate();
  const { hashid } = useParams();
  const [loading, setLocalLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  // Fetch customers for dropdown
  const fetchCustomers = useCallback(async () => {
    setLocalLoading(true);
    try {
      const response = await axiosInstance.get(CUSTOMER_URL.GET_CUSTOMERS);
      const customers = Array.isArray(response.data) ? response.data : [];
      setData(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setData([]);
    } finally {
      setLocalLoading(false);
    }
  }, [setLocalLoading]);
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Calculate amount based on weight, rate, and loan percentage
  const calculateAmount = () => {
    const weight = form.getFieldValue("weight");
    const rate = form.getFieldValue("current_rate_per_gram");
    const loanPercent = form.getFieldValue("fixed_percent_loan");

    if (weight && rate && loanPercent) {
      const amount = (weight * rate * loanPercent) / 100;
      form.setFieldsValue({ amount: parseFloat(amount.toFixed(2)) });
      calculateGrandTotal(amount);
    }
  };

  // Calculate grand total with taxes
  const calculateGrandTotal = (amount = null) => {
    const baseAmount = amount || form.getFieldValue("amount") || 0;
    const sgstRate = 2.5; // 2.5%
    const cgstRate = 2.5; // 2.5%

    const sgst = (baseAmount * sgstRate) / 100;
    const cgst = (baseAmount * cgstRate) / 100;
    const grandTotal = baseAmount + sgst + cgst;

    form.setFieldsValue({ sgst: parseFloat(sgst.toFixed(2)) });
    form.setFieldsValue({ cgst: parseFloat(cgst.toFixed(2)) });
    form.setFieldsValue({ grand_total: parseFloat(grandTotal.toFixed(2)) });
  };

  // Calculate maturity date (6 months from pledge date)
  const handlePledgeDateChange = (date) => {
    if (date) {
      const maturityDate = date.add(6, "months");
      form.setFieldsValue({ date_of_maturity: maturityDate });
    }
  };

  // Handle customer selection
  const handleCustomerChange = (customerId) => {
    const selectedCustomer = data.find((c) => c.customer_id === customerId);
    if (selectedCustomer) {
      form.setFieldsValue({ customer_name: selectedCustomer.customer_name });
    }
  };

  // Handle file upload for images
  const handleImageUpload = ({ fileList }) => {
    setImageFileList(fileList);
  };

  // Handle file upload for Aadhar
  const handleAadharUpload = ({ fileList }) => {
    setAadharFileList(fileList);
  };

  useEffect(() => {
    if (isEdit) {
      if (!hashid) {
        message.error("Invalid customer ID");
        navigate("/admin/customers");
        return;
      }

      setFetchingData(true);
      axiosInstance
        .get(`${PLEDGE_URL.GET_PLEDGE_BY_HASHID}/${hashid}`)
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
  }, [isEdit, hashid, form, navigate]);

  const onFinish = async (values) => {};

  const uploadProps = {
    beforeUpload: () => false,
    maxCount: 1,
    accept: "image/*,.pdf",
  };

  return (
    <Spin spinning={fetchingData} tip="Loading pledge data...">
      {/* Pledge Form */}
      <Button
        type="primary"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Go Back
      </Button>
      <Card
        title={<p> Pledge {isEdit ? "Edit" : "Add"} Form</p>}
        variant="bordered"
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
          }}
        >
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
                  onChange={handleCustomerChange}
                >
                  {data.map((customer) => (
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
                <Input disabled placeholder="Auto-filled" />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">Ornament Details</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="ornament_name"
                label="Ornament Name"
                rules={[
                  { required: true, message: "Please enter ornament name" },
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
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="weight"
                label="Weight (grams)"
                rules={[{ required: true, message: "Please enter weight" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter weight"
                  min={0}
                  step={0.01}
                  onChange={calculateAmount}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="current_rate_per_gram"
                label="Rate per Gram (₹)"
                rules={[{ required: true, message: "Please enter rate" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter rate"
                  min={0}
                  step={0.01}
                  onChange={calculateAmount}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="fixed_percent_loan"
                label="Loan Percentage (%)"
                rules={[
                  { required: true, message: "Please enter loan percentage" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter percentage"
                  min={0}
                  max={100}
                  step={0.01}
                  onChange={calculateAmount}
                />
              </Form.Item>
            </Col>
          </Row>

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
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="date_of_maturity"
                label="Date of Maturity"
                rules={[
                  { required: true, message: "Please select maturity date" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="interest_rate"
                label="Interest Rate (%)"
                rules={[
                  { required: true, message: "Please enter interest rate" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter interest rate"
                  min={0}
                  max={100}
                  step={0.01}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="late_payment_interest"
                label="Late Payment Interest (%)"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter late payment interest"
                  min={0}
                  max={100}
                  step={0.01}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Financial Details</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="amount"
                label="Loan Amount (₹)"
                rules={[{ required: true, message: "Please enter amount" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Calculated automatically"
                  min={0}
                  step={0.01}
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
                  style={{ width: "100%" }}
                  placeholder="Select GST rate"
                  onChange={(value) => {
                    const gst = value / 100;
                    const cgst = gst * (12 / 5);
                    form.setFieldsValue({
                      sgst: parseFloat(gst.toFixed(2)),
                      cgst: parseFloat(cgst.toFixed(2)),
                      grand_total: parseFloat(
                        (
                          form.getFieldValue("amount") *
                          (1 + gst + cgst)
                        ).toFixed(2)
                      ),
                    });
                  }}
                >
                  <Option value={5}>5%</Option>
                  <Option value={12}>12%</Option>
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
                  step={0.01}
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
                  step={0.01}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="grand_total" label="Grand Total (₹)">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Auto-calculated"
                  disabled
                  min={0}
                  step={0.01}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Document Uploads</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="image_upload" label="Ornament Image">
                <Upload
                  {...uploadProps}
                  fileList={imageFileList}
                  onChange={handleImageUpload}
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="aadhar_upload" label="Aadhar Document">
                <Upload
                  {...uploadProps}
                  fileList={aadharFileList}
                  onChange={handleAadharUpload}
                >
                  <Button icon={<UploadOutlined />}>Upload Aadhar</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
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
