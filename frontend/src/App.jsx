import ContractUploadForm from "./components/ContractUploadForm";
import ContractsList from "./components/ContractsList";
import ContractDetails from "./components/ContractDetails";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [auth, setAuth] = useState(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen">
      <header className="bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-row justify-between items-center">
          <h1 className="text-xl text-white font-semibold">
            Contracts Management
          </h1>
          <nav className="flex justify-center text-white">
            <NavLink to="/protect" className="mx-4">
              Protect
            </NavLink>
            <NavLink to="/aig" className="mx-4">
              AIG
            </NavLink>
            {auth && (
              <NavLink to="/upload" className="mx-4">
                Upload
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
      <main className="flex flex-col justify-center mx-auto">
        <Routes>
          <Route
            path="/protect"
            element={<ContractsList searchTerm={searchTerm} org="protect" />}
          />
          <Route
            path="/aig"
            element={<ContractsList searchTerm={searchTerm} org="aig" />}
          />
          <Route
            path="/upload"
            element={auth ? <ContractUploadForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/contracts/:id"
            element={<ContractDetails auth={auth} />}
          />
          <Route path="/login" element={<Login setAuth={setAuth} />} />
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
