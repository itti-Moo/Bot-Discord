const { MongoClient } = require('mongodb');

const dotenv = require('dotenv');
dotenv.config();

const url = process.env.url
const client = new MongoClient(url);
const dbName = process.env.DB


async function insertData(table,data) {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(table);
    const insertResult = await collection.insertMany([data]);
    client.close();
}
async function updateData(table,conditionData,updateData) {
    await client.connect();
    const db=client.db(dbName);
    const collection = db.collection(table);
    const updateResult = await collection.updateOne(conditionData, { $set: updateData });
    client.close();
}
async function findData(table,data){
    await client.connect();
    const db=client.db(dbName);
    const collection = db.collection(table);
    const findData = await collection.find(data).toArray();
    client.close();
    return findData
}
async function findUnique(table,unique)
{
    await client.connect();
    const db=client.db(dbName);
    const collection = db.collection(table);
    const findUnique = await collection.distinct(unique)
    client.close();
    return findUnique
}

module.exports = { insertData , updateData ,findData ,findUnique};