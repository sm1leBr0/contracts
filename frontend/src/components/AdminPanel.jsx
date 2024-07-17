import React, { useState, useEffect } from "react";
import DropDownInput from "./DropDownInput";
import ContractUploadForm from "./ContractUploadForm";
import axios from "axios";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";

const AdminPanel = ({ setAuth }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemType, setItemType] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(
          "http://127.0.0.1:5000/api/users"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [message]);

  const handleSelect = (item, type) => {
    setSelectedItem(item);
    setItemType(type);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setAuth(null); // Clear auth state
    navigate("/login");
  };

  const handleDelete = async () => {
    if (selectedItem && itemType) {
      try {
        await axiosInstance.delete(
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
      const response = await axiosInstance.post(
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
  const handleAddUser = async () => {
    try {
      await axiosInstance.post("http://127.0.0.1:5000/api/users/add", {
        username: newUsername,
        password: newPassword,
      });
      setNewUsername("");
      setNewPassword("");
      setMessage("User added successfully!");
    } catch (error) {
      console.error("Error adding user:", error);
      setMessage("Error adding user. Please try again.");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axiosInstance.delete(`http://127.0.0.1:5000/api/users/${id}`);
      setMessage("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage("Error deleting user. Please try again.");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6 flex">
      <ContractUploadForm />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col  bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Select Performer</h2>
          <div className="flex flex-col gap-4 mb-4">
            <DropDownInput
              onSelect={(item) => handleSelect(item, "performer")}
              type="performer"
              defaultValue={
                selectedItem && itemType === "performer"
                  ? selectedItem.name
                  : ""
              }
            />
            <div className="flex gap-2">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md transition"
                onClick={() => handleAdd("performer", selectedItem?.name || "")}
              >
                Add
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md transition"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-4">Select Counterparty</h2>
            <DropDownInput
              onSelect={(item) => handleSelect(item, "counterparty")}
              type="counterparty"
              defaultValue={
                selectedItem && itemType === "counterparty"
                  ? selectedItem.name
                  : ""
              }
            />
            <div className="flex gap-2">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md transition"
                onClick={() =>
                  handleAdd("counterparty", selectedItem?.name || "")
                }
              >
                Add
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md transition"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
          {message && (
            <span
              className={`mt-4 block ${
                message.includes("Error") ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </span>
          )}
        </div>
        <div className="flex flex-col flex-1 bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="border p-2 rounded-lg w-full mb-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border p-2 rounded-lg w-full mb-4"
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition"
              onClick={handleAddUser}
            >
              Add User
            </button>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Existing Users:</h3>
            <ul className="space-y-2">
              {users.map((user) => (
                <li key={user.id} className="flex justify-between items-center">
                  <span>{user.username}</span>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md shadow-md transition"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>{" "}
        <button
          className="bg-red-800 hover:bg-red-900 text-white p-4 rounded-md shadow-md transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
