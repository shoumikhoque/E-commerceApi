module.exports={save}
var crypto = require("crypto");
var db = require("../../config/db")();
const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const dbName = "supplier";
const colname = "product";
function save(req, res, next) {
    let product = {
      name: req.body.name,
      productId: crypto.randomBytes(20).toString("hex"),
      amount: req.body.amount,
      price: req.body.price,
      url:req.body.url
    };
    res.json({
      success: db.save(req.body),
      description: "account added to the list!"
    });
  }