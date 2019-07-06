"use strict;";
//Include crypto to generate the movie productId
var crypto = require("crypto");
const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const dbName = "supplier";
const colName = "product";
module.exports = function() {
  return {
    save(product) {
      product.productId = crypto.randomBytes(20).toString("hex"); // fast enough for our purpose
      mongo.connect(url, (err, client) => {
        if (err) {
          console.error(err);
          return;
        }
        const db = client.db(dbName);
        const collection = db.collection(colName);
        collection.insertOne(product, (err, result) => {});
      });
      return 1;
    },
    find(productId, cb) {
      var p = new Promise(function(resolve, reject) {
        ///////////////////////////////////////////////
        if (productId) {
          console.log("entered in db.js :", productId);

          mongo.connect(url, (err, client) => {
            if (err) {
              console.error(err);
              reject(err);
            }
            const db = client.db(dbName);
            const collection = db.collection(colName);
            collection.findOne({ productId: productId }, (err, items) => {
              resolve(items);
            });
          });
        } else {
          mongo.connect(url, (err, client) => {
            if (err) {
              console.error(err);
              reject(err);
            }
            const db = client.db(dbName);
            const collection = db.collection(colName);
            collection.find().toArray((err, items) => {
              resolve(items);
            });
          });
        }
        ///////////////////////////////////////////////
      });
      p.then(function(items) {
        cb(items);
      });
    }
    ,
    update(productId, product) {

      mongo.connect(url, (err, client) => {
        if (err) {
          console.error(err);
          return 0;
        }
        const db = client.db(dbName);
        const collection = db.collection(colName);
        collection.updateOne(
          { productId: productId },
          { '$set': product },
          (err, item) => {
            if(item!=null){
              
            }
          }
        );
      });

      return 1; 

      
    }
  };
};
