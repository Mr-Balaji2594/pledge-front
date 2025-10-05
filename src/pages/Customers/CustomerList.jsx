import { useEffect, useCallback, useState } from "react";
import {
  Table,
  Input,
  Button,
  Flex,
  Modal,
  message,
  Space,
  Popconfirm,
} from "antd";
import axiosInstance from "../../services/ApiServices";
import { CUSTOMER_URL } from "../../api/CommonApi";
import { UsergroupAddOutlined } from "@ant-design/icons";
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
    { title: "Customer ID", dataIndex: "customer_id", key: "customer_id" },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
      sorter: (a, b) => a.customer_name.localeCompare(b.customer_name),
    },
    { title: "Mobile No", dataIndex: "mobile_no", key: "mobile_no" },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      filters: Array.from(new Set(data.map((c) => c.state))).map((s) => ({
        text: s,
        value: s,
      })),
      onFilter: (value, record) => record.state === value,
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
        <Space size="middle">
          <Popconfirm
            title="Are you sure you want to delete this customer?"
            onConfirm={() => handleDelete(record.customer_id)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            <Button danger type="primary">
              Delete
            </Button>
          </Popconfirm>
          <Button type="primary" onClick={() => handleEdit(record.uuid)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];
  const handleDelete = async (customerId) => {
    try {
      const res = await axiosInstance.delete(
        `${CUSTOMER_URL.DELETE_CUSTOMER}/${customerId}`
      );
      if (res) {
        message.success("Customer deleted successfully");
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

  return (
    <>
      <Modal title="Customer Details" footer={null} onCancel={() => {}}>
        {/* Modal content can be added here */}
      </Modal>
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
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {Object.entries(record).map(([key, value]) =>
                key !== "customer_id" &&
                key !== "customer_name" &&
                key !== "email_id" &&
                key !== "mobile_no" &&
                key !== "state" &&
                key !== "district" ? (
                  <p key={`${key}-${value}`} style={{ margin: 0 }}>
                    {`${key}: ${value}`}
                  </p>
                ) : null
              )}
            </div>
          ),
        }}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        locale={{ emptyText: "No customers found." }}
      />
    </>
  );
};

export default CustomerList;
