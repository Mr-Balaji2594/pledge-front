import React from "react";

import { useSiteContext } from "../context/SiteDarkProvider";

import PropTypes from "prop-types";

import UnauthorizedPage from "./UnauthorizedPage";

import { useNavigate } from "react-router-dom";

import { message } from "antd";

const PrivateRoute = React.memo(({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const { user } = useSiteContext();

  if (!user) {
    navigate("/");
    return (
      <>
        <UnauthorizedPage />
      </>
    );
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    message.warning("You are not authorized to access this page.");
    return null;
  }

  return children;
});

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node.isRequired,
};

PrivateRoute.displayName = "PrivateRoute";

export default PrivateRoute;
