require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 8000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6ze9kj8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const jobCollection = client.db("marketPlaceDB").collection("jobs");
    const bidCollection = client.db("marketPlaceDB").collection("bids");

    //jobs related api
    app.get("/jobs", async (req, res) => {
      const result = await jobCollection.find().toArray();
      res.send(result);
    });

    app.get("/jobs/s/:id", async (req, res) => {
      const {
        params: { id },
      } = req;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.findOne(query);
      res.send(result);
    });

    app.get("/jobs/m/:email", async (req, res) => {
      const {
        params: { email },
      } = req;
      const query = { "buyer.email": email };
      const result = await jobCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/jobs", async (req, res) => {
      const { body: job } = req;
      const result = await jobCollection.insertOne(job);
      res.send(result);
    });

    app.put("/jobs/:id", async (req, res) => {
      const {
        body: updatedJob,
        params: { id },
      } = req;

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...updatedJob,
        },
      };
      const result = await jobCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.delete("/jobs/:id", async (req, res) => {
      const {
        params: { id },
      } = req;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.deleteOne(query);
      res.send(result);
    });

    // bids related api
    app.get("/bids", async (req, res) => {});

    app.get("/bids/:email", async (req, res) => {
      const { body: email } = req;
    });

    app.post("/bids", async (req, res) => {
      const { body: bidJob } = req;
      const result = await bidCollection.insertOne(bidJob);
      res.send(result);
    });

    app.patch("/bids/:id", async (req, res) => {
      const {
        params: { id },
      } = req;
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send({ message: "Welcome to market place" });
});

app.listen(port, () => {
  console.log(`server is on on port ${port}`);
});
