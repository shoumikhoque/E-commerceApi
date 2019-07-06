"use strict;";
//Include crypto to generate the movie email
var crypto = require("crypto");
const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const dbName = "ecom";
const colname = "user";
module.exports=function(){
    return {
        save(account) {
            account.accId = crypto.randomBytes(20).toString("hex"); // fast enough for our purpose
            mongo.connect(url, (err, client) => {
              if (err) {
                console.error(err);
                return;
              }
              const db = client.db(dbName);
              const collection = db.collection(colname);
              collection.insertOne(account, (err, result) => {});
            });
            return 1;
          },

        find(email, cb) {
            var p = new Promise(function(resolve, reject) {
              ///////////////////////////////////////////////
              if (email) {
                console.log("entered in db.js :", email);
      
                mongo.connect(url, (err, client) => {
                  if (err) {
                    console.error(err);
                    reject(err);
                  }
                  const db = client.db(dbName);
                  const collection = db.collection(colname);
                  collection.findOne({ email: email }, (err, items) => {
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

    }
}
