import React from "react";
import DropDownInput from "./DropDownInput";

const Form = ({
  handleSubmit,
  handleFileChange,
  handleInputChange,
  formData,
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
    condition,
    organisation,
  } = formData;

  const handlePerformerSelect = (performer) => {
    // Update the performers field with the selected performer's name
    handleInputChange({
      target: { name: "performers", value: performer.name },
    });
  };

  return (
    <div className="w-[500px] mx-auto">
      <div className=" bg-gray-300 p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {isUpdate ? "Редагувати контракт" : "Завантажити контракт"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title">Предмет</label>
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
            <label htmlFor="number">№ Договору</label>
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
          <div className="mb-2">
            <label>Контрагент</label>
            <DropDownInput
              onSelect={(selected) =>
                handleInputChange({
                  target: { name: "counterparty", value: selected.name },
                })
              }
              type="counterparty"
              defaultValue={counterparty}
            />
          </div>
          <div className="mb-2">
            <label>Відповідальний за виконання</label>
            <DropDownInput
              onSelect={(selected) =>
                handleInputChange({
                  target: { name: "performers", value: selected.name },
                })
              }
              type="performer"
              defaultValue={performers}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="date">Дата</label>
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
          <div className="mb-2">
            <label htmlFor="end_date">Дата закінчення</label>
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
          <div className="mb-2">
            <label htmlFor="condition">Стан</label>
            <input
              type="text"
              id="condition"
              name="condition"
              value={condition}
              onChange={handleInputChange}
              required
              className="form-element"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="description">Примітка</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleInputChange}
              className="form-element"
            ></textarea>
          </div>
          <div className="mb-2">
            <fieldset>
              <legend className="mb-2 text-lg font-semibold">
                Організація
              </legend>
              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="protect"
                    name="organisation"
                    value="protect"
                    checked={organisation === "protect"}
                    onChange={handleInputChange}
                    required
                    disabled={isUpdate}
                    className="form-radio"
                  />
                  <label htmlFor="protect" className="ml-2">
                    Protect
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="aig"
                    name="organisation"
                    value="aig"
                    checked={organisation === "aig"}
                    onChange={handleInputChange}
                    required
                    disabled={isUpdate}
                    className="form-radio"
                  />
                  <label htmlFor="aig" className="ml-2">
                    AIG
                  </label>
                </div>
              </div>
            </fieldset>
          </div>

          <div className="mb-4">
            <label htmlFor="file">Файл</label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              className="form-element"
            />
          </div>
          <button
            type="submit"
            className="inline-block justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isUpdate ? "Редагувати" : "Додати"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
