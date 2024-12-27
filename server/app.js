const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const {
  getHomePage,
  getSignPage,
  getLoginPage,
  getProfilePage,
  registerUser,
  loginUser,
  getProfile,
} = require("./userController");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Указываем правильный путь к папке public
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", getHomePage);
app.get("/sign", getSignPage);
app.get("/login", getLoginPage);
app.get("/profile", getProfilePage);
app.post("/register", registerUser);
app.post("/login", loginUser);
app.get("/profile", getProfile);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
