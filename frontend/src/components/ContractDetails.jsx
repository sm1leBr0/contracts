import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Form from "./Form";

const ContractDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const deleteContract = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/contracts/${id}`);
      navigate("/contracts");
    } catch (error) {
      console.error("Error deleting contract:", error);
    }
  };
  if (!contract) return <div>Loading...</div>;
  console.log(contract);
  return (
    <div className="flex flex-col">
      <div className="flex justify-center ">
        <div>
          <Form formData={contract} />
        </div>

        <div className="flex justify-center align-middle ">
          <iframe
            src={pdfUrl}
            title="PDF Viewer"
            className="w-[800px] h-[600px] border-2 border-emerald-900"
          />
        </div>
      </div>

      <div>
        <button
          className="bg-cyan-600 px-4 py-2 rounded-2xl mr-2"
          onClick={handleDownload}
        >
          Download
        </button>
        <button
          className="bg-red-400 px-4 py-2 rounded-2xl ml-2"
          onClick={deleteContract}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ContractDetails;
