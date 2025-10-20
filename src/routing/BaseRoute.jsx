import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import NotFound from "../components/Not-Found/NotFound.jsx";
import AdminLayout from "../themes/AdminLayout.jsx";
import Loader from "../components/ComponentLoader/Loader.jsx";

const Login = lazy(() => import("../pages/Login/Login.jsx"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard.jsx"));
const CustomerList = lazy(() => import("../pages/Customers/CustomerList.jsx"));
const CustomerForm = lazy(() => import("../pages/Customers/CustomerForm.jsx"));
const CustomerView = lazy(() => import("../pages/Customers/CustomerView.jsx"));
const PledgeList = lazy(() => import("../pages/Pledges/PledgeList.jsx"));
const PledgeForm = lazy(() => import("../pages/Pledges/PledgeForm.jsx"));
const PledgeView = lazy(() => import("../pages/Pledges/PledgeView.jsx"));
const BankPledge = lazy(() => import("../pages/Bank-Pledges/BankPledge.jsx"));

function BaseRoute() {
  function mainroute() {
    return (
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    );
  }

  function adminRoute() {
    return (
      <>
        <AdminLayout>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="*" element={<NotFound />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* Customers Routes */}
              <Route
                path="customers"
                element={<CustomerList />}
                key={"customers"}
              />
              <Route
                path="customers/add"
                element={<CustomerForm isEdit={false} />}
                key={"add"}
              />
              <Route
                path="customers/edit/:uuid"
                element={<CustomerForm isEdit={true} />}
              />
              <Route path="customers/view/:uuid" element={<CustomerView />} />

              {/* Pledges Routes */}
              <Route path="pledges" element={<PledgeList />} key={"pledges"} />
              <Route
                path="pledges/add"
                element={<PledgeForm isEdit={false} />}
                key={"addpledge"}
              />
              <Route
                path="pledges/edit/:hashid"
                element={<PledgeForm isEdit={true} />}
                key={"editpledge"}
              />
              <Route
                path="pledges/view/:hashid"
                element={<PledgeView />}
                key={"viewpledge"}
              />

              {/* Bank Pledges Routes */}
              <Route
                path="bank-pledges"
                element={<BankPledge />}
                key={"bank-pledges"}
              />
            </Routes>
          </Suspense>
        </AdminLayout>
      </>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={mainroute()} />
        <Route
          path="/admin/*"
          element={<PrivateRoute>{adminRoute()}</PrivateRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default BaseRoute;
