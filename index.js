const express = require('express') //crear servidor
const axios = require('axios') //Hacer peticiones HTTP
const cheerio = require('cheerio') //Para parsear el HTTP
const http = require('http') //crear servido
const app = express()

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'

app.get('/', (req, res) => {
    axios.get(url).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html)

        const titleH1 = $('h1').text()

        //arr para guardar enlaces y las img
        const links = []
        const imgs = []

        //obtener enlaces desde #mw-pages
        $('#mw-pages a').each((index, element) => {
            const link = $(element).attr('href'); // Obtener atributo href de cada enlace
            links.push(link);
        });

        // Obtener las imgs de la url principal.
        $('img').each((index, element) => {
            const img = $(element).attr('src'); //Obtiene atributo src de cada imagen
            imgs.push(img);
        });

        
    })
})

server.listen(PORT, () => {
    console.log(`El Servidor está escuchando en el puerto http://localhost:${PORT}`);
})