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
        console.log("eee");
      } catch (error) {
        console.log("Error", error);
      }
    };
    console.log(searchTerm);
    fetchContracts(searchTerm);
  }, [searchTerm]);
  return (
    <div className=" border-stone-300 border-2 rounded-lg">
      <h2 className=" mx-0 text-center py-4 text-3xl">ContractsList</h2>
      <div>
        <ul className="flex flex-col gap-2">
          {data.map((item) => (
            <li key={item.id}>
              <div className=" flex gap-2 bg-white p-4">
                <p>{item.title}</p>
                <p>{item.description}</p>
                <Link to={`/contracts/${item.id}`}>
                  <button className=" bg-gray-600 text-white px-4 py-2 rounded-2xl">
                    Details
                  </button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContractsList;
