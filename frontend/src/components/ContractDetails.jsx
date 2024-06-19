import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ContractDetails = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api/contracts/${id}`)
      .then((res) => {
        setContract(res.data);
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
    } catch (error) {
      console.error("Error deleting contract:", error);
    }
  };
  if (!contract) return <div>Loading...</div>;

  return (
    <div>
      <div></div>

      <h2>{contract.title}</h2>
      <p>{contract.description}</p>
      <p></p>
      <div>
        <button
          className="bg-cyan-600 px-4 py-2 rounded-2xl mr-2"
          onClick={handleDownload}
        >
          Download
        </button>
        <button className="bg-cyan-600 px-4 py-2 rounded-2xl">View PDF</button>
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
