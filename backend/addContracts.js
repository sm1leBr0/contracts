const axios = require("axios");
const faker = require("faker");
const FormData = require("form-data");
const fs = require("fs");

const tables = ["protect", "aig"]; // Add your actual table names here

const addContract = async (table, contractData) => {
  try {
    const form = new FormData();
    Object.keys(contractData).forEach((key) => {
      form.append(key, contractData[key]);
    });

    const response = await axios.post(
      `http://127.0.0.1:5000/api/${table}/add`,
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
      }
    );
    console.log(`Contract added to ${table}:`, response.data);
  } catch (error) {
    console.error(
      `Error adding contract to ${table}:`,
      error.response ? error.response.data : error.message
    );
  }
};

const generateContractData = () => {
  return {
    title: faker.company.catchPhrase(),
    description: faker.lorem.sentences(),
    counterparty: faker.company.companyName(),
    number: faker.datatype.number({ min: 1000, max: 9999 }),
    date: faker.date.past().toISOString().split("T")[0],
    end_date: faker.date.future().toISOString().split("T")[0],
    scope: faker.lorem.word(),
    performers: faker.name.findName(),
    file: fs.createReadStream("C:/Users/sm1le/Downloads/res.pdf"), // Adjust this to your actual file path if needed
  };
};

const addContractsToTables = async () => {
  console.log("Starting to add contracts...");
  for (const table of tables) {
    console.log(`Adding contracts to table: ${table}`);
    for (let i = 0; i < 10; i++) {
      const contractData = generateContractData();
      console.log(`Adding contract ${i + 1} to ${table}`);
      await addContract(table, contractData);
    }
  }
  console.log("Contracts added to all tables successfully");
};

addContractsToTables().catch((err) => {
  console.error("An error occurred:", err);
});
