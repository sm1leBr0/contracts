import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";

const ContractsList = ({ searchTerm, org }) => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  useEffect(() => {
    const fetchContracts = async (query) => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/${org}/contracts`,
          {
            params: {
              search: query || "",
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchContracts(searchTerm);
  }, [searchTerm, org]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const getSortIcon = (key) => {
    return (
      <span className="flex flex-col items-center p-1">
        <TiArrowSortedUp
          className={`text-lg ${
            sortConfig.key === key && sortConfig.direction === "asc"
              ? "text-blue-600" /* Updated sort icon color */
              : "text-gray-400"
          }`}
        />
        <TiArrowSortedDown
          className={`text-lg ${
            sortConfig.key === key && sortConfig.direction === "desc"
              ? "text-blue-600" /* Updated sort icon color */
              : "text-gray-400"
          }`}
        />
      </span>
    );
  };
  const orangeTheme = {
    headerBg: "bg-orange-700",
    headerText: "text-white",
    evenRowBg: "bg-orange-50",
    oddRowBg: "bg-orange-100",
    hoverRowBg: "hover:bg-orange-200",
    borderColor: "border-orange-300",
    buttonBg: "bg-orange-700",
    buttonHoverBg: "hover:bg-orange-800",
  };

  const greenTheme = {
    headerBg: "bg-teal-700",
    headerText: "text-white",
    evenRowBg: "bg-teal-50",
    oddRowBg: "bg-teal-100",
    hoverRowBg: "hover:bg-teal-200",
    borderColor: "border-teal-300",
    buttonBg: "bg-teal-700",
    buttonHoverBg: "hover:bg-teal-800",
  };

  const theme = org === "protect" ? orangeTheme : greenTheme;

  return (
    <div className="max-w-7xl h-full mx-auto flex flex-col flex-1 text-gray-800">
      <h2 className="text-center py-4 text-3xl font-bold">
        Список договорів{" "}
        {org === "protect"
          ? `ТОВ "Протект Інжиніринг"`
          : `ТОВ "Автомобільна Інжинірінгова Група"`}
      </h2>
      <div className="relative flex max-h-[810px] overflow-y-auto bg-gray-100 rounded-lg shadow-lg">
        <table className="table-fixed w-full text-gray-900">
          <thead
            className={`text-left ${theme.headerBg} ${theme.headerText} cursor-pointer select-none sticky top-0 z-10`}
          >
            <tr>
              <th className="p-2 w-[100px]" onClick={() => handleSort("title")}>
                <div className="flex items-center">
                  Предмет договору {getSortIcon("title")}
                </div>
              </th>
              <th className="p-2 w-[40px]" onClick={() => handleSort("id")}>
                <div className="flex items-center">ID {getSortIcon("id")}</div>
              </th>
              <th className="p-2 w-[80px]" onClick={() => handleSort("number")}>
                <div className="flex items-center">
                  Номер {getSortIcon("number")}
                </div>
              </th>
              <th
                className="p-2 w-[100px]"
                onClick={() => handleSort("counterparty")}
              >
                <div className="flex items-center">
                  Контрагент {getSortIcon("counterparty")}
                </div>
              </th>
              <th
                className="p-2 w-[100px]"
                onClick={() => handleSort("performers")}
              >
                <div className="flex items-center">
                  Відповідальний за виконання {getSortIcon("performers")}
                </div>
              </th>
              <th className="p-2 w-[100px]" onClick={() => handleSort("date")}>
                <div className="flex items-center">
                  Дата {getSortIcon("date")}
                </div>
              </th>
              <th
                className="p-2 w-[100px]"
                onClick={() => handleSort("end_date")}
              >
                <div className="flex items-center">
                  Дата закінчення {getSortIcon("end_date")}
                </div>
              </th>
              <th
                className="p-2 w-[60px]"
                onClick={() => handleSort("condition")}
              >
                <div className="flex items-center">
                  Стан {getSortIcon("condition")}
                </div>
              </th>
              <th
                className="p-2 w-[100px]"
                onClick={() => handleSort("description")}
              >
                <div className="flex items-center">
                  Примітка {getSortIcon("description")}
                </div>
              </th>
              <th className="p-2 w-[100px]"></th>
            </tr>
          </thead>
          <tbody className={`bg-white divide-y ${theme.borderColor}`}>
            {sortedData.map((item, index) => (
              <tr
                key={item.id}
                className={`${
                  index % 2 === 0 ? theme.evenRowBg : theme.oddRowBg
                } ${theme.hoverRowBg}`}
              >
                <td className="p-2">{item.title}</td>
                <td className="p-2">{item.id}</td>
                <td className="p-2">{item.number}</td>
                <td className="p-2">{item.counterparty}</td>
                <td className="p-2">{item.performers}</td>
                <td className="p-2">{item.date}</td>
                <td className="p-2">{item.end_date}</td>
                <td className="p-2">{item.condition}</td>
                <td className="p-2">
                  {item.description.toString().slice(0, 10) + "..."}
                </td>
                <td className="px-4 py-2 text-center">
                  <Link to={`/${org}/${item.id}`}>
                    <button
                      className={`${theme.buttonBg} ${theme.buttonHoverBg} text-white px-4 py-2 rounded-lg`}
                    >
                      Детальніше
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractsList;
