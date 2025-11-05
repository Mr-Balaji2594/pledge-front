import { useState } from "react";
import {
  Layout,
  Tabs,
  Card,
  Button,
  Input,
  Select,
  Divider,
  Space,
  Tag,
  Table,
  message,
} from "antd";
import {
  UserOutlined,
  SafetyOutlined,
  DollarOutlined,
  LockOutlined,
  FileTextOutlined,
  SaveOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Content, Header } = Layout;

const AdminSettingsProfessional = () => {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      message.error("Please fill in all password fields!");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      message.error("New password and confirm password do not match!");
      return;
    }
    if (passwords.new.length < 8) {
      message.error("Password must be at least 8 characters long!");
      return;
    }
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongRegex.test(passwords.new)) {
      message.error(
        "Password must contain uppercase, lowercase, number, and special character!"
      );
      return;
    }
    console.log("Updating password:", passwords);
    message.success("Password updated successfully");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const renderUserAccountSettings = () => (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
          Current Password
        </label>
        <Input.Password
          placeholder="Enter current password"
          value={passwords.current}
          onChange={(e) =>
            setPasswords({ ...passwords, current: e.target.value })
          }
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
          New Password
        </label>
        <Input.Password
          placeholder="Enter new password (minimum 8 characters)"
          value={passwords.new}
          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
          Confirm Password
        </label>
        <Input.Password
          placeholder="Confirm new password"
          value={passwords.confirm}
          onChange={(e) =>
            setPasswords({ ...passwords, confirm: e.target.value })
          }
        />
      </div>
      <Button
        type="primary"
        icon={<SaveOutlined />}
        onClick={handlePasswordChange}
      >
        Update Password
      </Button>
    </Card>
  );

  const renderRBACSettings = () => (
    <Card title="Role Management">
      <Table
        size="small"
        dataSource={[
          {
            key: "1",
            role: "Super Admin",
            users: 2,
            permissions: "All",
            status: "Active",
          },
          {
            key: "2",
            role: "Admin",
            users: 5,
            permissions: "Manage Users, Settings",
            status: "Active",
          },
          {
            key: "3",
            role: "Moderator",
            users: 12,
            permissions: "Review Content",
            status: "Active",
          },
          {
            key: "4",
            role: "User",
            users: 1250,
            permissions: "Basic Access",
            status: "Active",
          },
        ]}
        rowKey="key"
        columns={[
          { title: "Role", dataIndex: "role", key: "role" },
          { title: "Users", dataIndex: "users", key: "users" },
          {
            title: "Permissions",
            dataIndex: "permissions",
            key: "permissions",
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => <Tag color="green">{status}</Tag>,
          },
        ]}
        pagination={false}
      />
      <Button type="primary" icon={<PlusOutlined />} style={{ marginTop: 16 }}>
        Add New Role
      </Button>
    </Card>
  );

  const renderBillingSettings = () => (
    <>
      <Card title="Current Subscription Plan" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <strong>Plan Type</strong>
            <Tag color="blue">Professional</Tag>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <strong>Billing Cycle</strong>
            <span>Monthly - $299/month</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <strong>Renewal Date</strong>
            <span>December 5, 2025</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Status</strong>
            <Tag color="green">Active</Tag>
          </div>
        </div>
        <Divider />
        <Space>
          <Button>Upgrade Plan</Button>
          <Button>Download Invoice</Button>
          <Button danger>Cancel Subscription</Button>
        </Space>
      </Card>

      <Card title="Payment Method">
        <div style={{ marginBottom: 16 }}>
          <strong>Card Ending in 4242</strong>
          <p style={{ color: "#666", marginTop: 8 }}>Visa • Expires 12/2026</p>
        </div>
        <Button>Update Payment Method</Button>
      </Card>
    </>
  );

  const renderSecuritySettings = () => (
    <Card title="Session Management">
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
          Session Timeout (minutes)
        </label>
        <Select defaultValue="30" style={{ width: "100%" }}>
          <Select.Option value="15">15 minutes</Select.Option>
          <Select.Option value="30">30 minutes</Select.Option>
          <Select.Option value="60">1 hour</Select.Option>
          <Select.Option value="240">4 hours</Select.Option>
        </Select>
      </div>
      <Button type="primary">Save</Button>
    </Card>
  );

  const renderAuditLogs = () => (
    <Card>
      <Table
        dataSource={[
          {
            key: "1",
            action: "User Login",
            user: "admin@company.com",
            timestamp: "Nov 5, 2025 - 10:30 AM",
            ip: "192.168.1.1",
            status: "Success",
          },
          {
            key: "2",
            action: "Settings Changed",
            user: "admin@company.com",
            timestamp: "Nov 5, 2025 - 9:15 AM",
            ip: "192.168.1.1",
            status: "Success",
          },
          {
            key: "3",
            action: "User Deleted",
            user: "moderator@company.com",
            timestamp: "Nov 4, 2025 - 3:45 PM",
            ip: "203.0.113.42",
            status: "Success",
          },
          {
            key: "4",
            action: "Failed Login Attempt",
            user: "unknown",
            timestamp: "Nov 4, 2025 - 2:20 PM",
            ip: "198.51.100.5",
            status: "Failed",
          },
        ]}
        rowKey="key"
        columns={[
          { title: "Action", dataIndex: "action", key: "action" },
          { title: "User", dataIndex: "user", key: "user" },
          { title: "Timestamp", dataIndex: "timestamp", key: "timestamp" },
          { title: "IP Address", dataIndex: "ip", key: "ip" },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
              <Tag color={status === "Success" ? "green" : "red"}>{status}</Tag>
            ),
          },
        ]}
        scroll={{ x: 800 }}
      />
    </Card>
  );

  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <UserOutlined />
          User & Account
        </span>
      ),
      children: renderUserAccountSettings(),
    },
    {
      key: "2",
      label: (
        <span>
          <SafetyOutlined />
          Role & Permissions
        </span>
      ),
      children: renderRBACSettings(),
    },
    {
      key: "3",
      label: (
        <span>
          <DollarOutlined />
          Billing & Plans
        </span>
      ),
      children: renderBillingSettings(),
    },
    {
      key: "4",
      label: (
        <span>
          <LockOutlined />
          Security
        </span>
      ),
      children: renderSecuritySettings(),
    },
    {
      key: "5",
      label: (
        <span>
          <FileTextOutlined />
          Audit & Logs
        </span>
      ),
      children: renderAuditLogs(),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          paddingLeft: 32,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 600, color: "#1890ff" }}>
          ⚙️ All Settings
        </div>
      </Header>
      <Content style={{ padding: "32px", maxWidth: 1200 }}>
        <Tabs items={tabItems} />
      </Content>
    </Layout>
  );
};

export default AdminSettingsProfessional;