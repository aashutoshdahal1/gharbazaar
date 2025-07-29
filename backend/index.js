const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5001;
app.use(express.json());
app.use(cors());

app.get("/try", (req, res) => {
  res.send({ msg: "Hello from GharBazaar Backend!" });
});

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
