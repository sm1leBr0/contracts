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

  const [counterpartySuggestions, setCounterpartySuggestions] = useState([]);
  const [performerSuggestions, setPerformerSuggestions] = useState([]);

  // Fetch initial counterparty and performer data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [counterpartyRes, performersRes] = await Promise.all([
          axios.get("http://127.0.0.1:5000/api/counterparty/suggest", {
            params: { query: " " },
          }),
          axios.get("http://127.0.0.1:5000/api/performers/suggest", {
            params: { query: " " },
          }),
        ]);
        setCounterpartySuggestions(counterpartyRes.data);
        setPerformerSuggestions(performersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchInitialData();
  }, []);

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

  const handleCounterpartyChange = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, counterparty: value });

    // Fetch counterparty suggestions based on user input
    if (value) {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/api/counterparty/suggest",
          { params: { query: value } }
        );
        setCounterpartySuggestions(response.data);
      } catch (error) {
        console.error("Error fetching counterparty suggestions:", error);
      }
    } else {
      setCounterpartySuggestions([]);
    }
  };

  const handlePerformersChange = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, performers: value });

    // Fetch performer suggestions based on user input
    if (value) {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/api/performers/suggest",
          { params: { query: value } }
        );
        setPerformerSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching performer suggestions:", error);
      }
    } else {
      setPerformerSuggestions([]);
    }
  };

  const handleCounterpartySelect = async (counterparty) => {
    setFormData({ ...formData, counterparty });

    // Clear suggestions and check if the selected counterparty needs to be added
    setCounterpartySuggestions([]);
    try {
      await axios.post("http://127.0.0.1:5000/api/counterparty", {
        name: counterparty,
      });
      alert("Counterparty added successfully!");
    } catch (error) {
      console.error("Error adding counterparty:", error);
      alert("Error adding counterparty");
    }
  };

  const handlePerformerSelect = async (performer) => {
    setFormData({ ...formData, performers: performer });

    // Clear suggestions and check if the selected performer needs to be added
    setPerformerSuggestions([]);
    try {
      await axios.post("http://127.0.0.1:5000/api/performers", {
        name: performer,
      });
      alert("Performer added successfully!");
    } catch (error) {
      console.error("Error adding performer:", error);
      alert("Error adding performer");
    }
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
        `http://127.0.0.1:5000/${formData.organisation}/add`,
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
      handleCounterpartyChange={handleCounterpartyChange}
      handleCounterpartySelect={handleCounterpartySelect}
      handlePerformersChange={handlePerformersChange}
      handlePerformerSelect={handlePerformerSelect}
      counterpartySuggestions={counterpartySuggestions}
      performerSuggestions={performerSuggestions}
    />
  );
};

export default ContractUploadForm;
