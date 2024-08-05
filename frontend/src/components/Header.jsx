import { NavLink } from "react-router-dom";
import { RiFilePaper2Line } from "react-icons/ri";

const Header = ({ searchTerm, onSearchChange, onOrganisationChange, auth }) => {
  return (
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
            onClick={onOrganisationChange("protect")}
          >
            ТОВ "Протект Інжиніринг"
          </NavLink>
          <NavLink
            to="/aig"
            className={({ isActive }) =>
              `mx-4 ${isActive ? "active-link" : ""}`
            }
            onClick={onOrganisationChange("aig")}
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
          onChange={onSearchChange}
          placeholder="Шукати"
          className="border p-2 rounded-lg"
        />
      </div>
    </header>
  );
};

export default Header;
