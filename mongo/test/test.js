const MongoClient = require('mongodb').MongoClient;
const expect = require("chai").expect;
const sools = require("sools");
const interface = require("../Interface");
// Create a new MongoClient
const client = new MongoClient('mongodb://localhost:27017');
var interface = new Interface(client);
// Use connect method to connect to the Server
client.connect().then(() => {
    const db = client.db("zenyo");
    var usersCollection = db.collection("users");
    return usersCollection.find().toArray().then((users) => {
        console.log("users", users)
    })

}).catch((err) => {
    console.error(err);
}).finally(() => {
    client.close();
})