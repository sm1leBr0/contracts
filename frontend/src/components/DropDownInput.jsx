import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const DropDownInput = ({ onSelect, type, defaultValue = "" }) => {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
  const containerRef = useRef(null);

  // Update query when defaultValue changes
  useEffect(() => {
    setQuery(defaultValue);
    setSuggestions([]); // Clear suggestions
    setIsDropdownOpen(false); // Open dropdown initially
  }, [defaultValue]);

  // Fetch suggestions based on the query
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/aig/${type}/search`,
          {
            params: { query: query || "" }, // Pass empty query to get all items if query is empty
          }
        );
        const data = Array.isArray(response.data) ? response.data : [];
        setSuggestions(data);
        // Open the dropdown if there are suggestions
        setIsDropdownOpen(false);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setIsDropdownOpen(false); // Close dropdown on error
      }
    };

    fetchSuggestions();
  }, [query, type]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Open the dropdown when there is input or focus on the field
  const handleChange = (e) => {
    setQuery(e.target.value);
    setIsDropdownOpen(true); // Open dropdown when there is input
  };

  // Open the dropdown when the input field gains focus
  const handleFocus = () => {
    setIsDropdownOpen(true);
  };

  // Handle selection of a suggestion
  const handleSelect = (suggestion) => {
    setQuery(suggestion.name);
    onSelect(suggestion); // Pass selected item to the parent
    setSuggestions([]);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  // Handle custom input when the input field loses focus
  const handleBlur = () => {
    if (query && !suggestions.some((s) => s.name === query)) {
      const customSuggestion = { id: query, name: query };
      onSelect(customSuggestion);
    }
  };

  return (
    <div className="relative autocomplete-container" ref={containerRef}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={handleFocus} // Open dropdown on focus
        onBlur={handleBlur} // Handle custom input on blur
        placeholder={`Search ${type}s...`}
        className="w-full p-2 border border-gray-300 rounded"
      />
      {isDropdownOpen && suggestions.length > 0 && (
        <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto z-10">
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
