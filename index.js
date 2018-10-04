'use strict';

var express = require('express');
// const cors = require('cors');
var app = express();
var bodyParser = require('body-parser')

var cors = require('express-cross');

app.use(cors(true));

app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || 3200));

app.use(bodyParser.json());//parsea el cuerpo y lo trata como json
app.use(bodyParser.urlencoded({ extended: true }));

const server = require('http').createServer(app)

app.get('/test', function (req, res) {
  res.send('POST request to the homepage');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

const mongoose = require("mongoose");

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

app.post("/saveLocation",function(req,res){
    var location = new Location ({
        // IMEI:req.body.IMEI,
        // destination: req.body.destination,
        // lat:req.body.lat,
        // lng:req.body.lng,
        // state:req.body.state
        idIMEI:123456789,
        destination: "La valle 400",
        lat:12.123135,
        lng:312.132132,
        state: "activo"
    });

    location.save().then(function(us){
      res.send(doc);

    },function(err){
        if(err){
            res.send(String(err));
        }
    })

    res.send("save data");
});



app.post("/login",function(req,res){

    User.findOne({email:req.body.userName,password: req.body.password},'_id name  lastName  state  cel province locality',function(err,doc){// este metodo encuentra todos los documentos(objeto) que sea el email y pass que pasaste en array
        if(doc){
             res.send(doc)
        }else{
            res.send("No se encontro al Usuario");

        }
        if(err){
            res.send(String(err));
        }
    })

})
