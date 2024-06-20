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
    <div className="mx-auto max-w-7xl">
      <h2 className="text-center py-4 text-3xl">Contracts List</h2>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
            <div className="overflow-y-auto h-[680px]">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-800 text-white sticky top-0 text-left">
                  <tr>
                    <th className="">Назва</th>
                    <th className="">Контрагент</th>
                    <th className="">Номер договору</th>
                    <th className="">Дата</th>
                    <th className="">Дата закінчення</th>
                    <th className="">Виконавець</th>
                    <th className="">Примітка</th>
                    <th className=""></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="">{item.title}</td>
                      <td className="">{item.counterparty}</td>
                      <td className="">{item.number}</td>
                      <td className="">{item.date}</td>
                      <td className="">{item.end_date}</td>
                      <td className="">{item.performers}</td>
                      <td className="">{item.description}</td>
                      <td className="">
                        <Link to={`/contracts/${item.id}`}>
                          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg">
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
      </div>
    </div>
  );
};

export default ContractsList;
