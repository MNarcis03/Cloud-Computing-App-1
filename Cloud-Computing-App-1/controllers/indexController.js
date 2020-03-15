module.exports = function (req, res, fs, ejs, request, parse) {
    if (req.method === 'GET' && req.url === '/') {
        const file = __dirname + '/../views/index.ejs';

        ejs.renderFile(
            file,
            null,
            {
                client: true
            },
            (err, str) => {
                res.writeHead(
                    200,
                    {
                        'Content-Type': 'text/html'
                    }
                );
                res.end(str);
            }
        );
    }

    if (req.method === 'POST' && req.url === '/first') {
        request(
            "http://free.ipwhois.io/json/",
            {
                method: "GET"
            },
            (err, response, data) => {
                if (err) {
                    throw err;
                }

                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });

                res.end(data);
            }
        )
    }

    if (req.method === 'POST' && req.url === '/second') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let par = JSON.parse(Object.keys(parse(body))[0]);

            let lat = par.latitude;
            let long = par.longitude;

            // generate random number to get a random picture
            var randomNumber = Math.floor((Math.random() * 100) + 1);

            var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + process.env.API_KEY + "&lat=" + lat +
                "&lon=" + long + "&format=json" +
                "&per_page=" + randomNumber;

            request(
                url,
                {
                    method: "GET"
                },
                (err, response, data) => {
                    if (err) {
                        throw err;
                    }

                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });

                    res.end(data);
                }
            )
        });
    }

    if (req.method === 'POST' && req.url === '/third') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let par = JSON.parse(Object.keys(parse(body))[0]);
            let url = "https://api.imagga.com/v2/tags?image_url=" + par;

            let apiKey = 'acc_c666ec4fd20c212',
                apiSecret = 'e0abfdc1d846c3820a1def32a06f825d',
                imageUrl = 'https://docs.imagga.com/static/images/docs/sample/japan-605234_1280.jpg';

            request.get('https://api.imagga.com/v2/tags?image_url=' + encodeURIComponent(imageUrl), function (error, response, body) {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });

                res.end(body);
            }).auth(apiKey, apiSecret, true);
        });
    }
};