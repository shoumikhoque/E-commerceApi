"use strict;";
//Include crypto to generate the movie accNo
var crypto = require("crypto");
const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const dbName = "supplier";
const colname = "product";
module.exports=function(){
    return{
        save(product) {
            product.productId = crypto.randomBytes(20).toString("hex"); // fast enough for our purpose
            mongo.connect(url, (err, client) => {
              if (err) {
                console.error(err);
                return;
              }
              const db = client.db(dbName);
              const collection = db.collection(colName);
              collection.insertOne(account, (err, result) => {});
            });
            return 1;
          }
    }
}