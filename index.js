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
        const blogCollection = database.collection('blogs');
        const ticketCollection = database.collection('orders');

        // Get Api All Movies
        app.get('/movies', async (req, res) => {
            let movies;
            const cursor = movieCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const count = await cursor.count();

            if (page) {
                movies = await cursor.skip(page * size).limit(size).toArray();
            } else {
                movies = await cursor.toArray();
            }


            res.send({
                count,
                movies
            });
        });
        // Find One Api
        app.get('/movie/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const result = await movieCollection.findOne(query);
            // console.log(result);
            res.json(result);
        });

        // Post Api Add Movies
        app.post('/addMovie', async (req, res) => {
            const movie = req.body;
            // console.log(movie);
            const result = await movieCollection.insertOne(movie);
            res.json(result);
        });

        // Delete Api
        app.delete('/movie/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await movieCollection.deleteOne(query);

            res.json(result);
        });

        // update Api
        app.patch('/movie', async (req, res) => {

            let id = req.body._id;

            const filter = { _id: ObjectId(id) };

            const updateMovie = {
                $set: {
                    movieName: req.body.movieName,
                    description: req.body.description,
                    ticketPrice: req.body.ticketPrice,
                    category: req.body.category,
                },
            };

            const result = await movieCollection.updateOne(filter, updateMovie);
            res.json(result);
        });

        // Count API
        app.get('/collection-count', async (req, res) => {
            const movieCount = await movieCollection.find({}).count();
            const blogCount = await blogCollection.find({}).count();
            res.json({
                movieCount,
                blogCount
            });
        });

        //? Post API add blogs
        app.post('/addBlog', async (req, res) => {
            const blog = req.body;
            // console.log(blog);
            const result = await blogCollection.insertOne(blog);
            res.json(result);
        });
        //? Get Api All Blogs
        app.get('/blogs', async (req, res) => {
            let blogs;
            const cursor = blogCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const count = await cursor.count();

            if (page) {
                blogs = await cursor.skip(page * size).limit(size).toArray();
            } else {
                blogs = await cursor.toArray();
            }


            res.send({
                count,
                blogs
            });
        });
        //? Delete Api blog
        app.delete('/blog/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await blogCollection.deleteOne(query);

            res.json(result);
        });

        //* Post API add order
        app.post('/checkout', async (req, res) => {
            const ticket = req.body;
            // console.log(ticket);
            const result = await ticketCollection.insertOne(ticket);
            res.json(result);
        });

        //* Get API add order
        app.get('/orders', async (req, res) => {

            const cursor = ticketCollection.find({});
            let orders = await cursor.toArray();

            res.send(orders);
        });
        // filter order
        app.get('/orders/:id', async (req, res) => {

            const id = req.params.id;

            const query = { uid: id };
            const result = await ticketCollection.find(query).toArray();

            // console.log(result);
            res.send(result);
        });

        // update status Api
        app.patch('/status', async (req, res) => {

            let id = req.body.id;
            // console.log(req.body.status);

            const filter = { _id: ObjectId(id) };

            const updateStatus = {
                $set: {
                    status: req.body.status
                },
            };

            const result = await ticketCollection.updateOne(filter, updateStatus);
            res.json(result);
        });
        //* Delete Api orders
        app.delete('/order/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await ticketCollection.deleteOne(query);

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