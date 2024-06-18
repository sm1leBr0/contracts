import React, { useState } from "react";
import axios from "axios";

const ContractUploadForm = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    try {
      await axios.post("http://127.0.0.1:5000/api/contracts/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("contract uploaded successfully!");
      setTitle("");
      setFile(null);
      setDescription("");
    } catch (error) {
      alert("Error uploading contract");
      console.log(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Contacts</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="file"
            className="block text-sm font-semibold text-gray-700"
          >
            File
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            className=" mt-1 block border-gray-300 rounded-md shadow-sm
             focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm 
            focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
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
