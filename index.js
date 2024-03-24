const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares

app.use(cors());
app.use(express.json());

// main

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0epcy0w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const chocolateCollection = client.db("chocolate").collection("chocolate");

    // get Chocolates
    app.get("/chocolates", async (req, res) => {
      const cursor = chocolateCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Post Chocolates
    app.post("/chocolates", async (req, res) => {
      const newChocolate = req.body;
      console.log(newChocolate);
      const result = await chocolateCollection.insertOne(newChocolate);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffee-store-server-Running");
});
app.listen(port, () => {
  console.log(`coffee-server-is-running-on-PORT: ${port}`);
});
