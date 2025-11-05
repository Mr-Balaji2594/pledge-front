import { useState } from "react";
import { Menu, Card, Input, Select, Button, Table, Tag, Row, Col } from "antd";
import {
  DollarOutlined,
  UserOutlined,
  BankOutlined,
  CalendarOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const CustomerTransactions = () => {
  const [activeModule, setActiveModule] = useState("customer");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  // ---- Cards Component (Removed Tailwind) ----
  const StatCard = ({ icon, label, value }) => (
    <Card style={{ boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }}>
      <Row justify="space-between" align="middle">
        <Col>
          <p style={{ color: "#888", margin: 0 }}>{label}</p>
          <h2 style={{ marginTop: 6 }}>{value}</h2>
        </Col>
        <Col>{icon}</Col>
      </Row>
    </Card>
  );

  // const getFilteredTransactions = (transactions) => {
  //   return transactions.filter((t) => {
  //     const matchesSearch =
  //       t.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       t.bank?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       t.reference?.toLowerCase().includes(searchTerm.toLowerCase());

  //     const matchesFilter = filterStatus === "all" || t.status === filterStatus;

  //     return matchesSearch && matchesFilter;
  //   });
  // };

  const TransactionTable = ({ type }) => {
    // const filteredTransactions = getFilteredTransactions(transactions);

    const columns = [
      { title: "ID", dataIndex: "id" },
      { title: "Date", dataIndex: "date" },
      {
        title: type === "customer" ? "Customer" : "Bank",
        dataIndex: type === "customer" ? "customer" : "bank",
      },
      {
        title: "Type",
        dataIndex: "type",
        render: (text) => (
          <Tag color={text === "receipt" ? "green" : "red"}>
            {text === "receipt" ? "Receipt" : "Payment"}
          </Tag>
        ),
      },
      {
        title: "Amount",
        dataIndex: "amount",
        render: (text) => `₹${text.toLocaleString()}`,
      },
      { title: "Reference", dataIndex: "reference" },
      {
        title: "Status",
        dataIndex: "status",
        render: (text) => (
          <Tag color={text === "completed" ? "blue" : "orange"}>{text}</Tag>
        ),
      },
      {
        title: "Actions",
        render: () => (
          <Row gutter={6}>
            <Col>
              <Button type="link" icon={<EyeOutlined />} />
            </Col>
            <Col>
              <Button type="link" icon={<EditOutlined />} />
            </Col>
            <Col>
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Col>
          </Row>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        // dataSource={filteredTransactions}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    );
  };

  return (
    <>
      {/* Top Navigation Menu */}
      <Menu
        mode="horizontal"
        selectedKeys={[activeModule]}
        onClick={({ key }) => setActiveModule(key)}
        style={{ marginBottom: 20 }}
      >
        <Menu.Item key="customer" icon={<UserOutlined />}>
          Customer Receipts & Payments
        </Menu.Item>
        <Menu.Item key="bank" icon={<BankOutlined />}>
          Bank Receipts & Payments
        </Menu.Item>
      </Menu>

      {/* Dashboard Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {(activeModule.includes("customer")
          ? [
              <StatCard
                icon={<DollarOutlined />}
                label="Total Receipts"
                // value={`₹${calculateTotals(
                //   // customerTransactions,
                //   "receipt"
                // ).toLocaleString()}`}
              />,
              <StatCard
                icon={<DollarOutlined />}
                label="Total Payments"
                // value={`₹${calculateTotals(
                //   // customerTransactions,
                //   "payment"
                // ).toLocaleString()}`}
              />,
              <StatCard
                icon={<UserOutlined />}
                label="Total Customers"
                // value={
                //   new Set(customerTransactions.map((t) => t.customer)).size
                // }
              />,
              <StatCard
                icon={<CalendarOutlined />}
                label="This Month"
                // value={customerTransactions.length}
              />,
            ]
          : [
              <StatCard
                icon={<DollarOutlined />}
                label="Total Receipts"
                // value={`₹${calculateTotals(
                //   // bankTransactions,
                //   "receipt"
                // ).toLocaleString()}`}
              />,
              <StatCard
                icon={<DollarOutlined />}
                label="Total Payments"
                // value={`₹${calculateTotals(
                //   // bankTransactions,
                //   "payment"
                // ).toLocaleString()}`}
              />,
              <StatCard
                icon={<BankOutlined />}
                label="Total Banks"
                // value={new Set(bankTransactions.map((t) => t.bank)).size}
              />,
              <StatCard
                icon={<CalendarOutlined />}
                label="This Month"
                // value={bankTransactions.length}
              />,
            ]
        ).map((card, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            {card}
          </Col>
        ))}
      </Row>

      {/* Search + Filter + New Transaction */}
      <Card style={{ marginBottom: 20 }}>
        <Row justify="space-between" align="middle" gutter={12}>
          <Col>
            <Input
              placeholder="Search transactions..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
            />
          </Col>
          <Col>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 150 }}
            >
              <Select.Option value="all">All Status</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
            </Select>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                navigate("/admin/transactions/add", { state: { activeModule } })
              }
            >
              New Transaction
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Tables */}
      {activeModule === "customer" && (
        <TransactionTable
          // transactions={customerTransactions.filter(
          //   (t) => t.type === "receipt"
          // )}
          type="customer"
        />
      )}

      {activeModule === "bank" && (
        <TransactionTable
          // transactions={bankTransactions.filter((t) => t.type === "receipt")}
          type="bank"
        />
      )}
    </>
  );
};

export default CustomerTransactions;
