import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ContractsList = ({ searchTerm }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchContracts = async (query) => {
      try {
        axios
          .get("http://127.0.0.1:5000/api/contracts", {
            params: {
              search: query || "",
            },
          })
          .then((res) => {
            setData(res.data);
          });
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchContracts(searchTerm);
  }, [searchTerm]);
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-center py-4 text-3xl font-bold">Contracts List</h2>

      <div className="inline-block min-w-full align-middle">
        <div className="overflow-y-auto h-[680px]">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-800 text-white sticky top-0 text-left">
              <tr>
                <th className="px-4 py-2">Назва</th>
                <th className="px-4 py-2">Контрагент</th>
                <th className="px-4 py-2">Номер договору</th>
                <th className="px-4 py-2">Дата</th>
                <th className="px-4 py-2">Дата закінчення</th>
                <th className="px-4 py-2">Виконавець</th>
                <th className="px-4 py-2">Примітка</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-100 text-wrap">
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">{item.counterparty}</td>
                  <td className="px-4 py-2">{item.number}</td>
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">{item.end_date}</td>
                  <td className="px-4 py-2">{item.performers}</td>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2 text-center">
                    <Link to={`/contracts/${item.id}`}>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                        Details
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
