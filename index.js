const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId =require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()


const port = process.env.PORT || 5005;

app.use(cors());
app.use(bodyParser.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y1wap.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("bookShop").collection("products");

    app.get('/books',(req,res)=>{
        productCollection.find()
        .toArray((err,items)=>{
            res.send(items);
        })
    })

    app.post('/addBook', (req, res) => {
        const newBook = req.body;
        productCollection.insertOne(newBook)
            .then(result => {
                console.log('insurt', result.insertedCount > 0)
                res.send(result.insertedCount > 0)
            })

    })

    app.delete('/delete/:id',(req,res)=>{
        productCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result=>{
            console.log(result)
        })
    })

   

});

client.connect(err => {
    const orderBooks = client.db("bookShop").collection("bookOrder");
    app.post('/bookOrder',(req,res)=>{
        const bookOrder=req.body;
        orderBooks.insertOne(bookOrder)
        .then(result=>{
            res.send(result.insertedCount>0);
        })
        console.log(bookOrder);
    })

    app.get('/allOrder',(req,res)=>{
        // console.log(req.query.email);
        orderBooks.find({email:req.query.email})
        .toArray((err,documents)=>{
            res.send(documents);
        })
    })
  });




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})