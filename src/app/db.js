require('dotenv').config
const mysql = require('mysql2');

// Configuración de la conexión a MySQL
let db;

// Función para reconectar a la base de datos
function handleDisconnect() {
  db = mysql.createConnection({
    host: process.env.DB_HOST ? process.env.DB_HOST : "localhost",
    user: process.env.DB_USR
      ? process.env.DB_USR
      : "root",
    password: process.env.DB_PWD
      ? process.env.DB_PWD
      : "1x6x-osq5-S719.()",
    database: process.env.DB ? process.env.DB : "pineapplesea",
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

handleDisconnect()

module.exports = db