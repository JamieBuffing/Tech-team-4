require('dotenv').config()
const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.URI;

const client = new MongoClient(uri);
const db = client.db(process.env.DB);

async function connectDB() {
    try {
        await client.connect();
        console.log("Client connected to database");
    } catch (error) {
        console.log(error);
    }
}

connectDB()



app.listen(3000);
console.log('Server is listening on port 3000');
console.log('http://localhost:3000/')