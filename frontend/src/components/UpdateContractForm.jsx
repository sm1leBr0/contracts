import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Form from "./Form";
import { transliterateFilename } from "../transliterationRules";

const UpdateContractForm = ({ org }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    numberOfContract: "",
    date: "",
    endDate: "",
    description: "",
    file: null,
    counterparty: "",
    performers: "",
    organisation: org,
  });

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api/${org}/${id}`)
      .then((res) => {
        const contract = res.data;
        setFormData({
          title: contract.title,
          numberOfContract: contract.number,
          date: contract.date,
          endDate: contract.end_date,
          description: contract.description,
          counterparty: contract.counterparty,
          performers: contract.performers,
          organisation: org,
        });
      })
      .catch((error) => {
        console.error("Error fetching contract:", error);
      });
  }, [id, org]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Транслітеруйте ім'я файлу
      const transliteratedFileName = transliterateFilename(file.name);
      // Створіть новий файл з транслітерованим ім'ям
      const newFile = new File([file], transliteratedFileName, {
        type: file.type,
      });
      setFormData({ ...formData, file: newFile });
      console.log(newFile); // Перевірте ім'я файлу
    }
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
    if (formData.file) {
      formDataToSubmit.append("file", formData.file);
    }
    formDataToSubmit.append("title", formData.title);
    formDataToSubmit.append("number", formData.numberOfContract);
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("date", formData.date);
    formDataToSubmit.append("end_date", formData.endDate);
    formDataToSubmit.append("counterparty", formData.counterparty);
    formDataToSubmit.append("performers", formData.performers);

    try {
      await axios.put(
        `http://127.0.0.1:5000/api/${org}/update/${id}`,
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Contract updated successfully!");
      navigate(`/${org}/${id}`);
    } catch (error) {
      alert("Error updating contract");
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Form
        handleFileChange={handleFileChange}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        formData={formData}
        isUpdate={true}
      />
    </>
  );
};

export default UpdateContractForm;
