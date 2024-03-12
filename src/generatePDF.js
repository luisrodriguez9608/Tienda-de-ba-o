const fs = require("fs");
const { parse } = require("path");
const PDFDocument = require("pdfkit");
let subtotal = 0;
let total = 0;

function crearPDF(orden_compra) {
  const doc = new PDFDocument();
  doc.pipe(
    fs.createWriteStream(__dirname + "/Compra_PineAppleSea_Respuesta.pdf")
  );

  doc.image(__dirname + "/img/logo/logo.png", 25, -4);
  doc.moveDown();
  doc.text("------------Resumen de Compra------------")

  for (const [key, value] of Object.entries(orden_compra)) {
    if (!(key == "orden_productos")) {
      doc
        .font(__dirname + "/fonts/Roboto-Regular.ttf")
        .fontSize(10)
        .text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
      doc.moveDown();
    } else {
      const productos = JSON.parse(value);
      productos.forEach((producto, index) => {
        const precio = parseFloat(producto.precio);
        const cantidad = parseFloat(producto.cantidad);
        const productoSubtotal = precio * cantidad;
        subtotal += productoSubtotal;
        doc
          .font(__dirname + "/fonts/Roboto-Regular.ttf")
          .fontSize(10)
          .text(`Nombre: ${producto.nombre}`);
        doc.moveDown();
        doc
          .font(__dirname + "/fonts/Roboto-Regular.ttf")
          .fontSize(10)
          .text(`Precio unitario: ${producto.precio}`);
        doc.moveDown();
        doc
          .font(__dirname + "/fonts/Roboto-Regular.ttf")
          .fontSize(10)
          .text(`Cantidad: ${producto.cantidad}`);
        doc.moveDown();
      });
    }
  }

  doc
    .font(__dirname + "/fonts/Roboto-Regular.ttf")
    .fontSize(10)
    .text("------------Total de Compra------------");
  doc.moveDown();
  doc
    .font(__dirname + "/fonts/Roboto-Regular.ttf")
    .fontSize(10)
    .text(`Subtotal:                            ${subtotal}`);
  doc.moveDown();
  doc
    .font(__dirname + "/fonts/Roboto-Regular.ttf")
    .fontSize(10)
    .text(`Total:                            ${subtotal}`);
  doc.moveDown();

  /*
  for (let data in jsonify) {
    if (jsonify.hasOwnProperty(data) && typeof(data) != Array) {
      doc
        .font(__dirname + "/fonts/Roboto-Regular.ttf")
        .fontSize(10)
        .text(jsonify[data])
        .text(typeof(orden_compra));
      doc.moveDown();
    } else {
      doc
        .font(__dirname + "/fonts/Roboto-Regular.ttf")
        .fontSize(10)
        .text("Hola soy un array");
    }
  }
  */

  doc.end();
}

module.exports = crearPDF;
