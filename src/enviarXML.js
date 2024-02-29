const axios = require('axios');
const qs = require('querystring');

async function enviarXML(xmlFirmado, accessToken) {
    const postData = {
        comprobanteXml: xmlFirmado,
        client_id: 'api-stag',
        recp_numeroIdentificacion: '702110235',
        recp_tipoIdentificacion: '01',
        emi_numeroIdentificacion: '702110235',
        emi_tipoIdentificacion: '01',
        fecha: '2018-05-13T15:30:00-06:00',
        r: 'json',
        w: 'send',
        token: accessToken,
        clave: '50613051800070232071700100001011522773408107756348'
    };

    try {
        const response = await axios.post('http://155.138.238.173:8080/api.php', qs.stringify(postData), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.status === 200) {
            console.log('XML enviado correctamente:', response.data);
            return response.data;
        } else {
            throw new Error('Error al enviar el XML');
        }
    } catch (error) {
        throw new Error('Error al enviar el XML:', error);
    }
}

module.exports = enviarXML;
