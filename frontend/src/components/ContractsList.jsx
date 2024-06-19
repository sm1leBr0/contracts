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
    <div className=" border-stone-300 border-2 rounded-lg">
      <h2 className=" mx-0 text-center py-4 text-3xl">ContractsList</h2>
      <div>
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs text-gray-700 uppercase">
            <tr className="">
              <th className="px-6 py-3">Назва</th>
              <th className="px-6 py-3">Контрагент</th>
              <th className="px-6 py-3">Номер договору</th>
              <th className="px-6 py-3">Дата</th>
              <th className="px-6 py-3">Дата закінчення</th>
              <th className="px-6 py-3">Виконавець</th>
              <th className="px-6 py-3">Примітка</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="even:bg-slate-400">
                <td className="px-6 py-3">{item.title}</td>
                <td className="px-6 py-3">{item.counterparty}</td>
                <td className="px-6 py-3">{item.number}</td>
                <td className="px-6 py-3">{item.date}</td>
                <td className="px-6 py-3">{item.end_date}</td>
                <td className="px-6 py-3">{item.performers}</td>
                <td className="px-6 py-3">{item.description}</td>
                <td className="px-6 py-3">
                  <Link to={`/contracts/${item.id}`}>
                    <button className="bg-gray-600 text-white px-6 py-3 rounded-2xl">
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
  );
};

export default ContractsList;
