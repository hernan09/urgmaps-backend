'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var cors = require('express-cross');


//Access permits
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(cors(true));

app.use(express.static('public'));

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());//parsea el cuerpo y lo trata como json
app.use( bodyParser.text({type: 'application/json'}) );
app.use(bodyParser.urlencoded({ extended: true }));

var Schema = mongoose.Schema;
// var User = require("./user").User;
mongoose.connect("mongodb://cdt URG:cdt.desa.3.123@ds117623.mlab.com:17623/urgmaps");

mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
})

var location_schema = new Schema({
    IMEI:Number,
    destination: String,
    lat:Number,
    lng:Number,
    state:String
})


var Location = mongoose.model("Location",location_schema);


app.post("/sendMessageLocation",function(req,res){
    var location = new Location ({
        IMEI:req.body.IMEI,
        destination: req.body.destination,
        lat:req.body.lat,
        lng:req.body.lng,
        state:req.body.state
    });

    location.save().then(function(us){
      res.send(doc);

    },function(err){
        if(err){
            res.send(String(err));
        }
    })
})
