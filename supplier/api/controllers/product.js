module.exports = { save, getOne ,update,getAll};
var crypto = require("crypto");
var db = require("../../config/db")();
const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
// rs
function save(req, res, next) {
  let product = {
    name: req.body.name,
    productId: crypto.randomBytes(20).toString("hex"),
    amount: req.body.amount,
    price: req.body.price,
    url: req.body.url
  };
  res.json({
    success: db.save(req.body),
    description: "product added to the list!"
  });
}
function getOne(req, res, next) {
  var productId = req.swagger.params.productId.value;
  //req.swagger contains the path parameters

  db.find(productId, function(item) {
    if (item) {
      res.json(item);
    } else {
      res.status(204).send();
    }
  });
}
function getAll(req, res, next) {
  db.find(null, function(items) {
    console.log(items);
    // var json = JSON.stringify(items);

    res.json(items);
  });
}
function update(req, res, next) {
  var productId = req.swagger.params.productId.value; //req.swagger contains the path parameters
  var product = {
    amount: req.body.amount
  };
  if (db.update(productId, product)) {
    res.json({
      success: db.update(productId, product),
      description: "product updated to the list!"
    });
  }
}
