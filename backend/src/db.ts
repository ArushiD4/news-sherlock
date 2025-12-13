import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "sql@a4",   
  database: "news_sherlock",
});
