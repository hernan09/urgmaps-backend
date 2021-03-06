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
    nameAddress: String,
    lat:Number,
    lng:Number
});

var locationIndom_schema = new Schema({
    idIMEI:String,
    nameAddress: String,
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
    ambulance:String,
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


var patient_schema = new Schema({
    idIMEI:String,
    ambulance:String,
    cel:Number,
    patent:String,
    driver:String,
    state:String
  })

var emergencyIndom_schema = new Schema({
    idIMEI:String,
    positionInitial:Array,
    positionFinal:Array,
    timeDear:String,
    timeElapsed:String,
    takenTravel:Array,
    estimatedTravel:Array
})

//nuevo prototipo urg maps
var saveLocation_schema = new Schema({
  imei: Number,
  latitude:Number,
  longitude:Number,
  dataAndTime: String,
  state:String,
  address:String,
})



var User = mongoose.model("User",user_schema);

/*urg*/
var Location = mongoose.model("Location",location_schema);
var Ambulance = mongoose.model("Ambulance",ambulance_schema);

/*indom*/
var LocationIndom = mongoose.model("LocationIndom",locationIndom_schema);
var Patient = mongoose.model("Patient",patient_schema);
var EmergencyIndom = mongoose.model("EmergencyIndom",emergencyIndom_schema);

//nuevo prototipo
var PositionEmergency = mongoose.model("PositionEmergency",saveLocation_schema);

/*****/
app.post("/saveLocation",function(req,res){
  console.log("IMEI",req.body.IMEI)
  Ambulance.findOne({idIMEI:req.body.IMEI},'_id state',function(err,doc){// este metodo encuentra todos los documentos(objeto) que sea el email y pass que pasaste en array
      if(doc){
           // res.send(doc)
           console.log("state",doc.state == 'Activo');
           if (doc.state == 'Activo') {
             var location = new Location ({
                 idIMEI:req.body.IMEI,
                 nameAddress: req.body.nameAddress,
                 lat:req.body.lat,
                 lng:req.body.lng
             });

             location.save().then(function(us){
               res.send(us);
               console.log("doc._id",doc._id);
               // Ambulance.update({_id:doc._id},{state: "Inactivo"},function(err,doc){// este metodo encuentra todos los documentos(objeto) que sea el email y pass que pasaste en array
               //     if(doc){
               //       console.log("update",doc);
               //      res.send(doc);
               //     }else{
               //         res.send("No se pudo actualizar estado");
               //     }
               // })

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




app.post("/saveLocationIndom",function(req,res){
  console.log("IMEI",req.body.IMEI)
  Ambulance.findOne({idIMEI:req.body.IMEI},'_id state',function(err,doc){// este metodo encuentra todos los documentos(objeto) que sea el email y pass que pasaste en array
      if(doc){
           // res.send(doc)
           console.log("state",doc.state == 'Activo');
           if (doc.state == 'Activo') {
             var locationIndom = new LocationIndom ({
                 idIMEI:req.body.IMEI,
                 nameAddress: req.body.nameAddress,
                 lat:req.body.lat,
                 lng:req.body.lng
             });

             locationIndom.save().then(function(us){
               res.send(us);
               console.log("doc._id",doc._id);
               // Ambulance.update({_id:doc._id},{state: "Inactivo"},function(err,doc){// este metodo encuentra todos los documentos(objeto) que sea el email y pass que pasaste en array
               //     if(doc){
               //       console.log("update",doc);
               //      res.send(doc);
               //     }else{
               //         res.send("No se pudo actualizar estado");
               //     }
               // })

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

//nuevo prototipo

app.post("/emergencyPlace",function(req,res){
    var location = new PositionEmergency ({
      imei: req.body.imei,
      latitude:req.body.latitude,
      longitude:req.body.longitude,
      dataAndTime: req.body.dataAndTime,
      state:req.body.state,
      address: req.body.address
    });

    location.save().then(function(us){
    res.send(us);

    },function(err){
        if(err){
            res.send(String(err));
        }
    })
});

app.post("/getLocationEmergency",function(req,res){
    PositionEmergency.find(function(err,doc){// trae todos los registros del documento
        console.log(doc);
        res.send(doc);
    });
});

app.post("/putLocationEmergency",function(req,res){
  console.log("IMEI",req.body.id)
  PositionEmergency.findOne({_id:req.body.id},'_id state',function(err,doc){// este metodo encuentra todos los documentos(objeto) que sea el email y pass que pasaste en array
      if(doc){
           console.log("update",doc);
           if (doc.state == 'Pending') {

             PositionEmergency.update({_id:doc._id},{state: "Processed"},function(err,doc){// este metodo encuentra todos los documentos(objeto) que sea el email y pass que pasaste en array
                 if(doc){
                   console.log("update",doc);
                   res.send(doc);
                 }else{
                    res.send("No se pudo actualizar estado");
                 }
             })

           }else {
             res.send("No esta activo por el momento");
           }
      }else{
        console.log("No se encontro IMEI")
          res.send("No se encontro IMEI");
      }
      if(err){
          res.send(String(err));
      }
  })

});

/*------------------------------*/

app.post("/saveAmbulance",function(req,res){
    var ambulance = new Ambulance ({
      idIMEI:req.body.idIMEI,
      cel:req.body.cel,
      ambulance:req.body.ambulance,
      patent:req.body.ambulance,
      driver: req.body.driver,
      state:req.body.state
    });

    ambulance.save().then(function(us){
      res.send(us);

    },function(err){
        if(err){
            res.send(String(err));
        }
    })
});
app.post("/savePatient",function(req,res){
    var patient = new Patient ({
      idIMEI:req.body.idIMEI,
      cel:req.body.cel,
      ambulance:req.body.ambulance,
      patent:req.body.ambulance,
      driver: req.body.driver,
      state:req.body.state
    });

    patient.save().then(function(us){
      res.send(us);

    },function(err){
        if(err){
            res.send(String(err));
        }
    })
});

app.post("/login",function(req,res){
    console.log("USER",req.body);
    User.findOne({name:req.body.name.toLowerCase()},'_id name  lastName  cel  dni idIMEI ambulance',function(err,doc){// este metodo encuentra todos los documentos(objeto) que sea el email y pass que pasaste en array
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

app.post("/getDataAmbulance",function(req,res){
  Ambulance.find(function(err,doc){// este metodo encuentra todos los documentos(objeto) que sea el email y pass que pasaste en array
      console.log(doc);
      res.send(doc);
  })
})
