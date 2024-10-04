const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.port || 3000
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleWire 
app.use(cors())
app.use(express.json())



// connect mongodb database 
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.kmaa4nd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // collection create here 
    const booksCollection = client.db('BooksInventory').collection('books')

    // insert a book 
    app.post('/upload-book', async(req, res) => {
        const data = req.body;
        const result = await booksCollection.insertOne(data)
        res.send(result)
    })

    // get all books and also get query = filter by category 
    app.get('/all-books', async(req, res) => {
        let query = {}
        if(req.query?.Category){
            query = {Category: req.query.Category}
        }
        const result = await booksCollection.find(query).toArray()
        res.send(result)
    })

    // get a signle book 
    app.get('/book/:id', async(req, res) => {
        const id = req.params.id;
        const filter = { _id : new ObjectId(id)}
        const result = await booksCollection.findOne(filter)
        res.send(result)
    })

    // update a book 
    app.patch('/book/:id', async(req, res) => {
        const id = req.params.id;
        const updateBookData = req.body;
        const filter = { _id : new ObjectId(id)};
        const options = { upsert : true};
        const updateDoc = {
            $set: {
                ...updateBookData
            }
        }
        const result  = await booksCollection.updateOne(filter, updateDoc, options)
        res.send(result)
    })

    // delete a book 
    app.delete('/book/:id', async(req, res) => {
        const id = req.params.id;
        const filter = { _id : new ObjectId(id)}
        const result = await booksCollection.deleteOne(filter)
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('hello world this is get ')
})

app.listen(port, () =>{
    console.log('hello world');
})
