const CUSTOMER_URL = {
  GET_CUSTOMERS: "/api/customers",
  CREATE_CUSTOMER: "/api/customers",
  DELETE_CUSTOMER: "/api/customers",
  UPDATE_CUSTOMER: "/api/customers",
  GET_CUSTOMER_BY_UUID: "/api/customers",
};

const PLEDGE_URL = {
  GET_PLEDGES: "/api/pledges",
  CREATE_PLEDGE: "/api/pledges",
  DELETE_PLEDGE: "/api/pledges",
  UPDATE_PLEDGE: "/api/pledges",
  GET_PLEDGE_BY_HASHID: "/api/pledges",
};

const BANK_PLEDGE_URL = {
  GET_BANK_PLEDGES: "/api/bank-pledges",
  CREATE_BANK_PLEDGE: "/api/bank-pledges",
  DELETE_BANK_PLEDGE: "/api/bank-pledges",
  UPDATE_BANK_PLEDGE: "/api/bank-pledges",
  GET_BANK_PLEDGE_BY_HASHID: "/api/bank-pledges",
  GET_PLEDGE_LOANID: "/api/bank-pledges",
};

const AUTH_URL = {
  LOGIN: "/api/login",
  LOGOUT: "/api/logout",
  REGISTER: "/api/register",
};

export { CUSTOMER_URL, PLEDGE_URL, BANK_PLEDGE_URL, AUTH_URL };
