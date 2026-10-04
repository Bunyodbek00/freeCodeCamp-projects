import express from "express";
import cors from "cors";
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Do not change code above this line

app.get(["/api/", "/api/:date"], (req, res) => {
  const dateParam = req.params.date;

  let date;
  if (!dateParam) {
    date = new Date();
  } else if (!isNaN(dateParam)) {
    date = new Date(Number(dateParam));
  } else {
    date = new Date(dateParam);
  }

  if (isNaN(date.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

// Do not change code below this line

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
