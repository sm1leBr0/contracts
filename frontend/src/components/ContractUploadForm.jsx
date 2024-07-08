import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "./Form";

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
    organisation: "protect",
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
    formDataToSubmit.append("scope", formData.scope || "");
    formDataToSubmit.append("counterparty", formData.counterparty);
    formDataToSubmit.append("performers", formData.performers);
    formDataToSubmit.append("organisation", formData.organisation);

    try {
      await axios.post(
        `http://127.0.0.1:5000/api/${formData.organisation}/add`,
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
        organisation: "protect",
      });
    } catch (error) {
      alert("Error uploading contract");
      console.error("Error:", error);
    }
  };

  return (
    <Form
      handleFileChange={handleFileChange}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      formData={formData}
    />
  );
};

export default ContractUploadForm;
