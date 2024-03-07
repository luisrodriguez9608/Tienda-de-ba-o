const axios = require('axios');
const qs = require('querystring');

async function firmarXML(xmlGenerado) {
    try {
        //console.log('XML a firmar:', xml); // Agregar esta línea para verificar el contenido del XML

        const params = {
            inXml: xmlGenerado.xml,
            r: 'firmar',
            w: 'firmarXML',
            p12Url: '54594f1ad8ce69ce52956b5123e64e93',
            pinP12: '1234'
        };

        const response = await axios.post('http://155.138.238.173:8080/api.php', qs.stringify(params), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.status === 200) {
            //console.log('XML firmado:', response.data.resp.xmlFirmado);
            return response.data.resp;
        } else {
            throw new Error('Error al firmar el XML');
        }
    } catch (error) {
        throw new Error('Error al firmar el XML:', error);
    }
}

module.exports = firmarXML;
