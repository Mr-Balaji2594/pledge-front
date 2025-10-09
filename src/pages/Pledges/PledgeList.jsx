import { useEffect, useCallback, useState } from "react";
import { Table, Input, Button, Flex, message, Space, Popconfirm } from "antd";
import axiosInstance from "../../services/ApiServices";
import { PLEDGE_URL } from "../../api/CommonApi";
import {
  FileAddOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const PledgeList = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLocalLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPledges = useCallback(async () => {
    setLocalLoading(true);
    try {
      const response = await axiosInstance.get(PLEDGE_URL.GET_PLEDGES);
      const pledges = Array.isArray(response.data) ? response.data : [];
      setData(pledges);
      setFilteredData(pledges);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setData([]);
      setFilteredData([]);
    } finally {
      setLocalLoading(false);
    }
  }, [setLocalLoading]);

  useEffect(() => {
    fetchPledges();
  }, [fetchPledges]);

  // Global search function
  const handleSearch = (value) => {
    const filtered = data.filter(
      (item) =>
        item.customer_name?.toLowerCase().includes(value.toLowerCase()) ||
        item.pledge_id?.toString().includes(value) ||
        item.mobile_no?.toString().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleDelete = async (pledgeId) => {
    try {
      const res = await axiosInstance.delete(
        `${PLEDGE_URL.DELETE_PLEDGE}/${pledgeId}`
      );
      if (res) {
        message.success(res.data.message || "Pledge deleted successfully");
        fetchPledges();
      } else {
        message.error("Failed to delete pledge");
      }
    } catch (error) {
      console.error("Error in deleting pledge:", error);
      message.error("Failed to delete pledge");
    }
  };

  const handleEdit = (pledgeId) => {
    navigate(`/admin/pledges/edit/${pledgeId}`);
  };

  const handleView = (pledgeId) => {
    navigate(`/admin/pledges/view/${pledgeId}`);
  };

  const columns = [
    { title: "Customer ID", dataIndex: "customer_id", key: "customer_id" },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
      sorter: (a, b) => a.customer_name.localeCompare(b.customer_name),
    },
    {
      title: "Ornament Name",
      dataIndex: "ornament_name",
      key: "ornament_name",
      sorter: (a, b) => a.ornament_name.localeCompare(b.ornament_name),
    },
    {
      title: "Date of Pledge",
      dataIndex: "date_of_pledge",
      key: "date_of_pledge",
      render: (text) => new Date(text).toLocaleDateString(),
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
              title="Are you sure you want to delete this pledge?"
              onConfirm={() => handleDelete(record.pledge_id)}
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
              onClick={() => handleEdit(record.pledge_id)}
            />
          </Button.Group>
        </Space.Compact>
      ),
    },
  ];

  return (
    <>
      <Flex justify="space-between">
        <Search
          placeholder="Search by name, pledge ID, or mobile"
          allowClear
          enterButton="Search"
          size="medium"
          onSearch={handleSearch}
          style={{ marginBottom: 16, width: 400 }}
        />
        <Button
          onClick={() => navigate("/admin/pledges/add")}
          type="primary"
          icon={<FileAddOutlined />}
        >
          Add Pledge
        </Button>
      </Flex>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="pledge_id"
        loading={loading}
        bordered
        pagination={{ pageSize: 10, showSizeChanger: true }}
        locale={{ emptyText: "No Pledges found." }}
        scroll={{ x: "max-content" }}
        size="small"
      />
    </>
  );
};

export default PledgeList;
