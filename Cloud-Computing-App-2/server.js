const http = require('http');
const mongoose = require('mongoose');
const url = require('url');
const fs = require('fs');

// Settings
const hostname = '127.0.0.1';
const port = 3030;

// DB
mongoose.connect('mongodb://localhost:27017/tests', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const racerModel = require('./models/racerModel');
const categoryModel = require('./models/categoryModel');
const models = {
    racerModel: racerModel(mongoose),
    categoryModel: categoryModel(mongoose)
};

const mainController = require('./mainController');

// Server
const server = http.createServer((req, res) => {
    mainController(req, res, models, url);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});