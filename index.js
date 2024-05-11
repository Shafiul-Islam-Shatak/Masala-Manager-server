const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express()

const corsoptions = {
    origin: ['http://localhost:5173'],
    Credential: true,
    optionSuccessStatus: 2000
}

// middleware
app.use(cors(corsoptions));
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eugjqa9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const foodCollection = client.db("foodDB").collection('food')
        // post e food to db
        app.post('/all-foods', async (req, res) => {
            const newFood = req.body;
            const result = await foodCollection.insertOne(newFood);
            res.send(result)
        })
        // get all foods api from db
        app.get('/all-foods', async (req, res) => {
            const result = await foodCollection.find().toArray();
            res.send(result)
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('hello its masala manager server')
})

app.listen(port, () => {
    console.log(`server is running on ${port}`)
})