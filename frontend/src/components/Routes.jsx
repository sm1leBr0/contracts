import { Routes, Route, Navigate } from "react-router-dom";
import ContractUploadForm from "./ContractUploadForm";
import ContractsList from "./ContractsList";
import ContractDetails from "./ContractDetails";
import UpdateContractForm from "./UpdateContractForm";
import Login from "./Login";
import AdminPanel from "./AdminPanel";

const AppRoutes = ({ searchTerm, organisation, auth, setAuth }) => {
  return (
    <Routes>
      <Route
        path="/protect"
        element={<ContractsList searchTerm={searchTerm} org={organisation} />}
      />
      <Route
        path="/aig"
        element={<ContractsList searchTerm={searchTerm} org={organisation} />}
      />
      <Route
        path="/upload"
        element={auth ? <ContractUploadForm /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin"
        element={
          auth ? <AdminPanel setAuth={setAuth} /> : <Navigate to="/login" />
        }
      />
      <Route path="/:org/:id" element={<ContractDetails auth={auth} />} />
      <Route path="/login" element={<Login setAuth={setAuth} />} />
      <Route
        path="/:org/update/:id"
        element={<UpdateContractForm org={organisation} />}
      />
      <Route
        path="/"
        element={<ContractsList searchTerm={searchTerm} org="protect" />}
      />
    </Routes>
  );
};

export default AppRoutes;
