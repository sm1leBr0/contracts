import React from "react";

const Form = ({
  handleSubmit,
  handleFileChange,
  handleInputChange,
  formData,
  handleCounterpartyChange,
  handlePerformersChange,
  handleCounterpartySelect,
  handlePerformerSelect,
  counterpartySuggestions,
  performerSuggestions,
  isUpdate,
}) => {
  const {
    title,
    description,
    numberOfContract,
    counterparty,
    performers,
    date,
    endDate,
    organisation,
  } = formData;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {isUpdate ? "Update Contract" : "Upload Contract"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
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
            value={numberOfContract}
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
            value={counterparty}
            onChange={handleCounterpartyChange}
            className="form-element"
          />
          <ul className="border border-gray-300 mt-1 max-h-32 overflow-auto">
            {counterpartySuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleCounterpartySelect(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <label htmlFor="performers">Performers</label>
          <input
            type="text"
            id="performers"
            name="performers"
            value={performers}
            onChange={handlePerformersChange}
            className="form-element"
          />
          <ul className="border border-gray-300 mt-1 max-h-32 overflow-auto">
            {performerSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handlePerformerSelect(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={handleInputChange}
            required
            className="form-element"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={endDate}
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
            value={description}
            onChange={handleInputChange}
            required
            className="form-element"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="file">Upload File</label>
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
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isUpdate ? "Update Contract" : "Upload Contract"}
        </button>
      </form>
    </div>
  );
};

export default Form;
