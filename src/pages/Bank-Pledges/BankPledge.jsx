import axiosInstance from "../../services/ApiServices";
import { useEffect, useState } from "react";
import {
  message,
  Button,
  Row,
  Col,
  Spin,
  Input,
  Form,
  Divider,
  Space,
} from "antd";
import { BANK_PLEDGE_URL } from "../../api/CommonApi";
import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";

const BankPledge = () => {
  const [pledge, setPledge] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [loanIdInput, setLoanIdInput] = useState("");

  const fetchBankPledge = async (loanId) => {
    if (loanId && loanId.length === 7) {
      setFetchingData(true);
      try {
        const response = await axiosInstance.get(
          `${BANK_PLEDGE_URL.GET_PLEDGE_LOANID}/${loanId}`
        );
        setPledge(response.data.pledge);
      } catch (error) {
        console.error("Error fetching bank pledge:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error === "PLEDGE NOT FOUND"
        ) {
          message.warning("Pledge not found for the given Loan ID.");
          setPledge(null);
        } else {
          message.error(
            error.response?.data?.message ||
              "Failed to fetch bank pledge. Please try again."
          );
        }
        setPledge(null);
      } finally {
        setFetchingData(false);
      }
    } else {
      setPledge(null);
    }
  };
  useEffect(() => {
    fetchBankPledge(loanIdInput);
  }, [loanIdInput]);

  const handleSearch = () => {
    fetchBankPledge(loanIdInput);
  };

  return (
    <>
      <div className="pledge-view-container">
        <Spin spinning={fetchingData} tip="Loading pledge data...">
          <div className="pledge-view-card">
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={16}>
                <Input
                  placeholder="Enter Loan ID"
                  value={loanIdInput}
                  onChange={(e) => setLoanIdInput(e.target.value)}
                  onPressEnter={handleSearch}
                  maxLength={7}
                  style={{ textTransform: "uppercase" }}
                />
              </Col>
              <Col span={8}>
                <Space>
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                  <Button onClick={() => setLoanIdInput("")}>Clear</Button>
                </Space>
              </Col>
            </Row>
            <div>
              {pledge ? (
                <Form layout="vertical" initialValues={pledge}>
                  <Divider orientation="left">Customer Information</Divider>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Customer ID" name="customer_id">
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Customer Name" name="customer_name">
                        <Input disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Divider orientation="left">Ornament Details</Divider>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Ornament Name" name="ornament_name">
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Ornament Nature" name="ornament_nature">
                        <Input disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item label="Weight (grams)" name="weight">
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Rate per Gram (₹)"
                        name="current_rate_per_gram"
                      >
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Loan Percentage (%)"
                        name="fixed_percent_loan"
                      >
                        <Input disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Divider orientation="left">Loan Details</Divider>
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item label="Date of Pledge" name="date_of_pledge">
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Loan Amount (₹)">
                        <Input value={pledge.loan_amount} disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              ) : (
                !fetchingData && (
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: 50,
                      color: "#888",
                    }}
                  >
                    <InfoCircleOutlined
                      style={{ fontSize: "24px", marginBottom: "10px" }}
                    />
                    <p style={{ fontSize: "16px" }}>
                      No pledge data to display. Please enter a valid Loan ID.
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </Spin>
      </div>
    </>
  );
};

export default BankPledge;
