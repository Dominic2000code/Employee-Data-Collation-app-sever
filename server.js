const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const db = require("./db/operations");

const { insertData, deleteEmptyRows, deleteDuplicates } = require("./index");

const app = express();
const PORT = process.env.PORT || 2000;
const upload = multer({ dest: "./Data/" });

app.use(cors());

app.get("/", function (req, res) {
  res.send("hello world");
});

app.post("/upload", upload.single("file"), function (req, res, next) {
  let fileType = req.file.mimetype.split("/")[1];
  const newFileName = `employees-csv.${fileType}`;
  //   console.log("filename:", newFileName);
  fs.rename(`./Data/${req.file.filename}`, `./Data/${newFileName}`, () => {
    console.log("file saved");
    insertData();
    res.send("200");
  });
});

app.get("/user-data", async (req, res) => {
  deleteEmptyRows();
  deleteDuplicates();
  const result = await db.getAllEmployees();
  res.status(200).json({ result });
});

app.listen(PORT, () => console.log(`app listening on port:${PORT}...`));
