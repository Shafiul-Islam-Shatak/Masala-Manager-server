const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const purchaseCollection = client.db("foodDB").collection('purchase_food')
        const feedbackCollection = client.db("foodDB").collection('feedback')
        // post a food to db
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

        // get a single food by id
        app.get('/food/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.findOne(query)
            res.send(result)
        })
        // get a single food by id
        app.get('/purchase/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.findOne(query)
            res.send(result)
        })

        // get a user added food by email
        app.get('/my-foods/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email }
            const result = await foodCollection.find(query).toArray()
            res.send(result)
        })

        // delete a single food by id
        app.delete('/my-foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.deleteOne(query)
            res.send(result)
        })
        // update route for a single food by id
        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.findOne(query)
            res.send(result)
        })

        // update a single food by id
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const options = { upsert: true };
            const query = { _id: new ObjectId(id) };
            const updatedFood = req.body;
            const newFood = {
                $set: {
                    food_name: updatedFood.food_name,
                     category : updatedFood.category,
                     image : updatedFood.image,
                     price : updatedFood.price,
                     quantity : updatedFood.quantity,
                     origin : updatedFood.origin,
                     userName : updatedFood.userName,
                     userEmail : updatedFood.userEmail,
                     description : updatedFood.description,

                }
            }
            const result = await foodCollection.updateOne(query, newFood, options);
            res.send(result)
        })

        // post a single purchase food to db
        app.post('/purchases', async (req, res) => {
            const newPurchase = req.body;
            const result = await purchaseCollection.insertOne(newPurchase)
            res.send(result)
        })
        // get all purchase foods api from db
        app.get('/purchases', async (req, res) => {
            const result = await purchaseCollection.find().toArray();
            res.send(result)
        })

        // post a feedback to db
        app.post('/feedbacks', async (req, res) => {
            const newFeedBack = req.body;
            const result = await feedbackCollection.insertOne(newFeedBack)
            res.send(result)
        })
        // get all feedback api from db
        app.get('/feedbacks', async (req, res) => {
            const result = await feedbackCollection.find().toArray();
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