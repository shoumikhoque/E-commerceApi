// "use strict";
var http = require("http");
var SwaggerExpress = require("swagger-express-mw");
var express = require("express");
var app = express();
var axios = require("axios");
var bodyParser = require("body-parser");
var sha256 = require('js-sha256');
var cookieParser = require('cookie-parser');
var cookieOptions = {
  signed: true,
  maxAge: 3000000
};
app.use(cookieParser('prime'));
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
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static(__dirname + "/views/images"));
console.log(__dirname);

app.use(express.static(__dirname + "/"));
app.get("/", function (req, res) {
  var user = req.signedCookies.user


  // var product = {
  //   name: "Tesla_Model_3",
  //   qty: 102,
  //   productId: "9102057051adbbde0c92aa69a96cbaa80b09a332"
  // };

  // putProduct(product,2,(data)=>{
  //   if(data){
  //     res.render("pages/index", { user: JSON.stringify(data) });
  //   }
  // })
  // sendOneProduct(product.productId, (data) => {
  //   if (data) {
  //     console.log(data);

  //     res.render("pages/index", { user: JSON.stringify() });
  //   }
  // });

  // loginUser("shoumik@gmail.com", data => {
  //   if (data) {
  //     res.render("pages/index", { user: JSON.stringify(data) });
  //   }
  // });


  // registerUser(form,(data)=>{
  //   if(data){
  //     res.render("pages/index", { user: JSON.stringify(data) });
  //   }

  //  })
  getAllProducts((data) => {
    if (data) {
      console.log();
      var details = req.signedCookies.details;
      if (details) {
        details.products = data
      } else {
        var details = {
          products: data
        }
      }
      res.cookie('details', details, cookieOptions)
      res.render("pages/index", {
        details: details
      });
    }
  })
  // getAllProducts(data => {
  //   if (data) {
  //     res.render("pages/index", { products: JSON.stringify(data) });
  //   }
  // });
  // getProductDetails("adc19c5317806fa3d21374dc63d4f2fa80f7cc64",function(data){

  // })


  // res.render("pages/index")



  // res.render("pages/index");


});
app.post("/signin", (req, res) => {
  var user = req.signedCookies.user
  console.log("from cookie: " + user.name);

  var form = {
    name: req.body.name,
    email: req.body.email,
    pass: req.body.pass,
    contact: req.body.contact,
    address: req.body.address
  }


  // console.log(form);
  // Cookies that have not been signed

  registerUser(form, (user) => {
    console.log("user: ", user);

    if (user) {

      var details = req.signedCookies.details;
      if (details) {
        details.user = user
      } else {
        var details = {
          user: user
        }
      }
      res.cookie('details', details, cookieOptions)
      res.render("pages/index", {
        details: details
      });

    }
  })
})
app.post("/login", (req, res) => {
  var details = req.signedCookies.details;
  var email = req.body.email
  var pass = sha256(req.body.pass)
  if(details.user){
    if (details.user.email!==email && details.user.pass!==pass) {
      loginUser(email, (user) => {
        if (user) {
          console.log(user);
          if (pass === user.pass) {
            details.user=user
            res.cookie('details', details, cookieOptions)
            res.render("pages/index", {
              details: details
            });
          }
        }
      })
    }
  }
  else{
    loginUser(email, (user) => {
      if (user) {
        console.log(user);
        if (pass === user.pass) {
          details.user=user
          res.cookie('details', details, cookieOptions)
          res.render("pages/index", {
            details: details
          });
        }
      }
    })
  }
  

})


// apicall functions
function getProductDetails(productId, cb) {
  var p = new Promise(function (resolve, reject) {
    axios
      .get("http://localhost:5000/products/" + productId)
      .then(function (response) {
        console.log(response.data);
        resolve(response.data);
      });
  });
  p.then(function (data) {
    cb(data);
  });
}

function getAllProducts(cb) {
  var p = new Promise(function (resolve, reject) {
    axios.get("http://localhost:5000/products/").then(function (response) {
      console.log(response.data);
      resolve(response.data);
    });
  });
  p.then(function (data) {
    cb(data);
  });
}

function registerUser(data, cb) {
  console.log(data);

  var p = new Promise(function (resolve, reject) {
    axios.post("http://localhost:3000/reg", data).then(function (response) {
      console.log(response.data);
      resolve(response.data);
    });
  });
  p.then(function (data) {
    console.log(data);
    cb(data);
  });
}

function loginUser(email, cb) {
  var p = new Promise(function (resolve, reject) {
    axios.get("http://localhost:3000/login/" + email).then(function (response) {
      console.log(response.data);
      resolve(response.data);
    });
  });
  p.then(function (data) {
    cb(data);
  });
}

function sendPurchaseReq(cart, cb) {
  for (let i = 0; i < cart.length; i++) {
    var product = cart[i];
  }
}

function putProduct(product, qty, cb) {
  var p = new Promise(function (resolve, reject) {
    product.qty -= qty;
    axios
      .put("http://localhost:5000/sendProduct/" + product.productId, product)
      .then(function (response) {
        console.log(response.data);
        resolve(response.data);
      });
  });
  p.then(function (data) {
    console.log(data);

    cb(data);
  });
}

function sendMoneyToEcom() {

}

// putProduct(product,(data)=>{
//   console.log(data);

// })

// var cart = [
//   {
//     name: "Tesla_Model_3",
//     qty: 1,
//     productId: "9102057051adbbde0c92aa69a96cbaa80b09a332"
//   },
//   {
//     name: "Tesla_Model_S",
//     qty: 2,
//     productId: "8e9fcd21d4a47e898d4a70f564e8a12058a7e7c0"
//   },
//   {
//     name: "Tesla_Model_X",
//     qty: 3,
//     productId: "fe044f7ccf40b5ed6a417549340dec426e57588b"
//   }
// ];

SwaggerExpress.create(config, function (err, swaggerExpress) {
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