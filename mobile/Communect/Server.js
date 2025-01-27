const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 8081;

// 中間ウェア
app.use(bodyParser.json());
app.use(cors());

// データベース接続
const db = mysql.createConnection({
  host: "127.0.0.1", // XAMPPのMySQL
  user: "root",
  password: "root",
  database: "communect",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("データベース接続エラー:", err);
    return;
  }
  console.log("データベースに接続しました！");
});

// APIルート: ユーザー登録
app.post("/register", (req, res) => {
  const { userName, nickname, password, email } = req.body;
  const apiKey = require("crypto").randomBytes(32).toString("hex");
  const query = "INSERT INTO user (userName, nickname, password, email, apikey) VALUES (?, ?, ?, ?, ?)";

  db.query(query, [userName, nickname, password, email, apiKey], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "ユーザー登録に失敗しました。" });
    } else {
      res.status(201).json({ message: "登録成功！", apiKey });
    }
  });
});

// APIルート: ログイン
app.post("/login", (req, res) => {
  const { userName, password } = req.body;
  const query = "SELECT * FROM user WHERE userName = ? AND password = ?";

  db.query(query, [userName, password], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "ログインに失敗しました。" });
    } else if (results.length > 0) {
      const user = results[0];
      res.status(200).json({ message: "ログイン成功！", apiKey: user.apikey });
    } else {
      res.status(401).json({ error: "ユーザー名またはパスワードが間違っています。" });
    }
  });
});

// APIルート: グループ作成
app.post("/groups", (req, res) => {
  const { groupTitle, aboveId } = req.body;
  const query = "INSERT INTO notice_group (groupTitle, aboveId) VALUES (?, ?)";

  db.query(query, [groupTitle, aboveId || null], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "グループ作成に失敗しました。" });
    } else {
      res.status(201).json({ message: "グループ作成成功！", groupId: result.insertId });
    }
  });
});

// その他API（投稿、通知など）を後ほど追加

// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://192.168.1.14:${PORT}`);
});
