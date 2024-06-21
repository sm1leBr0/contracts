import ContractUploadForm from "./components/ContractUploadForm";
import ContractsList from "./components/ContractsList";
import ContractDetails from "./components/ContractDetails";
import { Routes, Route, NavLink } from "react-router-dom";
import { useState } from "react";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen">
      <header className="bg-gray-900 shadow-sm ">
        <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8 py-4 flex flex-row justify-between items-center">
          <h1 className="text-xl  text-white font-semibold">
            Contracts Managment
          </h1>
          <nav className="flex justify-center text-white">
            <NavLink to="/contracts" className="mx-4">
              Contracts
            </NavLink>
            <NavLink to="/upload" className="mx-4">
              Upload
            </NavLink>
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
      <main className="flex flex-col justify-center mx-auto ">
        <Routes>
          <Route
            path="/contracts"
            element={<ContractsList searchTerm={searchTerm} />}
          />
          <Route path="/upload" element={<ContractUploadForm />} />
          <Route path="/contracts/:id" element={<ContractDetails />} />
          <Route path="/" element={<ContractsList searchTerm={searchTerm} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
