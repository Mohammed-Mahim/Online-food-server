const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1hx2i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('database connected');

        const database = client.db("foodDelivery");
        const productCollection = database.collection("products");

        // GET
        app.get('/products', async(req, res)=>{
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.json(products)
            
        })
        // get individual product
        app.get('/products/:id', async (req,res)=>{
            const query = { _id: ObjectId(req.params.id) }
            const product = await productCollection.findOne(query);
            res.send(product);
        });


        // POST
        // app.post('/products', async(req, res)=>{
        //     const product = req.body;
            
        //     const result = await productCollection.insertOne(product)
        //     res.json(result);
        // })
        

    }
    finally{
        // await client.close()
    }
}

run().catch(console.dir)



app.get('/', (req, res) => {
  res.send('Food delivery server running...!')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})