import { useEffect, useCallback, useState } from "react";
import { Table, Input, Button, Flex, message, Space, Popconfirm } from "antd";
import axiosInstance from "../../services/ApiServices";
import { CUSTOMER_URL } from "../../api/CommonApi";
import {
  UsergroupAddOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const CustomerList = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLocalLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCustomers = useCallback(async () => {
    setLocalLoading(true);
    try {
      const response = await axiosInstance.get(CUSTOMER_URL.GET_CUSTOMERS);
      const customers = Array.isArray(response.data) ? response.data : [];
      setData(customers);
      setFilteredData(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setData([]);
      setFilteredData([]);
    } finally {
      setLocalLoading(false);
    }
  }, [setLocalLoading]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Global search function
  const handleSearch = (value) => {
    const filtered = data.filter(
      (item) =>
        item.customer_name?.toLowerCase().includes(value.toLowerCase()) ||
        item.email_id?.toLowerCase().includes(value.toLowerCase()) ||
        item.mobile_no?.toString().includes(value)
    );
    setFilteredData(filtered);
  };

  const columns = [
    // { title: "Customer ID", dataIndex: "customer_id", key: "customer_id" },
    { title: "#", key: "index", render: (text, record, index) => index + 1 },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
      sorter: (a, b) => a.customer_name.localeCompare(b.customer_name),
    },
    { title: "Mobile No", dataIndex: "mobile_no", key: "mobile_no" },
    {
      title: "City",
      dataIndex: "area",
      key: "area",
      filters: Array.from(new Set(data.map((c) => c.area))).map((d) => ({
        text: d,
        value: d,
      })),
      onFilter: (value, record) => record.area === value,
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
      filters: Array.from(new Set(data.map((c) => c.district))).map((d) => ({
        text: d,
        value: d,
      })),
      onFilter: (value, record) => record.district === value,
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 100,
      render: (record) => (
        <Space.Compact size="middle">
          <Button.Group>
            <Button
              size="small"
              style={{
                marginLeft: 8,
                backgroundColor: "#52c41a",
                color: "#ffffff",
              }}
              icon={<EyeOutlined />}
              onClick={() => handleView(record.uuid)}
            />
            <Popconfirm
              title="Are you sure you want to delete this customer?"
              onConfirm={() => handleDelete(record.customer_id)}
              okText="Yes"
              cancelText="No"
              placement="topRight"
            >
              <Button
                size="small"
                danger
                style={{ marginLeft: 8 }}
                type="primary"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
            <Button
              size="small"
              style={{
                marginLeft: 8,
                color: "#ffffffff",
                backgroundColor: "#1890ff",
              }}
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.uuid)}
            />
          </Button.Group>
        </Space.Compact>
      ),
    },
  ];

  const handleDelete = async (customerId) => {
    try {
      const res = await axiosInstance.delete(
        `${CUSTOMER_URL.DELETE_CUSTOMER}/${customerId}`
      );
      if (res) {
        message.success(res.data.message || "Customer deleted successfully");
        fetchCustomers();
      } else {
        message.error("Failed to delete customer");
      }
    } catch (error) {
      console.error("Error in deleting customer:", error);
      message.error("Failed to delete customer");
    }
  };

  const handleEdit = (customerId) => {
    navigate(`/admin/customers/edit/${customerId}`);
  };

  const handleView = (customerId) => {
    navigate(`/admin/customers/view/${customerId}`);
  };

  return (
    <>
      <Flex justify="space-between">
        <Search
          placeholder="Search by name, email, or mobile"
          allowClear
          enterButton="Search"
          size="medium"
          onSearch={handleSearch}
          style={{ marginBottom: 16, width: 400 }}
        />
        <Button
          onClick={() => navigate("/admin/customers/add")}
          type="primary"
          icon={<UsergroupAddOutlined />}
        >
          Add Customer
        </Button>
      </Flex>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="customer_id"
        loading={loading}
        bordered
        pagination={{ pageSize: 10, showSizeChanger: true }}
        locale={{ emptyText: "No customers found." }}
        size="small"
      />
    </>
  );
};

export default CustomerList;
