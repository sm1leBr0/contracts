import React from "react";

const Form = ({
  handleSubmit,
  handleFileChange,
  handleInputChange,
  formData,
}) => {
  const {
    title,
    description,
    numberOfContract,
    counterparty,
    performers,
    date,
    endDate,
  } = { formData };
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
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
            value={performers}
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
            value={date}
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

export default Form;
