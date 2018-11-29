// server.js
// SERVER-SIDE JAVASCRIPT


/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////


//require models in our app
var db = require('./models');

//require express in our app
var express = require('express'),
  bodyParser = require('body-parser');

// generate a new express app and call it 'app'
var app = express();

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.json());


////////////////////
//  DATA
///////////////////

var newBookUUID = 18;

////////////////////
//  ROUTES
///////////////////




// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('views/index.html', {
    root: __dirname
  });
});

// GET ALL BOOKS
app.get('/api/books', function(req, res) {
  // send all books as a json response
  db.Book.find()
  // populate fills in the author id with all the author data
    .populate('author')
    .exec(function(err, books){
      if (err) { console.log(`index error: ${err}`); }
      res.json(books);
    })
})

// GET ONE BOOK
app.get('/api/books/:id', function(req,res) {
  // get book id from url params(`req.params`)
  let bookId = req.params.id;
  console.log(bookId);

  // find book in db by id
  db.Book.findOne({_id: bookId }, (err, foundBook) => {
    if(err) {return console.log(err)}
    res.json(foundBook);
  });
});

// CREATE BOOK
app.post('/api/books', (req , res) => {
  // create a temp variable with form data (`req.body`)
  let newBook = new db.Book({
    title: req.body.title,
    image: req.body.image,
    releaseDate: req.body.releaseDate,
  });

  //this code will only add an author to a book if the author already exists
  db.Author.findOne({name: req.body.author}, function(err, author){
    newBook.author = author;
    newBook.save(function(err, book){
      if (err) {
        console.log(`create error: ${err}`);
      }
      console.log("created ", book.title);
      res.json(book);
    });
  });
});

app.get('/api/authors', (req, res) => {
  db.Author.find({}, (err, authors) => {
    res.json(authors);
  })
})

// UPDATE BOOK
app.put('/api/books/:id', (req,res) => {
  // get book id from url params (`req.params`)
  let bookId = req.params.id;
  // get update body from req.body
  let updateBody = req.body;
  
  console.log(updateBody);

  // db.Book.findOne({_id:bookId}, (err, bookObj) => {
  //   if(err){
  //     return;
  //   }
  //   else{
      
  //   }
  // })

  // find and update the book's attributes
  db.Book.findOneAndUpdate(
    { _id: bookId }, // search condition
    updateBody, // new content you want to update
    {new:true}, // you want to receive the new object
    (err, updatedBook) => { // callback function
    if(err) return console.log(err)
    res.json(updatedBook);
    });
});

// DELETE BOOK
app.delete('/api/books/:id', (req,res) => {
  // get book id from url params (`req.params`)
  let bookId = req.params.id;

  // find book in db by id and delete
  db.Book.deleteOne(
    { _id: bookId },
    (err, deletedBook) => {
      if(err) {return console.log(err)}
      res.json(deletedBook);
  });
});




app.listen(process.env.PORT || 3000, function () {
  console.log('Book app listening at http://localhost:3000/');
});