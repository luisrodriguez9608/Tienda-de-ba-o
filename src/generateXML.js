const axios = require("axios");
const rellenar_detalle = require("./detalleFactura");

function codigo_actividad() {
  var codigo = "";
  for (var i = 0; i < 6; i++) {
    codigo += Math.floor(Math.random() * 10); // Genera un dígito aleatorio del 0 al 9 y lo concatena a la cadena
  }
  return codigo;
}

async function generateXML(clave, orden_compra) {
  const postData = new URLSearchParams();
  postData.append("w", "genXML");
  postData.append("r", "gen_xml_fe");
  postData.append("clave", clave.clave);
  postData.append("codigo_actividad", codigo_actividad());
  postData.append("consecutivo", clave.consecutivo);
  postData.append("fecha_emision", new Date());
  postData.append("emisor_nombre", "PineApple Sea");
  postData.append("emisor_tipo_identif", "01");
  postData.append("emisor_num_identif", "122223333");
  postData.append("nombre_comercial", "PineApple Sea");
  postData.append("emisor_provincia", "6");
  postData.append("emisor_canton", "02");
  postData.append("emisor_distrito", "03");
  postData.append("emisor_barrio", "01");
  postData.append("emisor_otras_senas", "Avenida Pastór Díaz");
  postData.append("emisor_cod_pais_tel", "506");
  postData.append("emisor_tel", "87367898");
  postData.append("emisor_cod_pais_fax", "506");
  postData.append("emisor_fax", "00000000");
  postData.append("emisor_email", "pineapplesea@gmail.com");
  postData.append(
    "receptor_nombre",
    orden_compra.nombre + " " + orden_compra.apellido
  );
  postData.append("receptor_tipo_identif", "01");
  postData.append("receptor_num_identif", orden_compra.cedula);
  postData.append("receptor_provincia", "6");
  postData.append("receptor_canton", "02");
  postData.append("receptor_distrito", "03");
  postData.append("receptor_barrio", "01");
  postData.append("receptor_cod_pais_tel", "506");
  postData.append("receptor_tel", orden_compra.telefono);
  postData.append("receptor_cod_pais_fax", "506");
  postData.append("receptor_fax", "00000000");
  postData.append("receptor_email", orden_compra.correo);
  postData.append("condicion_venta", "01");
  postData.append("plazo_credito", "30");
  postData.append("medios_pago", JSON.stringify([{ codigo: "01" }]));
  postData.append("cod_moneda", "CRC");
  postData.append("tipo_cambio", "502");
  postData.append("total_serv_gravados", "0");
  postData.append("total_serv_exentos", orden_compra.total);
  postData.append("total_merc_gravada", "0");
  postData.append("total_merc_exenta", "0");
  postData.append("total_gravados", "0");
  postData.append("total_exentos", orden_compra.total);
  postData.append("total_ventas", orden_compra.total);
  postData.append("total_descuentos", "100");
  postData.append("total_ventas_neta", orden_compra.total);
  postData.append("total_impuestos", "0");
  postData.append("total_comprobante", orden_compra.map(productos, () => {
    productos.precio * productos.cantidad
  }));
  postData.append("otros", "Muchas gracias");
  postData.append(
    "detalles",
    JSON.stringify(rellenar_detalle(orden_compra.orden_productos))
  );
  //console.log(JSON.stringify(rellenar_detalle(orden_compra.orden_productos)));
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const response = await axios.post(
      "http://155.138.238.173:8080/api.php",
      postData,
      config
    );
    // Retornar el XML generado en lugar de solo imprimirlo
    //console.log("Generación del XML:", response.data.resp);
    return response.data.resp;
  } catch (error) {
    console.error("Error al generar el XML:", error);
    throw error;
  }
}

module.exports = generateXML;
