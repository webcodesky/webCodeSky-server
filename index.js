const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.WEBCODESKY_USER}:${process.env.WEBCODESKY_PASS}@cluster0.08jlhdc.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection

    const contactUsersCollection = client
      .db("webCodeSky-Db")
      .collection("allContactUsers");
    const serviceCollection = client
      .db("webCodeSky-Db")
      .collection("allService");
    const allBlogsCollection = client.db("webCodeSky-Db").collection("blogs");
    const ourWorksCollection = client.db("webCodeSky-Db").collection("works");

    app.post("/contact-users", async (req, res) => {
      const contactUsers = req.body;
      const result = await contactUsersCollection.insertOne(contactUsers);
      res.send(result);
      console.log(contactUsers);
    });

    // service details
    app.get("/service-details/:text", async (req, res) => {
      if (
        req.params.text == "EcommerceWebsite" ||
        req.params.text == "WordPressWebsite" ||
        req.params.text == "WebDesign"
      ) {
        const serviceDetails = await serviceCollection
          .find({
            category: req.params.text,
          })
          .toArray();
        res.send(serviceDetails);
        console.log(serviceDetails);
      }
    });

    // blogs
    app.get("/blogs", async (req, res) => {
      const allBlogs = allBlogsCollection.find();
      const result = await allBlogs.toArray();
      res.send(result);
      console.log(console.log(result));
    });

    // blogs details data

    app.get("/blog-details/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await allBlogsCollection.findOne(query);

        if (!result) {
          return res.status(404).send({ message: "Blog not found" });
        }

        res.send(result);
      } catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // our works
    app.get("/works/:text", async (req, res) => {
      if (
        req.params.text == "FullWebsite" ||
        req.params.text == "LandingPage" ||
        req.params.text == "Portfolio"
      ) {
        const works = await ourWorksCollection
          .find({
            subCategory: req.params.text,
          })
          .toArray();
        res.send(works);
        console.log(works);
      }
    });

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
  res.send("WebCodeSky server is running");
});

app.listen(port, () => {
  console.log(`TWebCodeSky server is running on port: ${port}`);
});
