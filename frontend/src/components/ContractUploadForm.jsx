import React, { useState } from "react";
import axios from "axios";

const ContractUploadForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    numberOfContract: 0,
    date: "",
    endDate: "",
    description: "",
    file: null,
    counterparty: "",
    performers: "",
  });

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();

    formDataToSubmit.append("file", formData.file);
    formDataToSubmit.append("title", formData.title);
    formDataToSubmit.append("number", formData.numberOfContract);
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("date", formData.date);
    formDataToSubmit.append("end_date", formData.endDate);
    formDataToSubmit.append("counterparty", formData.counterparty);
    formDataToSubmit.append("performers", formData.performers);

    try {
      await axios.post(
        "http://127.0.0.1:5000/api/contracts/add",
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Contract uploaded successfully!");
      setFormData({
        title: "",
        numberOfContract: 0,
        date: "",
        endDate: "",
        description: "",
        file: null,
        counterparty: "",
        performers: "",
      });
    } catch (error) {
      alert("Error uploading contract");
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Upload Contract
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="form-element"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="number">Contract Number</label>
          <input
            type="number"
            id="number"
            name="numberOfContract"
            value={formData.numberOfContract}
            onChange={handleInputChange}
            required
            className="form-element"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="counterparty">Counterparty</label>
          <input
            type="text"
            id="counterparty"
            name="counterparty"
            value={formData.counterparty}
            onChange={handleInputChange}
            required
            className="form-element"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="performers">Performers</label>
          <input
            type="text"
            id="performers"
            name="performers"
            value={formData.performers}
            onChange={handleInputChange}
            required
            className="form-element"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className="form-element"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="end_date">End Date</label>
          <input
            type="date"
            id="end_date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            required
            className="form-element"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="form-element"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="file">File</label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            required
            className="form-element"
          />
        </div>
        <button
          type="submit"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Upload Contract
        </button>
      </form>
    </div>
  );
};

export default ContractUploadForm;
