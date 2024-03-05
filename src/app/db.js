require('dotenv').config
const mysql = require('mysql2');

// Configuración de la conexión a MySQL
let db;

// Función para reconectar a la base de datos
function handleDisconnect() {
  db = mysql.createConnection({
    host: process.env.DATBASE_HOST ? process.env.DATBASE_HOST : "localhost",
    user: process.env.DATABASE_USERNAME
      ? process.env.DATABASE_USERNAME
      : "root",
    password: process.env.DATABASE_PASSWORD
      ? process.env.DATABASE_PASSWORD
      : "",
    database: "pineapplesea",
  });

  db.connect((err) => {
    if (err) {
      console.error('Error de MySQL:', err);
      setTimeout(handleDisconnect, 2000);
    }
  });

  db.on('error', (err) => {
    console.error('Error de MySQL:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

module.exports = { db, handleDisconnect }