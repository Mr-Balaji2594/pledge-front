import React, { useState, useEffect } from "react";
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

const { Option } = Select;

const PledgeForm = ({ pledgeId = null, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [imageFileList, setImageFileList] = useState([]);
  const [aadharFileList, setAadharFileList] = useState([]);

  // Fetch customers for dropdown
  useEffect(() => {
    fetchCustomers();
    if (pledgeId) {
      fetchPledgeData(pledgeId);
    }
  }, [pledgeId]);

  const fetchCustomers = async () => {
    try {
      // Replace with your actual API call
      // const response = await axiosInstance.get('/api/customers');
      // setCustomers(response.data);

      // Mock data for demonstration
      setCustomers([
        { customer_id: 1, customer_name: "John Doe" },
        { customer_id: 2, customer_name: "Jane Smith" },
      ]);
    } catch (error) {
      message.error("Failed to fetch customers");
    }
  };

  const fetchPledgeData = async (id) => {
    setLoading(true);
    try {
      // Replace with your actual API call
      // const response = await axiosInstance.get(`/api/pledges/${id}`);
      // const data = response.data;

      // Mock data for demonstration
      const data = {
        customer_id: 1,
        customer_name: "John Doe",
        loan_id: "LOAN001",
        ornament_name: "Gold Necklace",
        ornament_nature: "Gold",
        date_of_pledge: "2025-01-15",
        current_rate_per_gram: 6000,
        weight: 50,
        fixed_percent_loan: 75,
        interest_rate: 12,
        date_of_maturity: "2025-07-15",
        late_payment_interest: 2,
        amount: 225000,
        sgst: 11250,
        cgst: 11250,
        grand_total: 247500,
      };

      form.setFieldsValue({
        ...data,
        date_of_pledge: data.date_of_pledge ? dayjs(data.date_of_pledge) : null,
        date_of_maturity: data.date_of_maturity
          ? dayjs(data.date_of_maturity)
          : null,
      });
    } catch (error) {
      message.error("Failed to fetch pledge data");
    } finally {
      setLoading(false);
    }
  };

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

    form.setFieldsValues({
      sgst: parseFloat(sgst.toFixed(2)),
      cgst: parseFloat(cgst.toFixed(2)),
      grand_total: parseFloat(grandTotal.toFixed(2)),
    });
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
    const selectedCustomer = customers.find(
      (c) => c.customer_id === customerId
    );
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

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const formData = new FormData();

      // Append all form fields
      Object.keys(values).forEach((key) => {
        if (key === "date_of_pledge" || key === "date_of_maturity") {
          formData.append(
            key,
            values[key] ? values[key].format("YYYY-MM-DD") : ""
          );
        } else if (values[key] !== null && values[key] !== undefined) {
          formData.append(key, values[key]);
        }
      });

      // Append files
      if (imageFileList.length > 0 && imageFileList[0].originFileObj) {
        formData.append("image_upload", imageFileList[0].originFileObj);
      }
      if (aadharFileList.length > 0 && aadharFileList[0].originFileObj) {
        formData.append("aadhar_upload", aadharFileList[0].originFileObj);
      }

      // Replace with your actual API call
      // if (pledgeId) {
      //   await axiosInstance.post(`/api/pledges/${pledgeId}`, formData, {
      //     headers: { 'Content-Type': 'multipart/form-data' }
      //   });
      // } else {
      //   await axiosInstance.post('/api/pledges', formData, {
      //     headers: { 'Content-Type': 'multipart/form-data' }
      //   });
      // }

      message.success(
        `Pledge ${pledgeId ? "updated" : "created"} successfully!`
      );
      // form.resetFields();
      console.log("Submitted data:", values);
      if (onSuccess) onSuccess();
    } catch (error) {
      message.error(`Failed to ${pledgeId ? "update" : "create"} pledge`);
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const uploadProps = {
    beforeUpload: () => false, // Prevent auto upload
    maxCount: 1,
    accept: "image/*,.pdf",
  };

  return (
    <Spin spinning={loading} tip="Loading pledge data...">
      <Card
        title={pledgeId ? "Edit Pledge" : "Create New Pledge"}
        bordered={false}
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
                <Input disabled placeholder="Auto-filled" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="loan_id"
                label="Loan ID"
                rules={[{ required: true, message: "Please enter loan ID" }]}
              >
                <Input placeholder="Enter Loan ID" />
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
                  onChange={() => calculateGrandTotal()}
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
                  onChange={() => calculateGrandTotal()}
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
                  onChange={() => calculateGrandTotal()}
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
              loading={submitting}
              icon={<SaveOutlined />}
              size="large"
            >
              {pledgeId ? "Update Pledge" : "Create Pledge"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default PledgeForm;
