module.exports = { getAll, save, getOne, update, del, saveTx, valTrx };
var crypto = require("crypto");
var db = require("../../config/db")();
const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const dbName = "accouunts";
const colname = "account";

function save(req, res, next) {
  let account = {
    name: req.body.name,
    accNo: crypto.randomBytes(20).toString("hex"),
    pass: req.body.pass
  };
  res.json({
    success: db.save(req.body),
    description: "account added to the list!"
  });
}

function getAll(req, res, next) {
  db.find(null, function(items) {
    console.log(items);
    var json = JSON.stringify(items);

    res.json(items);
  });
}
function valTrx(req, res, next) {
  var TrxID = req.swagger.params.TrxID.value;
  // console.log(TrxID);
  
  db.valtrx(TrxID, function(item) {
    console.log(item);
    
    if (item) {
      res.json(item);
    } else {
      res.status(204).send();
    }
  });
}

function getOne(req, res, next) {
  var accNo = req.swagger.params.accNo.value;
  //req.swagger contains the path parameters

  db.find(accNo, function(item) {
    if (item) {
      res.json(item);
    } else {
      res.status(204).send();
    }
  });
}

function update(req, res, next) {
  var accNo = req.swagger.params.accNo.value; //req.swagger contains the path parameters
  var account = {
    name: req.body.name,
    pass: req.body.pass,
    accNo: accNo
  };
  if (db.update(accNo, account)) {
    res.json({
      success: db.update(accNo, account),
      description: "account added to the list!"
    });
  }
}
function saveTx(req, res, next) {
  let trx = {
    to: req.body.to,
    from: req.body.from,
    amount: req.body.amount
  };
  res.json({
    success: db.saveTx(req.body),
    description: "transaction added to the list!"
  });
}

function del(req, res, next) {
  mongo.connect(url, (err, client) => {
    if (err) {
      console.error(err);
      return;
    }
    let account = {};
    const db = client.db(dbName);
    const collection = db.collection(colname);

    //collection.function
    collection
      .deleteOne(account)
      .then(item => {
        console.log(item);
      })
      .catch(err => {
        console.error(err);
      });

    //close collection
    client.close();
  });
}
