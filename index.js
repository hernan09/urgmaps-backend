'use strict';

var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
var app = express();
const server = require('http').createServer(app)
var mongoose = require("mongoose");


//Access permits
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(cors(true));
app.options('*', cors());

app.use(express.static('public'));

server.listen(process.env.PORT || 8080);

app.use(bodyParser.json());//parsea el cuerpo y lo trata como json
app.use( bodyParser.text({type: 'application/json'}) );
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://cdtURG:cdt.desa.3.123@ds117623.mlab.com:17623/urgmaps", { useNewUrlParser: true });
var Schema = mongoose.Schema;

mongoose.connection.on('connected', function () {
  console.log('Mongoose CONECTADO ' );
});


// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose ERROR: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose DESCONECTADO');
})

var location_schema = new Schema({
    idIMEI:Number,
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

app.get('/test', function(req, res) {
  res.send('hello world');
});
