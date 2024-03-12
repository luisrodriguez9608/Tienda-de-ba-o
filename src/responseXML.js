const fs = require("fs");
const xml2js = require("xml2js");

function generarResponseXML(clave, orden_compra) {
  fs.readFile(__dirname + "/Response.xml", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo: ", err);
      return;
    }

    xml2js.parseString(data, (parseErr, result) => {
      if (parseErr) {
        console.error("Error al analizar XML: ", parseErr);
      }

      result.MensajeReceptor.Clave = [`${clave.clave}`];
      result.MensajeReceptor.NumeroCedulaEmisor = ["122223333"];
      result.MensajeReceptor.FechaEmisionDoc = [`${obtenerFechaHoraActual()}`];
      result.MensajeReceptor.Mensaje = ["2"];
      result.MensajeReceptor.DetalleMensaje = [`Ok`];
      result.MensajeReceptor.MontoTotalImpuesto = [`200000`];
      result.MensajeReceptor.TotalFactura = [`200000`];
      result.MensajeReceptor.NumeroCedulaReceptor = [`${orden_compra.cedula}`];
      result.MensajeReceptor.NumeroConsecutivoReceptor = [
        `${clave.consecutivo}`,
      ];

      const builder = new xml2js.Builder();
      const xml = builder.buildObject(result);

      fs.writeFile(__dirname + "/Response.xml", xml, (writeErr) => {
        if (writeErr) {
          console.error("Error al escribir el archivo:", writeErr);
          return;
        }
        console.log("Archivo XML modificado exitosamente.");
      });
    });
  });
}

function obtenerFechaHoraActual() {
  const fecha = new Date();
  const year = fecha.getFullYear();
  const month = ("0" + (fecha.getMonth() + 1)).slice(-2);
  const day = ("0" + fecha.getDate()).slice(-2);
  const hora = ("0" + fecha.getHours()).slice(-2);
  const minutos = ("0" + fecha.getMinutes()).slice(-2);
  const segundos = ("0" + fecha.getSeconds()).slice(-2);
  const zonaHorariaOffset = -fecha.getTimezoneOffset() / 60;
  const zonaHoraria =
    (zonaHorariaOffset >= 0 ? "+" : "-") +
    ("0" + Math.abs(zonaHorariaOffset)).slice(-2) +
    ":00";
  const fechaHoraFormateada = `${year}-${month}-${day}T${hora}:${minutos}:${segundos}${zonaHoraria}`;
  return fechaHoraFormateada;
}

module.exports = generarResponseXML;
