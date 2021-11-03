const express = require('express')
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').objectId;


// middleware 
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1hx2i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { 
    useNewUrlParser: true,
     useUnifiedTopology: true 
});

async function run(){
    try{
        await client.connect();
        const database = client.db("foodDelivery");
        const productsCollection = database.collection("products");
        const emailCollection = database.collection("orders");

        // POST packages
        app.post('/products', async (req,res)=>{
            const result = await productsCollection.insertOne(req.body);
            res.send(result);
        });
        // get packages to server
        app.get('/products', async (req,res)=>{
            const result = await productsCollection.find({}).toArray();
            res.json(result);
        });
        // get individual package
        app.get('/products/:id', async (req,res)=>{
            const query = { _id: ObjectId(req.params.id) }
            const package = await productsCollection.findOne(query);
            res.send(package);
        });

         
          // confirm order
            app.post("/orders", async (req, res) => {
                const result = await productsCollection.insertOne(req.body);
                res.send(result);
            });

            // my confirmOrder
            app.get("/orders/:email", async (req, res) => {
                const result = await emailCollection
                .find({ email: req.params.email })
                .toArray();
                res.send(result);
  });
        // delete orders
        app.delete('/orders/:id', async(req,res)=>{
            const query = {_id: ObjectId(req.params.id)};
            const result = await emailCollection.deleteOne(query);
            res.json(result);
        });
        
    
        // update status
        app.put('/orders/:id', async(req,res)=>{
            const query = {_id: ObjectId(req.params.id)};
            const updateDoc = {
                $set : {
                    status: "approved"
                },
            };
            const result = await emailCollection.updateOne(query,updateDoc);
            res.send(result);
        })
    }
    finally{
        // await
    }
}

run().catch(console.dir);


  
  app.get("/", (req, res) => {
    res.send("Running Food Delivery Server...");
  });


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})