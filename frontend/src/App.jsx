import ContractUploadForm from "./components/ContractUploadForm";
import ContractsList from "./components/ContractsList";
import ContractDetails from "./components/ContractDetails";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { useState } from "react";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8 py-4 flex flex-row justify-between items-center">
          <h1 className="text-xl font-semibold">Contracts Managment</h1>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e)}
            placeholder="Search"
            className="border p-2 rounded-lg"
          />
        </div>
      </header>
      <main className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Router>
          <nav className="flex justify-center">
            <NavLink to="/contracts" className="mx-4">
              Contracts
            </NavLink>
            <NavLink to="/upload" className="mx-4">
              Upload
            </NavLink>
          </nav>
          <Routes>
            <Route
              path="/contracts"
              element={<ContractsList searchTerm={searchTerm} />}
            />
            <Route path="/upload" element={<ContractUploadForm />} />
            <Route path="/contracts/:id" element={<ContractDetails />} />
            <Route
              path="/"
              element={<ContractsList searchTerm={searchTerm} />}
            />
          </Routes>
        </Router>
      </main>
    </div>
  );
}

export default App;
