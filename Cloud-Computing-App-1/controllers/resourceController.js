module.exports = function (req, res, fs) {
    if (req.url.includes('.css') && req.method === 'GET') {
        const path = __dirname + '/..' + req.url;

        fs.readFile(path, function (err, data) {
            if (err) {
                throw err;
            }

            res.writeHead(200, {
                "Content-Type": "text/css"
            });
            res.end(data);
        });
    }

    if (req.url.includes('.js') && req.method === 'GET') {
        const path = __dirname + '/..' + req.url;

        fs.readFile(path, function (err, data) {
            if (err) {
                throw err;
            }

            res.writeHead(200, {
                "Content-Type": "text/javascript"
            });
            res.end(data);
        });
    }

    if (req.url.includes('.svg') && req.method === 'GET') {
        const path = __dirname + '/..' + req.url;

        fs.readFile(path, function (err, data) {
            if (err) {
                throw err;
            }

            res.writeHead(200, {
                "Content-Type": "image/svg+xml"
            });
            res.end(data);
        });
    }

    if (req.url.includes('.png') && req.method === 'GET') {
        const path = __dirname + '/..' + req.url;

        fs.readFile(path, function (err, data) {
            if (err) {
                throw err;
            }

            res.writeHead(200, {
                "Content-Type": "image/png"
            });
            res.end(data);
        });
    }

    if (req.url.includes('.jpg') && req.method === 'GET') {
        const path = __dirname + '/..' + req.url;

        fs.readFile(path, function (err, data) {
            if (err) {
                throw err;
            }

            res.writeHead(200, {
                "Content-Type": "image/jpg"
            });
            res.end(data);
        });
    }

    if (req.url.includes('.jpeg') && req.method === 'GET') {
        const path = __dirname + '/..' + req.url;

        fs.readFile(path, function (err, data) {
            if (err) {
                throw err;
            }

            res.writeHead(200, {
                "Content-Type": "image/jpg"
            });
            res.end(data);
        });
    }

    if (req.url.includes('.gif') && req.method === 'GET') {
        const path = __dirname + '/..' + req.url;

        fs.readFile(path, function (err, data) {
            if (err) {
                throw err;
            }

            res.writeHead(200, {
                "Content-Type": "text/css"
            });
            res.end(data);
        });
    }
}