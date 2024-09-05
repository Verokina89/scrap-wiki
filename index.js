const express = require('express') //crear servidor
const axios = require('axios') //Hacer peticiones HTTP
const cheerio = require('cheerio') //Para parsear el HTTP
const http = require('http') //crear servido
const app = express()

const mainURL = 'https://es.wikipedia.org'
const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'

app.get('/', (req, res) => {
    axios.get(url).then((response) => {
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);

            const pageTitle = $('title').text();

            // Arr que guarda enlaces e imgs
            const links = [];
            const imgs = [];

            // Obtiene enlaces desde #mw-pages
            $('#mw-pages a').each((index, element) => {
                const link = $(element).attr('href'); // Obtener el atributo href de cada enlace
                links.push(link);
            });

            // Obtener imgs url principal
            $('img').each((index, element) => {
                const img = $(element).attr('src'); //Obtiene atributo src de cada img
                imgs.push(img);
            });

            // HTML con enlaces e imgs obtenidas
            res.send(`
              <h1>Páginas en la Categoria Músicos de Rap.</h1>
              <h2>Esta categoría contiene las siguientes páginas de Raperos:</h2>
              <ul>
                ${links.map(link => `<li><a href="${mainURL}${link}">${link}</a></li>`).join('')}
              </ul>
              <h2>Imágenes</h2>
              <ul>
                ${imgs.map(img => `<li><img src="${img}" alt="imagen"></li>`).join('')} 
              </ul>
            `);
        } else {
            res.send('No se pudo realizar la solicitud a la URL proporcionada.');
        }
    }).catch((error) => {
        console.error('Error al obtener los datos:', error);
        res.status(500).send('Error al realizar el scraping.')
    })
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`El Servidor está escuchando en el puerto http://localhost:${PORT}`);
})