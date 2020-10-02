const express = require('express');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tjjkp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// console.log(process.env.DB_PASS);

// app.get('/', (req, res) => {
//   res.send('hello ema!');
// });

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db('emaJohnStore').collection('products');
  const ordersCollection = client.db('emaJohnStore').collection('orders');

  app.post('/addProduct', (req, res) => {
    const newProducts = req.body;
    productsCollection.insertOne(newProducts).then((result) => {
      res.send(result.insertedCount.toString());
    });
  });

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get('/products', (req, res) => {
    productsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get('/product/:key', (req, res) => {
    productsCollection
      .find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.post('/getAll', (req, res) => {
    const keys = req.body;
    productsCollection
      .find({ key: { $in: keys } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  console.log('connected');
});

app.listen(4000, () => {
  console.log('listening....');
});
