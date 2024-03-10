const {consecutivo, seguridad} = require('./generateCodes')

const axios = require('axios');

async function getClave() {
const data = new URLSearchParams();
    data.append('w', 'clave')
    data.append('r', 'clave')
    data.append('tipoCedula', 'fisico')
    data.append('cedula', '199999999')
    data.append('situacion', 'normal')
    data.append('codigoPais', '506')
    data.append('consecutivo', consecutivo())
    data.append('codigoSeguridad', seguridad())
    data.append('tipoDocumento', 'FE')

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    try {
        const response = await axios.post('http://155.138.238.173:8080/api.php', data, config);
        //console.log('Generación clave: ', response.data.resp);
        return response.data.resp;
    } catch (error) {
        console.error('Error al generar el XML:', error);
        throw error;
    }
}

module.exports = getClave