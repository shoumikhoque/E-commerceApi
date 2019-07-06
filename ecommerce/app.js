"use strict";
var http = require("http");
var SwaggerExpress = require("swagger-express-mw");
var express = require("express");
var app = express();
var axios=require('axios')
var bodyParser = require("body-parser");
module.exports = app; // for testing
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
var config = {
  appRoot: __dirname // required config
};
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static(__dirname + "/"));
app.get("/", function(req, res) {
  getProductDetails("adc19c5317806fa3d21374dc63d4f2fa80f7cc64",function(data){
    if(data){
      res.render("pages/index", { user: JSON.stringify(data) });
    }
  })
  
   
});


SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) {
    throw err;
  }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 3000;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths["/hello"]) {
    console.log(
      "try this:\ncurl http://127.0.0.1:" + port + "/hello?name=Scott"
    );
  }
});





// apicall functions
function getProductDetails(productId,cb) {
  var p=new Promise(function (resolve,reject){
    axios.get('http://localhost:5000/products/'+productId)
   .then(function (response) {
    console.log(response.data);
    resolve(response.data)
  })
  })
  p.then(function(data){
    cb(data)
  })
  
}