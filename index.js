'use strict';

var express = require('express');
// const cors = require('cors');
var app = express();
var bodyParser = require('body-parser')

var cors = require('express-cross');

app.use(cors(true));
app.options('*', cors())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Expose-Headers', 'Access-Control-*, Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

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
    idIMEI:String,
    destination: String,
    lat:Number,
    lng:Number
});

var user_schema = new Schema({
  name:String,
  lastName:String,
  cel:Number,
  dni:String,
  password:String,
  idIMEI:String,
  ambulance:String
})

var ambulance_schema = new Schema({
    idIMEI:String,
    cel:Number,
    patent:String,
    driver:String,
    state:String
  })

var emergency_schema = new Schema({
    idIMEI:String,
    positionInitial:Array,
    positionFinal:Array,
    timeDear:String,
    timeElapsed:String,
    takenTravel:Array,
    estimatedTravel:Array
})

var Location = mongoose.model("Location",location_schema);
var User = mongoose.model("User",user_schema);
var Ambulance = mongoose.model("Ambulance",ambulance_schema);

app.post("/saveLocation",function(req,res){
  console.log("IMEI",req.body.IMEI)
  Ambulance.findOne({idIMEI:req.body.IMEI},'_id state',function(err,doc){// este metodo encuentra todos los documentos(objeto) que sea el email y pass que pasaste en array
      if(doc){
           // res.send(doc)
           console.log("state",doc.state == 'Activo');
           if (doc.state == 'Activo') {
             var location = new Location ({
                 idIMEI:req.body.IMEI,
                 destination: req.body.destination,
                 lat:req.body.lat,
                 lng:req.body.lng
             });

             location.save().then(function(us){
               // res.send(us);
               console.log("doc._id",doc._id);
               Ambulance.update({_id:doc._id},{state: "Inactivo"},function(err,doc){// este metodo encuentra todos los documentos(objeto) que sea el email y pass que pasaste en array
                   if(doc){
                     console.log("update",doc);
                    res.send(doc);
                   }else{
                       res.send("No se pudo actualizar estado");
                   }
               })

             },function(err){
                 if(err){
                     res.send(String(err));
                 }
             });
           }else {
             res.send("No esta activo por el momento");
           }
      }else{
          res.send("No se encontro IMEI");
      }
      if(err){
          res.send(String(err));
      }
  })

});

app.post("/saveUser",function(req,res){
    var user = new User ({
      name:"admin",
      lastName:"test",
      cel:12321321,
      dni:"12345678",
      password:"123",
      idIMEI:"1234e",
      ambulance:"abc123"
    });

    user.save().then(function(us){
      res.send(us);

    },function(err){
        if(err){
            res.send(String(err));
        }
    })
});

app.post("/saveAmbulance",function(req,res){
    var ambulance = new Ambulance ({
      idIMEI:"12345678e",
      cel:"1154112906",
      ambulance:"abc123",
      driver: "Emiliano Insfran",
      state:"Activo"
    });

    ambulance.save().then(function(us){
      res.send(us);

    },function(err){
        if(err){
            res.send(String(err));
        }
    })
});

app.post("/login",function(req,res){
    console.log("USER",req.body);
    User.findOne({name:req.body.name.toLowerCase() ,password: req.body.password},'_id name  lastName  cel  dni idIMEI ambulance',function(err,doc){// este metodo encuentra todos los documentos(objeto) que sea el email y pass que pasaste en array
        if(doc){
             res.send(doc)
        }else{
            res.send("Usuario y/o contraseña incorrectos");

        }
        if(err){
            res.send(String(err));
        }
    })

})
