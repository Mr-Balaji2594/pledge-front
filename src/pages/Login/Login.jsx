import { Form, Input, Button, Card, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/ApiServices";
import { AUTH_URL } from "../../api/CommonApi";
import { useState } from "react";
import { useSiteContext } from "../../context/SiteDarkProvider";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { jwtLogin, login } = useSiteContext();
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(AUTH_URL.LOGIN, values);
      const token = response.data.access_token;
      if (token) {
        message.success(`Welcome ${values.email}`);
        navigate("/admin/dashboard");
        setLoading(false);
        jwtLogin(token);
        login(token)
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Please correct the errors and try again!");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Card title="Login" style={{ width: 350 }}>
        <Form
          name="loginForm"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
