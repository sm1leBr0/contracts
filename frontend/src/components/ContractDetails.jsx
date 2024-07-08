import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ContractDetails = ({ auth }) => {
  const { org, id } = useParams();
  const navigate = useNavigate();

  const [contract, setContract] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api/${org}/${id}`)
      .then((res) => {
        setContract(res.data);
        const filePath = res.data.file_path;
        setPdfUrl(`http://127.0.0.1:5000/${filePath}`);
      })
      .catch((error) => {
        console.error("Error fetching contract:", error);
      });
  }, [id, org]);

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/${org}/download/${id}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${contract.title}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading contract:", error);
    }
  };

  const deleteContract = async () => {
    let removeConfirm = window.confirm("Дійсно бажаєте видалити контракт?");

    if (removeConfirm) {
      try {
        await axios.delete(`http://localhost:5000/api/${org}/${id}`);
        navigate("/");
      } catch (error) {
        console.error("Error deleting contract:", error);
      }
    } else {
      console.log("Deletion canceled by user.");
    }
  };

  if (!contract) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl flex justify-between mx-auto h-full p-6">
      <div className="max-w-xl bg-gray-200 shadow-lg rounded-lg p-6 mr-6">
        <p className="text-lg font-semibold mb-2">
          Назва: <span className="text-gray-700">{contract.title}</span>
        </p>
        <p className="text-lg font-semibold mb-2">
          Номер договору:{" "}
          <span className="text-gray-700">{contract.number}</span>
        </p>
        <p className="text-lg font-semibold mb-2">
          Контрагент:{" "}
          <span className="text-gray-700">{contract.counterparty}</span>
        </p>
        <p className="text-lg font-semibold mb-2">
          Виконавець:{" "}
          <span className="text-gray-700">{contract.performers}</span>
        </p>
        <p className="text-lg font-semibold mb-2">
          Дата: <span className="text-gray-700">{contract.date}</span>
        </p>
        <p className="text-lg font-semibold mb-2">
          Дата закінчення:{" "}
          <span className="text-gray-700">{contract.end_date}</span>
        </p>
        <p className="text-lg font-semibold mb-4">
          Примітка:{" "}
          <span className="text-gray-700">{contract.description}</span>
        </p>
        <button
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-2xl"
          onClick={handleDownload}
        >
          Завантажити
        </button>
        {auth && (
          <div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl ml-2"
              onClick={() => navigate(`/${org}/update/${id}`)}
            >
              Update
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-2xl"
              onClick={deleteContract}
            >
              Видалити
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center align-middle h-[800px] w-[900px] flex-grow">
        <iframe
          src={pdfUrl}
          title="PDF Viewer"
          className="w-full h-full border-2 border-emerald-900 rounded-lg"
        />
      </div>
    </div>
  );
};

export default ContractDetails;
