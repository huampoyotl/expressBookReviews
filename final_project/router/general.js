const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let ISBN=req.params.isbn;
    let book=Object.keys(books).filter(i => books[i].ISBN===ISBN);
    if(book.length>0){
        return res.status(200).json(books[book[0]]);
    }else{
        return res.status(400).json({message: "Book not found, given ISBN: "+ISBN});
    }
    
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author=req.params.author;
    let book=Object.values(books).filter((book) => book.author===author);
    if(book.length>0){
        return res.status(200).json(book);
    }else{
        return res.status(400).json({message: "Book not found, given author: "+author});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title=req.params.title;
    let book=Object.values(books).filter((book) => book.title===title);
    if(book.length>0){
        return res.status(200).json(book);
    }else{
        return res.status(400).json({message: "Book not found, given title: "+title});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn=req.params.isbn;
    let book=Object.values(books).filter((book) => book.ISBN===isbn);
    if(book.length>0){
        return res.status(200).json(book[0].reviews);
    }else{
        return res.status(400).json({message: "Book not found, given ISBN: "+isbn});
    }
});

module.exports.general = public_users;
