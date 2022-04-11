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

/**
 * Mongo db setup
 */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9ctq5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db('sparrowMovies');
        const movieCollection = database.collection('movies');

        // Get Api All Movies
        app.get('/movies', async (req, res) => {
            const cursor = movieCollection.find({});
            const movies = await cursor.toArray();
            res.send(movies);
        });
        // Find One Api
        app.get('/movie/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await movieCollection.findOne(query);
            console.log(result);
            res.json(result);
        });

        // Post Api Add Movies
        app.post('/addMovie', async (req, res) => {
            const movie = req.body;
            console.log(movie);
            const result = await movieCollection.insertOne(movie);
            res.json(result);
        });


    } finally {
        // client.close();
    }
}




app.get('/', (req, res) => {
    res.send('Hello from sparrow!')
});

app.listen(port, () => {
    // console.log(uri);
    console.log(`Sparrow Movies listening on port ${port}`);
});


run().catch(console.dir);