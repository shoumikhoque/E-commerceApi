"use strict;";
//Include crypto to generate the movie accNo
var crypto = require("crypto");
const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const dbName = "accounts";
const colName = "account";

module.exports = function() {
  return {
    movieList: [],
    /*
     * Save the movie insaccNoe the "db".
     */
    save(account) {
      account.accNo = crypto.randomBytes(20).toString("hex"); // fast enough for our purpose
      mongo.connect(url, (err, client) => {
        if (err) {
          console.error(err);
          return;
        }
        const db = client.db(dbName);
        const collection = db.collection(colName);
        collection.insertOne(account, (err, result) => {});
      });
      this.movieList.push(account);
      return 1;
    },

    saveTx(trx){
      trx.trxID=crypto.randomBytes(16).toString("hex");
      mongo.connect(url, (err, client) => {
        if (err) {
          console.error(err);
          return;
        }
        const db = client.db(dbName);
        const collection = db.collection('transactions');
        collection.insertOne(trx, (err, result) => {});
      });
      return 1;
    },
    /*
     * Retrieve a movie with a given accNo or return all the movies if the accNo is undefined.
     */
    find(accNo, cb) {
      var p = new Promise(function(resolve, reject) {
        ///////////////////////////////////////////////
        if (accNo) {
          console.log("entered in db.js :", accNo);

          mongo.connect(url, (err, client) => {
            if (err) {
              console.error(err);
              reject(err);
            }
            const db = client.db(dbName);
            const collection = db.collection(colName);
            collection.findOne({ accNo: accNo }, (err, items) => {
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
    },
    valtrx(trxID,cb){
      var p = new Promise(function(resolve, reject) {
        ///////////////////////////////////////////////
        if (trxID) {
          // console.log("entered in db.js :", accNo);

          mongo.connect(url, (err, client) => {
            if (err) {
              console.error(err);
              reject(err);
            }
            const db = client.db(dbName);
            const collection = db.collection("transactions");
            collection.findOne({ trxID: trxID }, (err, items) => {
              resolve(items);
            });
          });
        }
        ///////////////////////////////////////////////
      });

      p.then(function(items) {
        cb(items);
      });

    },
    /*
     * Delete a movie with the given accNo.
     */
    remove(accNo) {
      var found = 0;
      this.movieList = this.movieList.filter(element => {
        if (element.accNo === accNo) {
          found = 1;
        } else {
          return element.accNo !== accNo;
        }
      });
      return found;
    },
    /*
     * Update a movie with the given accNo
     */
    update(accNo, account) {

      mongo.connect(url, (err, client) => {
        if (err) {
          console.error(err);
          return 0;
        }
        const db = client.db(dbName);
        const collection = db.collection(colName);
        collection.updateOne(
          { accNo: accNo },
          { '$set': account },
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
