import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ContractDetails = () => {
  const { id } = useParams();

  const [contract, setContract] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api/contracts/${id}`)
      .then((res) => {
        setContract(res.data);
        const filePath = res.data.file_path;
        setPdfUrl(`http://127.0.0.1:5000/${filePath}`);
      })
      .catch((error) => {
        console.error("Error fetching contract:", error);
      });
  }, [id]);

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/contracts/download/${id}`,
        {
          responseType: "blob", // Important
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

  /* const deleteContract = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/contracts/${id}`);
    } catch (error) {
      console.error("Error deleting contract:", error);
    }
  }; */

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
          Download
        </button>
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
