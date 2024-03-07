const axios = require('axios');

async function getToken() {
    try {
        const response = await axios.post('http://155.138.238.173:8080/api.php', null, {
            params: {
                w: 'token',
                r: 'gettoken',
                grant_type: 'password',
                client_id: 'api-stag',
                username: 'cpf-04-0231-0164@stag.comprobanteselectronicos.go.cr',
                password: 'q;#I%Ry;-ax7r}?.Ok%W'
            }
        });

        if (response.status === 200) {
            //console.log('Respuesta completa:', response.data);
            return response.data.resp.access_token;
        } else {
            throw new Error('Error al obtener el token');
        }
    } catch (error) {
        throw error;
    }
}

module.exports = getToken;
