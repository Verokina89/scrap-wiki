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
    
            // Extraer el texto del h1
            const h1 = $('h1').text();
            console.log("Título H1:", h1); // Imprimir en la terminal

            // Arr que guarda enlaces e imgs
            const links = []
            const imgs = []
            const texts = []

            // Obtiene enlaces desde #mw-pages
            $('#mw-pages a').each((index, element) => {
                const link = $(element).attr('href'); // Obtener el atributo href de cada enlace
                const text = $(element).text() //texto visible del enlace
                links.push({ name: text, url: `${mainURL}${link}`})
                console.log("Enlace:", link, "Texto:", text); //Imprime en la terminal
            })

            // Obtener imgs url principal
            $('img').each((index, element) => {
                const img = $(element).attr('src'); //Obtiene atributo src de cada img
                imgs.push(img);
                console.log("Imagen:", img); //Imprime en la terminal
            });

            $('p').each((index, element) => {
                const p = $(element).text(); //Obtiene atributo src de cada 'p'
                texts.push(p);
                console.log("Párrafo:", p); // Imprimir en la terminal
            });
            
            //orden alfabetico.
            const sortLinks = links.sort((a, b) => a.name.localeCompare(b.name))
            
            // Agrupar los enlaces por la letra inicial
            const allLinks = sortLinks.reduce((acc, current) => {
                const firstLetter = current.name.charAt(0).toUpperCase();
                if (!acc[firstLetter]) {
                    acc[firstLetter] = []
                }
                acc[firstLetter].push(current)
                return acc
            }, {})

            //imprime HTML ordenado
            let htmlOutput = `
            <h1>${h1}</h1>
            <p>${texts}</p>`

            for (const firstLetter in allLinks) {
                htmlOutput += `<h3>${firstLetter}</h3><ul>`
                allLinks[firstLetter].forEach(link => {
                    htmlOutput += `<li><a href="${link.url}">${link.name}</a></li>`;
                });
                htmlOutput += `</ul>`
            }

            res.send(htmlOutput) //respuesta con el HTML generado

        } else {
            res.send('No se pudo realizar la solicitud a la URL')
        }

    }).catch((error) => {
        console.error('Error al obtener los datos:', error);
        res.status(500).send('Error al realizar el scraping.');
    });  
      
    return {}
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`El Servidor está escuchando en el puerto http://localhost:${PORT}`);
})