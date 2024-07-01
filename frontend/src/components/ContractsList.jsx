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
      <span className="flex flex-col items-center">
        <TiArrowSortedUp
          className={`text-lg ${
            sortConfig.key === key && sortConfig.direction === "asc"
              ? "text-blue-500"
              : "text-gray-500"
          }`}
        />
        <TiArrowSortedDown
          className={`text-lg ${
            sortConfig.key === key && sortConfig.direction === "desc"
              ? "text-blue-500"
              : "text-gray-500"
          }`}
        />
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-center py-4 text-3xl font-bold">
        Список договорів{" "}
        {org === "protect"
          ? ` ТОВ "Протект Інжиніринг"`
          : `ТОВ "Автомобільна Інжинірінгова Група"`}
      </h2>

      <div className="inline-block min-w-full align-middle">
        <div className="overflow-y-auto h-[680px]">
          <table className="divide-gray-200 table-fixed">
            <thead className="bg-gray-400 text-white text-left">
              <tr className="w-[1280px]">
                <th
                  className="px-4 py-2 w-[150px] cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center">
                    Назва {getSortIcon("title")}
                  </div>
                </th>
                <th
                  className="px-4 py-2 w-[150px] cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    ID {getSortIcon("id")}
                  </div>
                </th>
                <th
                  className="px-4 py-2 w-[150px]"
                  onClick={() => handleSort("counterparty")}
                >
                  <div className="flex items-center">
                    Контрагент {getSortIcon("counterparty")}
                  </div>
                </th>
                <th
                  className="px-4 py-2 w-[150px]"
                  onClick={() => handleSort("number")}
                >
                  <div className="flex items-center">
                    Номер договору {getSortIcon("number")}
                  </div>
                </th>
                <th
                  className="px-4 py-2 w-[150px]"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Дата {getSortIcon("date")}
                  </div>
                </th>
                <th
                  className="px-4 py-2 w-[150px]"
                  onClick={() => handleSort("end_date")}
                >
                  <div className="flex items-center">
                    Дата закінчення {getSortIcon("end_date")}
                  </div>
                </th>
                <th
                  className="px-4 py-2 w-[150px]"
                  onClick={() => handleSort("performers")}
                >
                  <div className="flex items-center">
                    Виконавець {getSortIcon("performers")}
                  </div>
                </th>
                <th
                  className="px-4 py-2 w-[150px]"
                  onClick={() => handleSort("description")}
                >
                  <div className="flex items-center">
                    Примітка {getSortIcon("description")}
                  </div>
                </th>
                <th className="px-4 py-2 w-[150px]"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-100 text-wrap">
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">{item.counterparty}</td>
                  <td className="px-4 py-2">{item.number}</td>
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">{item.end_date}</td>
                  <td className="px-4 py-2">{item.performers}</td>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2 text-center">
                    <Link to={`/${org}/${item.id}`}>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
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
    </div>
  );
};

export default ContractsList;
