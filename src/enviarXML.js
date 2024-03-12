const axios = require('axios');
const qs = require('querystring');

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

async function enviarXML(xmlFirmado, accessToken, clave) {
    const postData = {
        comprobanteXml: xmlFirmado,
        client_id: 'api-stag',
        recp_numeroIdentificacion: '702110235',
        recp_tipoIdentificacion: '01',
        emi_numeroIdentificacion: '702110235',
        emi_tipoIdentificacion: '01',
        fecha: obtenerFechaHoraActual(),
        r: 'json',
        w: 'send',
        token: accessToken,
        clave: clave
    };

    try {
        const response = await axios.post('http://155.138.238.173:8080/api.php', qs.stringify(postData), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.status === 200) {
            console.log('Respuesta del XML enviado: ', response.data);
            return response.data;
        } else {
            throw new Error('Error al enviar el XML');
        }
    } catch (error) {
        throw new Error('Error al enviar el XML:', error);
    }
}

module.exports = enviarXML;
