import ContractUploadForm from "./components/ContractUploadForm";
import ContractsList from "./components/ContractsList";
import ContractDetails from "./components/ContractDetails";
import UpdateContractForm from "./components/UpdateContractForm";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login";
import { RiFilePaper2Line } from "react-icons/ri";
import DropDownInput from "./components/DropDownInput";
import AdminPanel from "./components/AdminPanel";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [auth, setAuth] = useState(localStorage.getItem("authToken"));
  const [organisation, setOrganisation] = useState("protect");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOrganisationChange = (org) => () => {
    setOrganisation(org);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#1E1E1E] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-row justify-between items-center">
          <h1 className="text-xl text-white font-semibold flex items-center gap-2">
            <RiFilePaper2Line /> Сайт договорів
          </h1>
          <nav className="flex justify-center text-[#9e9e9e] text-xl">
            <NavLink
              to="/protect"
              className={({ isActive }) =>
                `mx-4 ${isActive ? "active-link" : ""}`
              }
              onClick={handleOrganisationChange("protect")}
            >
              ТОВ "Протект Інжиніринг"
            </NavLink>
            <NavLink
              to="/aig"
              className={({ isActive }) =>
                `mx-4 ${isActive ? "active-link" : ""}`
              }
              onClick={handleOrganisationChange("aig")}
            >
              ТОВ "Автомобільна Інжинірінгова Група"
            </NavLink>
            {auth && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `mx-4 ${isActive ? "active-link" : ""}`
                }
              >
                AdminPanel
              </NavLink>
            )}
          </nav>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e)}
            placeholder="Search"
            className="border p-2 rounded-lg"
          />
        </div>
      </header>
      <main className="flex flex-col justify-center mx-auto flex-1 w-full">
        <Routes>
          <Route
            path="/protect"
            element={
              <ContractsList searchTerm={searchTerm} org={organisation} />
            }
          />
          <Route
            path="/aig"
            element={
              <ContractsList searchTerm={searchTerm} org={organisation} />
            }
          />
          <Route
            path="/upload"
            element={auth ? <ContractUploadForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={
              auth ? <AdminPanel auth={auth} /> : <Navigate to="/login" />
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
      </main>
    </div>
  );
}

export default App;
