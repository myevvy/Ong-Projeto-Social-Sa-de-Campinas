<<<<<<< HEAD
import "../../config/env.js";
import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: process.env.BD_HOST,
  port: process.env.BD_PORT,
  user: process.env.BD_USER,
  password: process.env.BD_PASSWORD,
  database: process.env.BD_DATABASE,
  dateStrings: true,

  ssl:{
    rejectUnauthorized: false
  }
});

export default connection;
=======
import "../../config/env.js";
import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: process.env.BD_HOST,
  port: process.env.BD_PORT,
  user: process.env.BD_USER,
  password: process.env.BD_PASSWORD,
  database: process.env.BD_DATABASE,
  dateStrings: true,

  ssl:{
    rejectUnauthorized: false
  }
});

export default connection;
>>>>>>> 243349fa0ecf6a0c470b6b76a51c056c34ebd974
