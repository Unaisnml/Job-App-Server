import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config()
const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors())


const uri = process.env.DB_URL;
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

    //Create db
    const database = client.db("Job-portal")
    const jobsCollections = database.collection("jobs");

      //get all jobs
      app.get('/all-jobs', async(req, res)=>{
        const jobs = await jobsCollections.find({}).toArray();
        res.send(jobs)
    })

    //post job
    app.post('/post-job', async(req, res)=>{
        const body = req.body;
        body.createdAt = new Date();
        console.log(body)
        const result = await jobsCollections.insertOne(body);
        console.log(result)
        if(result.insertedId) {
           return res.status(200).send(result)
        }else {
            res.status(404).send({
                message: "Cannot insert! try again later",
                status: false
            })
        }
    })

  

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello Unais!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})


