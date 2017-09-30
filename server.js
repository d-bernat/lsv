'use strict';

let express = require('express');
let morgan = require('morgan');
let mongoose = require('mongoose');

let app = express();
let port = process.env.port || 8080;
let router = express.Router();
let User = require('./app/models/user');
let path = require('path');
let bodyParser = require('body-parser');
let appRoutes = require('./app/routes/api')(router);

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.use('/api', appRoutes);

mongoose.connect('mongodb://localhost:27017/lsv', (err) => {
    if (err) {
        console.log('Not connected to database: ' + err);
    }
    else {
        console.log('Successfully connected to MongoDB');
    }
});

app.get('*', function(req, res) {
    res.charset = 'ISO-8859-1';
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


app.listen(port, () => {
    console.log('Running the server on port ' + port);
});
