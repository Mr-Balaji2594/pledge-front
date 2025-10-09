import { useEffect, useState } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import { useNavigate, Link } from "react-router-dom";
import {
  DashboardOutlined,
  UsergroupAddOutlined,
  SettingOutlined,
  FileTextOutlined,
  LogoutOutlined,
  HomeOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { AppLogo } from "../services/ImageServices";
const { Content, Footer, Sider } = Layout;
import { useSiteContext } from "../context/SiteDarkProvider";

const AdminLayout = ({ children }) => {
  const { logout } = useSiteContext();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const navigate = useNavigate();

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    { key: "customers", label: "Customers", icon: <UsergroupAddOutlined /> },
    { key: "pledges", label: "Pledges", icon: <FileTextOutlined /> },
    { key: "return", label: "Return", icon: <RollbackOutlined /> },
    { key: "settings", label: "Settings", icon: <SettingOutlined /> },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => logout(),
    },
  ];

  const siderStyle = {
    overflow: "auto",
    height: "100vh",
    position: "sticky",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
  };

  useEffect(() => {
    const currentPath = window.location.pathname.split("/").pop();
    setSelectedKey(currentPath || "dashboard");
  }, []);

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
    navigate(`/admin/${key}`);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        breakpoint="md"
        style={siderStyle}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        // collapsedWidth={0}
      >
        <div
          className="logo"
          style={{ textAlign: "center", padding: "16px", width: "100%" }}
        >
          <img
            src={AppLogo}
            alt="App Logo"
            style={{ maxHeight: "64px", width: "100%", objectFit: "contain" }}
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        <Content style={{ margin: "16px" }}>
          <Breadcrumb
            style={{ marginBottom: 16 }}
            items={[
              {
                title: (
                  <>
                    <Link to="/admin/dashboard">
                      <HomeOutlined />
                    </Link>
                  </>
                ),
              },
              {
                title: (
                  <>
                    {menuItems.find((item) => item.key === selectedKey)?.icon}
                    <span style={{ marginLeft: 8 }}>
                      <Link to={`/admin/${selectedKey}`}>
                        {selectedKey.charAt(0).toUpperCase() +
                          selectedKey.slice(1)}
                      </Link>
                    </span>
                  </>
                ),
              },
            ]}
          />

          <div
            style={{
              padding: 24,
              background: "#fff",
              minHeight: 450,
            }}
          >
            {children || <p>Select a menu item to see content</p>}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Copyright © 2025 Created by Dev2Guru Enterprises
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
