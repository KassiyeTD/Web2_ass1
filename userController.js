const fs = require("fs");
const path = require("path");

const usersFile = path.join(__dirname, "users.json");

if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([]));
}

const readUsers = () => JSON.parse(fs.readFileSync(usersFile));
const writeUsers = (users) => fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

exports.getHomePage = (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
};

exports.getSignPage = (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Signin.html"));
};

exports.getLoginPage = (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Login.html"));
};

exports.getProfilePage = (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Profile.html"));
};

exports.registerUser = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Введите имя пользователя и пароль." });
  }
  const users = readUsers();
  if (users.some((user) => user.username === username)) {
    return res.status(409).json({ error: "Имя пользователя уже занято." });
  }
  users.push({ username, password });
  writeUsers(users);
  res.status(201).json({ message: "Пользователь успешно зарегистрирован." });
};

exports.loginUser = (req, res) => {
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
};

exports.getProfile = (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(401).json({ error: "Вы не авторизованы. Войдите в систему." });
  }
  const users = readUsers();
  if (!users.some((u) => u.username === username)) {
    return res.status(404).json({ error: "Пользователь не найден." });
  }
  res.status(200).json({ message: `Добро пожаловать в профиль, ${username}.` });
};
