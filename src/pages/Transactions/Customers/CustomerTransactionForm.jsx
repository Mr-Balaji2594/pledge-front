import dayjs from "dayjs";
import { DatePicker, Input, Select, Form } from "antd";
import { useLocation } from "react-router-dom";

const CustomerTransactionForm = ({ handleInputChange }) => {
  const location = useLocation();
  const activeModule = location?.state?.activeModule;
  console.log("Active Module:", activeModule);
  return (
    <Form
      layout="vertical"
      initialValues={{
        type: "receipt",
        paymentMethod: "Cash",
        date: dayjs(),
      }}
    >
      <Form.Item
        label="Transaction Date"
        name="date"
        rules={[{ required: true, message: "Date is required" }]}
      >
        <DatePicker
          style={{ width: "100%" }}
          onChange={(_, dateString) =>
            handleInputChange({
              target: { name: "date", value: dateString || "" },
            })
          }
        />
      </Form.Item>

      <Form.Item
        label="Customer Name"
        name="customer"
        rules={[{ required: true, message: "Customer name is required" }]}
      >
        <Input
          placeholder="Enter customer name"
          name="customer"
          onChange={handleInputChange}
        />
      </Form.Item>

      <Form.Item
        label="Bank Name"
        name="bank"
        rules={[{ required: true, message: "Bank name is required" }]}
      >
        <Input
          placeholder="Enter bank name"
          name="bank"
          onChange={handleInputChange}
        />
      </Form.Item>

      <Form.Item label="Transaction Type" name="type">
        <Select
          options={[
            { label: "Receipt", value: "receipt" },
            { label: "Payment", value: "payment" },
          ]}
          onChange={(value) =>
            handleInputChange({ target: { name: "type", value } })
          }
        />
      </Form.Item>

      <Form.Item label="Payment Method" name="paymentMethod">
        <Select
          options={[
            { label: "Cash", value: "Cash" },
            { label: "Bank Transfer", value: "Bank Transfer" },
            { label: "UPI", value: "UPI" },
            { label: "Cheque", value: "Cheque" },
          ]}
          onChange={(value) =>
            handleInputChange({ target: { name: "paymentMethod", value } })
          }
        />
      </Form.Item>

      <Form.Item
        label="Amount"
        name="amount"
        rules={[{ required: true, message: "Amount is required" }]}
      >
        <Input
          type="number"
          placeholder="₹ Amount"
          name="amount"
          onChange={handleInputChange}
        />
        <Form.Item label="Description" name="description">
          <Input.TextArea
            rows={3}
            name="description"
            placeholder="Add notes (optional)"
            onChange={handleInputChange}
          />
        </Form.Item>
      </Form.Item>

      <Form.Item
        label="Reference No"
        name="reference"
        rules={[{ required: true, message: "Reference is required" }]}
      >
        <Input
          name="reference"
          placeholder="Reference / transaction ID"
          onChange={handleInputChange}
        />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <Input.TextArea
          rows={3}
          name="description"
          placeholder="Add notes (optional)"
          onChange={handleInputChange}
        />
      </Form.Item>
    </Form>
  );
};

export default CustomerTransactionForm;
