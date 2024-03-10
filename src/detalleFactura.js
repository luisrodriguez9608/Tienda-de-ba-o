//const detalle = new Object()
function rellenar_detalle(orden_productos) {
  const detalle = {};

  let productosObject = JSON.parse(orden_productos)
  let index = 1  
  
  productosObject.forEach((productos) => {
    detalle[index++] = {
      //codigo: codigo_detalle(),
      //codigoComercial: { 1: { tipo: "441", codigo: "57" } },
      cantidad: productos.cantidad,
      unidadMedida: "Unid",
      detalle: productos.nombre,
      precioUnitario: productos.precio,
      montoTotal: productos.precio * productos.cantidad,
      descuento: [{ montoDescuento: "3", naturalezaDescuento: "Promoción fin de año" },],
      subtotal: productos.precio * productos.cantidad,
      impuesto: { 1: { codigo: "01", codigoTarifa: "08", tarifa: "13", monto: "1.3" },},
      montoTotalLinea: "18.3",
    };
  });
  console.log(detalle)
  return detalle;
}

function codigo_detalle() {
  var codigo = "";
  for (var i = 0; i < 3; i++) {
    codigo += Math.floor(Math.random() * 10); // Genera un dígito aleatorio del 0 al 9 y lo concatena a la cadena
  }
  return codigo;
}

module.exports = rellenar_detalle;
