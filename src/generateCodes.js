function consecutivo() {
  var codigo = "";
  for (var i = 0; i < 10; i++) {
    codigo += Math.floor(Math.random() * 10); // Genera un dígito aleatorio del 0 al 9 y lo concatena a la cadena
  }
  return codigo;
}

function seguridad() {
  var codigo = "";
  for (var i = 0; i < 8; i++) {
    codigo += Math.floor(Math.random() * 10); // Genera un dígito aleatorio del 0 al 9 y lo concatena a la cadena
  }
  return codigo;
}

module.exports = { consecutivo, seguridad };
