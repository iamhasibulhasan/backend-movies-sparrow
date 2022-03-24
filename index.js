const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

/**
 * Setup Middleware
 */
app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
    res.send('Hello from sparrow!')
});

app.listen(port, () => {
    // console.log(uri);
    console.log(`Sparrow Movies listening on port ${port}`);
});