module.exports = { getOne,save };
var crypto = require("crypto");
var db = require("../../config/db")();
const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const dbName = "ecom";
const colname = "user";
function getOne(req, res, next) {
  var email = req.swagger.params.email.value;
  //req.swagger contains the path parameters

  db.find(email, function(item) {
    if (item) {
      res.json(item);
    } else {
      res.status(204).send();
    }
  });
}
function save(req, res, next) {
    // let account = {
    //   name: req.body.name,
    //   accNo: crypto.randomBytes(20).toString("hex"),
    //   pass: req.body.pass
    // };
    res.json({
      success: db.save(req.body),
      description: "account added to the list!"
    });
  }