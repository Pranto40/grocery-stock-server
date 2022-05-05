const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y44yk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try{
        await client.connect();
        const productCollection = client.db("groceryStock").collection("product");
        console.log('db connected');

        // GET
        app.get('/products', async (req, res) => {
            const quary= {}
            const cursor = productCollection.find(quary)
            const products = await cursor.toArray()
            res.send(products)
        });

        // GET Dynamic url
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product)
        });

        // POST
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result)
        });

        // DELETE
        app.delete('/product/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });
        
    }
    finally{
        // client.close()
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('running grocery server');
})

app.listen(port, () => {
    console.log('Listening to port', port);
})