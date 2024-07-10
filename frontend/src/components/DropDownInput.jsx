import React, { useState, useEffect } from "react";
import axios from "axios";

const DropDownInput = ({ onSelect, type, defaultValue = "" }) => {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 0) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:5000/api/aig/${type}/search`,
            {
              params: { query },
            }
          );
          const data = Array.isArray(response.data) ? response.data : [];
          setSuggestions(data);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
          setIsDropdownOpen(false); // Close dropdown on error
        }
      } else {
        setSuggestions([]);
        setIsDropdownOpen(false); // Close dropdown on empty query
      }
    };

    fetchSuggestions();
  }, [query, type]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setIsDropdownOpen(true); // Open dropdown when input changes
  };

  const handleSelect = (suggestion) => {
    setQuery(suggestion.name);
    onSelect(suggestion);
    setSuggestions([]);
    setIsDropdownOpen(false); // Close dropdown on selection
  };

  const handleClickOutside = (event) => {
    // Close the dropdown when clicking outside the input
    if (event.target.closest(".autocomplete-container") === null) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    // Attach the event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup the event listener when the component unmounts
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // If the query is not part of the suggestions, still allow custom input
    if (query && !suggestions.some((s) => s.name === query)) {
      onSelect({ name: query });
    }
  }, [query, suggestions]);

  return (
    <div className="relative autocomplete-container">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={`Search ${type}s...`}
        className="w-full p-2 border border-gray-300 rounded"
      />
      {isDropdownOpen && suggestions.length > 0 && (
        <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto z-10">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSelect(suggestion)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropDownInput;
