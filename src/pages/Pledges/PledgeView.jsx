import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/ApiServices";
import { useEffect, useState } from "react";
import { message, Button, Row, Col, Card, Divider, Spin, Image } from "antd";
import { PLEDGE_URL } from "../../api/CommonApi";
import dayjs from "dayjs";
import { ArrowLeftOutlined } from "@ant-design/icons";

const PledgeView = () => {
  const { hashid } = useParams();
  const navigate = useNavigate();
  const [pledge, setPledge] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    if (!hashid) return;
    const fetchPledge = async () => {
      setFetchingData(true);
      try {
        const response = await axiosInstance.get(
          `${PLEDGE_URL.GET_PLEDGE_BY_HASHID}/${hashid}`
        );
        setPledge(response.data);
      } catch (error) {
        console.error("Error fetching pledge:", error);
        message.error("Failed to fetch pledge. Please try again.");
      } finally {
        setFetchingData(false);
      }
    };
    fetchPledge();
  }, [hashid, navigate]);

  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
    return `₹${parseFloat(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <>
      <div className="pledge-view-container">
        <Spin spinning={fetchingData} tip="Loading pledge data...">
          <div className="pledge-view-card">
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="go-back-btn"
              style={{ marginBottom: 16 }}
            >
              Go Back
            </Button>
            {pledge && (
              <Card
                title={`Pledge: ${pledge.ornament_name} - Loan ID: ${pledge.loan_id}`}
                bordered={false}
              >
                {/* Ornament Image */}
                {pledge.image_upload && (
                  <div style={{ marginBottom: 24, textAlign: "center" }}>
                    <Image
                      width={200}
                      src={pledge.image_upload}
                      alt={pledge.ornament_name}
                      style={{ borderRadius: 8 }}
                    />
                  </div>
                )}

                <Divider orientation="left">Customer Information</Divider>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <p>
                      <strong>Customer ID:</strong> {pledge.customer_id}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      <strong>Customer Name:</strong> {pledge.customer_name}
                    </p>
                  </Col>
                </Row>

                <Divider orientation="left">Ornament Details</Divider>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <p>
                      <strong>Ornament Name:</strong> {pledge.ornament_name}
                    </p>
                    <p>
                      <strong>Ornament Nature:</strong>{" "}
                      {pledge.ornament_nature || "N/A"}
                    </p>
                    <p>
                      <strong>Weight:</strong> {pledge.weight || "N/A"} grams
                    </p>
                    <p>
                      <strong>Current Rate per Gram:</strong>{" "}
                      {formatCurrency(pledge.current_rate_per_gram)}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      <strong>Date of Pledge:</strong>{" "}
                      {pledge.date_of_pledge
                        ? dayjs(pledge.date_of_pledge).format("DD-MM-YYYY")
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Date of Maturity:</strong>{" "}
                      {pledge.date_of_maturity
                        ? dayjs(pledge.date_of_maturity).format("DD-MM-YYYY")
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {pledge.created_at
                        ? dayjs(pledge.created_at).format("DD-MM-YYYY HH:mm:ss")
                        : "N/A"}
                    </p>
                  </Col>
                </Row>

                <Divider orientation="left">Financial Details</Divider>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <p>
                      <strong>Amount:</strong> {formatCurrency(pledge.amount)}
                    </p>
                    <p>
                      <strong>Fixed Percent Loan:</strong>{" "}
                      {pledge.fixed_percent_loan || "N/A"}%
                    </p>
                    <p>
                      <strong>Interest Rate:</strong>{" "}
                      {pledge.interest_rate || "N/A"}%
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      <strong>Late Payment Interest:</strong>{" "}
                      {pledge.late_payment_interest || "N/A"}%
                    </p>
                    <p>
                      <strong>SGST:</strong> {formatCurrency(pledge.sgst)}
                    </p>
                    <p>
                      <strong>CGST:</strong> {formatCurrency(pledge.cgst)}
                    </p>
                    <p style={{ fontSize: "16px", color: "#1890ff" }}>
                      <strong>Grand Total:</strong>{" "}
                      {formatCurrency(pledge.grand_total)}
                    </p>
                  </Col>
                </Row>

                <Divider orientation="left">Uploaded Documents</Divider>
                <Row gutter={[16, 16]}>
                  {pledge.image_upload && (
                    <Col span={12}>
                      <p>
                        <strong>Ornament Image:</strong>
                      </p>
                      <Image
                        width="100%"
                        src={pledge.image_upload}
                        alt="Ornament"
                        style={{ borderRadius: 8 }}
                      />
                    </Col>
                  )}
                  {pledge.aadhar_upload && (
                    <Col span={12}>
                      <p>
                        <strong>Aadhar Document:</strong>
                      </p>
                      <Image
                        width="100%"
                        src={pledge.aadhar_upload}
                        alt="Aadhar"
                        style={{ borderRadius: 8 }}
                      />
                    </Col>
                  )}
                </Row>
              </Card>
            )}
          </div>
        </Spin>
      </div>
    </>
  );
};

export default PledgeView;
