const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
const usersFile = path.join(__dirname, "users.json");
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([]));
}
const readUsers = () => JSON.parse(fs.readFileSync(usersFile));
const writeUsers = (users) => fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Введите имя пользователя и пароль." });
  }

  const users = readUsers();
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ error: "Имя пользователя уже занято." });
  }

  users.push({ username, password });
  writeUsers(users);

  return res.status(201).json({ message: "Пользователь успешно зарегистрирован." });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Введите имя пользователя и пароль." });
  }

  const users = readUsers();
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Неверные учетные данные." });
  }

  res.status(200).json({ message: "Вход выполнен успешно.", username });
});

app.get("/profile", (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(401).json({ error: "Вы не авторизованы. Войдите в систему." });
  }

  const users = readUsers();
  const userExists = users.some((u) => u.username === username);
  if (!userExists) {
    return res.status(404).json({ error: "Пользователь не найден." });
  }

  res.status(200).json({ message: `Добро пожаловать в профиль, ${username}.` });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});


