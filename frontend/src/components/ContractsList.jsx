import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";

const ContractsList = ({ searchTerm, org }) => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
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

  return (
    <div className=" max-w-7xl h-full mx-auto flex flex-col flex-1 text-gray-800">
      <h2 className="text-center py-4 text-3xl font-bold">
        Список договорів{" "}
        {org === "protect"
          ? ` ТОВ "Протект Інжиніринг"`
          : `ТОВ "Автомобільна Інжинірінгова Група"`}
      </h2>
      <div className="relative flex max-h-[810px] overflow-y-auto bg-gray-100 rounded-lg shadow-lg">
        <table className="table-fixed w-full text-gray-900">
          <thead className="text-left bg-gray-800 text-gray-100 cursor-pointer select-none sticky top-0 z-10">
            <tr>
              <th className="p-2 w-[100px]" onClick={() => handleSort("title")}>
                <div className="flex items-center">
                  Назва {getSortIcon("title")}
                </div>
              </th>
              <th className="p-2 w-[40px]" onClick={() => handleSort("id")}>
                <div className="flex items-center">ID {getSortIcon("id")}</div>
              </th>
              <th
                className="p-2  w-[80px]"
                onClick={() => handleSort("number")}
              >
                <div className="flex items-center">
                  Номер {getSortIcon("number")}
                </div>
              </th>
              <th
                className="p-2  w-[100px]"
                onClick={() => handleSort("counterparty")}
              >
                <div className="flex items-center">
                  Контрагент {getSortIcon("counterparty")}
                </div>
              </th>
              <th
                className="p-2  w-[100px]"
                onClick={() => handleSort("performers")}
              >
                <div className="flex items-center">
                  Відповідальний за виконання {getSortIcon("performers")}
                </div>
              </th>
              <th className="p-2  w-[100px]" onClick={() => handleSort("date")}>
                <div className="flex items-center">
                  Дата {getSortIcon("date")}
                </div>
              </th>
              <th
                className="p-2  w-[100px]"
                onClick={() => handleSort("end_date")}
              >
                <div className="flex items-center">
                  Дата закінчення {getSortIcon("end_date")}
                </div>
              </th>
              <th
                className="p-2  w-[60px]"
                onClick={() => handleSort("condition")}
              >
                <div className="flex items-center">
                  Стан {getSortIcon("condition")}
                </div>
              </th>
              <th
                className="p-2  w-[100px]"
                onClick={() => handleSort("description")}
              >
                <div className="flex items-center">
                  Примітка {getSortIcon("description")}
                </div>
              </th>
              <th className="p-2  w-[100px]"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-300">
            {sortedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-200">
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
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
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
