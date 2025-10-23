import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/ApiServices";
import { useEffect, useState } from "react";
import { message, Button, Row, Col, Card, Divider, Spin, Image } from "antd";
import { CUSTOMER_URL } from "../../api/CommonApi";
import dayjs from "dayjs";
import { ArrowLeftOutlined } from "@ant-design/icons";

const CustomerView = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    if (!uuid) return;
    const fetchCustomer = async () => {
      setFetchingData(true);
      try {
        const response = await axiosInstance.get(
          `${CUSTOMER_URL.GET_CUSTOMER_BY_UUID}/${uuid}`
        );
        setCustomer(response.data);
      } catch (error) {
        console.error("Error fetching customer:", error);
        message.error("Failed to fetch customer. Please try again.");
      } finally {
        setFetchingData(false);
      }
    };
    fetchCustomer();
  }, [uuid, navigate]);

  return (
    <>
      <div className="customer-view-container">
        <Spin spinning={fetchingData} tip="Loading customer data...">
          <div className="customer-view-card">
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="go-back-btn"
              style={{ marginBottom: 16 }}
            >
              Go Back
            </Button>
            {customer && (
              <Card
                title={`Customer: ${customer.customer_name}`}
                bordered={false}
              >
                <Divider orientation="left">Personal Information</Divider>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    {customer.customer_image_url && (
                      <div>
                        <Image
                          width={150}
                          src={customer.customer_image_url}
                          alt={customer.customer_name}
                          style={{ borderRadius: 8 }}
                        />
                      </div>
                    )}
                  </Col>
                  <Col span={8}>
                    <p>
                      <strong>Customer Name:</strong> {customer.customer_name}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong>{" "}
                      {customer.dob
                        ? dayjs(customer.dob).format("DD-MM-YYYY")
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Mobile No:</strong> {customer.mobile_no || "N/A"}
                    </p>
                  </Col>
                  <Col span={8}>
                    <p>
                      <strong>Email ID:</strong> {customer.email_id || "N/A"}
                    </p>
                    <p>
                      <strong>PAN No:</strong>{" "}
                      {customer.pan_no ? customer.pan_no.toUpperCase() : "N/A"}
                    </p>
                    <p>
                      <strong>Aadhar No:</strong> {customer.aadhar_no || "N/A"}
                    </p>
                    <p>
                      <strong>GST No:</strong>{" "}
                      {customer.gst_no ? customer.gst_no.toUpperCase() : "N/A"}
                    </p>
                  </Col>
                </Row>

                <Divider orientation="left">Address Details</Divider>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <p>
                      <strong>Door/Street:</strong>{" "}
                      {customer.door_street || "N/A"}
                    </p>
                    <p>
                      <strong>Area:</strong> {customer.area || "N/A"}
                    </p>
                    <p>
                      <strong>Taluk:</strong> {customer.taluk || "N/A"}
                    </p>
                    <p>
                      <strong>District:</strong> {customer.district || "N/A"}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      <strong>State:</strong> {customer.state || "N/A"}
                    </p>
                    <p>
                      <strong>Pincode:</strong> {customer.pincode || "N/A"}
                    </p>
                    <p>
                      <strong>Full Address:</strong> {customer.address || "N/A"}
                    </p>
                  </Col>
                </Row>

                <Divider orientation="left">Bank Details</Divider>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <p>
                      <strong>Bank Name:</strong> {customer.bank_name || "N/A"}
                    </p>
                    <p>
                      <strong>Account No:</strong>{" "}
                      {customer.account_no || "N/A"}
                    </p>
                    <p>
                      <strong>IFSC Code:</strong> {customer.ifsc_code || "N/A"}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      <strong>MICR Code:</strong> {customer.micr_code || "N/A"}
                    </p>
                    <p>
                      <strong>Branch:</strong> {customer.branch || "N/A"}
                    </p>
                  </Col>
                </Row>
              </Card>
            )}
          </div>
        </Spin>
      </div>
    </>
  );
};

export default CustomerView;
