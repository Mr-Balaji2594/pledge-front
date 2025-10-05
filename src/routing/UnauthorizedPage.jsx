import { Link } from "react-router-dom";
import { Result, Button } from "antd";

const UnauthorizedPage = () => {
  return (
    <Result
      status="403"
      title="403 Forbidden"
      subTitle="Sorry, you do not have permission to access this page."
      extra={
        <Link to="/">
          <Button type="primary">Back Home</Button>
        </Link>
      }
    />
  );
};

export default UnauthorizedPage;
