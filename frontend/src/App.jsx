import { useState } from "react";
import Header from "./components/Header";
import AppRoutes from "./components/Routes";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [auth, setAuth] = useState(localStorage.getItem("authToken"));
  const [organisation, setOrganisation] = useState("protect");

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleOrganisationChange = (org) => () => setOrganisation(org);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onOrganisationChange={handleOrganisationChange}
        auth={auth}
      />
      <main className="flex flex-col justify-center mx-auto flex-1 w-full">
        <AppRoutes
          searchTerm={searchTerm}
          organisation={organisation}
          auth={auth}
          setAuth={setAuth}
        />
      </main>
    </div>
  );
}

export default App;
