'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");

app.use(cors(true));
app.options('*', cors());
app.use(bodyParser.json());//parsea el cuerpo y lo trata como json
app.use(bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.text({type: 'application/json'}) );
app.use(express.static('public'));

const server = require('http').createServer(app)
server.listen(process.env.PORT || 3100);

app.get('/test', function(req, res) {
  res.send('hello world');
});
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
