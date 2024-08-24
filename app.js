const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) {
      alert(err);
    } else {
      res.render("index", { filename: files });
    }
  });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/create/add", (req, res) => {
  const CDate = new Date();
  var currentDate =
    CDate.getDate() + "-" + (CDate.getMonth() + 1) + "-" + CDate.getFullYear();
  fs.writeFile(
    `./files/${currentDate} ${req.body.filename}.txt`,
    req.body.data,
    (err, data) => {
      if (err) {
        alert(err);
      } else res.redirect("/");
    }
  );
});

app.get("/delete/:filename", (req, res) => {
  const filename = req.params.filename;
  fs.unlink(`./files/${filename}`, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error deleting file");
    } else {
      res.send(
        "<script>alert('File deleted successfully!'); window.location.href = '/';</script>"
      );
    }
  });
});

app.get("/read/:filename", (req, res) => {
  let filename = req.params.filename;

  let data = fs.readFileSync(`./files/${filename}`, {
    encoding: "utf-8",
  });
  res.render("read", { data, filename });
});

app.get("/update/:filename", (req, res) => {
  let filename = req.params.filename;
  let data = fs.readFileSync(`./files/${filename}`, {
    encoding: "utf-8",
  });
  res.render("update", { data, filename });
});

app.post("/update/:filename/add", (req, res) => {
  fs.writeFileSync(`./files/${req.params.filename}`, req.body.newdata);
  res.redirect("/");
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
