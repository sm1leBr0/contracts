import React, { useState } from "react";
import DropDownInput from "./DropDownInput";
import ContractUploadForm from "./ContractUploadForm";
import axios from "axios";

const AdminPanel = ({ auth }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemType, setItemType] = useState("");
  const [message, setMessage] = useState("");

  const handleSelect = (item, type) => {
    setSelectedItem(item);
    setItemType(type);
  };

  const handleDelete = async () => {
    if (selectedItem && itemType) {
      try {
        await axios.delete(
          `http://127.0.0.1:5000/api/aig/${itemType}/${selectedItem.id}`
        );
        setSelectedItem(null);
        setItemType("");
        setMessage(
          `${
            itemType.charAt(0).toUpperCase() + itemType.slice(1)
          } deleted successfully!`
        ); // Set success message
      } catch (error) {
        console.error(`Error deleting ${itemType}:`, error);
        setMessage(`Error deleting ${itemType}. Please try again.`); // Set error message
      } finally {
        setTimeout(() => setMessage(""), 3000); // Clear the message after 3 seconds
      }
    }
  };
  const handleAdd = async (type, query) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/api/aig/${type}/add`,
        { name: query }
      );
      setMessage(
        `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`
      );
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      setMessage(`Error adding ${type}. Please try again.`);
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="mx-auto flex gap-2">
      <ContractUploadForm />
      <div className="flex flex-col w-[400px] h-[200px] rounded-lg bg-gray-300 p-2 shadow-lg gap-2 items-center">
        <h2>Select Performer</h2>
        <div className="flex gap-2">
          <DropDownInput
            onSelect={(item) => handleSelect(item, "performer")}
            type="performer"
            defaultValue={
              selectedItem && itemType === "performer" ? selectedItem.name : ""
            }
          />
          <button
            className="bg-green-800 rounded-xl shadow-xl px-4 py-2 text-white"
            onClick={() => handleAdd("performer", selectedItem.name)}
          >
            Add
          </button>
          <button
            className="bg-red-800 rounded-xl shadow-xl px-4 py-2 text-white"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
        <h2>Select Counterparty</h2>
        <div className="flex gap-2">
          <DropDownInput
            onSelect={(item) => handleSelect(item, "counterparty")}
            type="counterparty"
            defaultValue={
              selectedItem && itemType === "counterparty"
                ? selectedItem.name
                : ""
            }
          />
          <button
            className="bg-green-800 rounded-xl shadow-xl px-4 py-2 text-white"
            onClick={() => handleAdd("counterparty", selectedItem.name)}
          >
            Add
          </button>
          <button
            className="bg-red-800 rounded-xl shadow-xl px-4 py-2 text-white"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
        {message && (
          <span
            className={`mt-2 ${
              message.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </span>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
