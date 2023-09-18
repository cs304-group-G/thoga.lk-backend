const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT;

// middleware setup
app.use(cors());


// server listening to requests on port on env file
app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`);
  });