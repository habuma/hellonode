var express = require('express');
require('dotenv').config({path: '/Users/cwalls/configtree/.env'});

const serverPort = process.env.SERVER_PORT ?? 8080;

var app = express();

app.get('/hello', function (req, res) {
    const greeting = process.env.GREETING_MESSAGE ?? 'Hello world';
    res.send(greeting);
});

app.listen(serverPort, function () {
    console.log(`Hello ACS Application running on port ${serverPort}!`);
});