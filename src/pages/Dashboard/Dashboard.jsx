import React from "react";
import { Row, Col, Card, Statistic, Table } from "antd";
import { Line, Pie, Bar } from "@ant-design/plots";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const Dashboard = () => {
  // --- 1️⃣ Summary Stats ---
  const summary = [
    { title: "Total Pledges", value: 120, color: "#1890ff" },
    { title: "Active Pledges", value: 85, color: "#52c41a" },
    { title: "Overdue Pledges", value: 10, color: "#ff4d4f" },
    { title: "Interest Collected", value: "₹1,24,000", color: "#faad14" },
  ];

  // --- 2️⃣ Chart Data ---
  const interestData = [
    { month: "Jan", value: 5000 },
    { month: "Feb", value: 8000 },
    { month: "Mar", value: 7600 },
    { month: "Apr", value: 9100 },
    { month: "May", value: 8300 },
    { month: "Jun", value: 12000 },
  ];

  const statusData = [
    { type: "Active", value: 85 },
    { type: "Closed", value: 25 },
    { type: "Overdue", value: 10 },
  ];

  const topPledges = [
    { name: "Ravi Kumar", amount: 50000 },
    { name: "Anita Devi", amount: 42000 },
    { name: "Suresh", amount: 39000 },
    { name: "Kumaravel", amount: 37000 },
    { name: "Lakshmi", amount: 35000 },
  ];

  // --- 3️⃣ Table (Recent Dues) ---
  const columns = [
    { title: "Customer", dataIndex: "name" },
    { title: "Due Date", dataIndex: "due" },
    { title: "Amount", dataIndex: "amount" },
    { title: "Status", dataIndex: "status" },
  ];

  const dues = [
    {
      name: "Anita Devi",
      due: "2025-10-15",
      amount: "₹8,000",
      status: "Pending",
    },
    {
      name: "Ravi Kumar",
      due: "2025-10-17",
      amount: "₹12,000",
      status: "Paid",
    },
    { name: "Lakshmi", due: "2025-10-20", amount: "₹7,500", status: "Pending" },
  ];

  // --- 4️⃣ Chart Configs ---
  const lineConfig = {
    data: interestData,
    xField: "month",
    yField: "value",
    smooth: true,
    color: "#1890ff",
    point: { size: 4, shape: "circle" },
  };

  const pieConfig = {
    data: statusData,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: { type: "inner", content: "{value}", style: { fontSize: 14 } },
    interactions: [{ type: "element-active" }],
  };

  const barConfig = {
    data: topPledges,
    xField: "amount",
    yField: "name",
    seriesField: "name",
    legend: false,
    color: "#722ed1",
  };

  // --- 5️⃣ Layout ---
  return (
    <div style={{ padding: 20 }}>
      {/* Summary Cards */}
      <Row gutter={16}>
        {summary.map((item, index) => (
          <Col span={6} key={index}>
            <Card bordered={false}>
              <Statistic
                title={item.title}
                value={item.value}
                valueStyle={{ color: item.color }}
                prefix={item.title === "Interest Collected" ? "💰" : ""}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Monthly Interest Trend">
            <Line {...lineConfig} />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Pledge Status Overview">
            <Pie {...pieConfig} />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Top Valued Pledges">
            <Bar {...barConfig} />
          </Card>
        </Col>
      </Row>

      {/* Recent Dues Table */}
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Recent Due Payments">
            <Table dataSource={dues} columns={columns} pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
