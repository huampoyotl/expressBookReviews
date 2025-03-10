const express = require('express');
const axios = require('axios');
let books = {};
let booksdb = require('./booksdb.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username=req.body.username;
  const password=req.body.password;

  if(username || password){
    let existUsername=users.filter((user) => { return user.username===username });
    if(!existUsername.length>0){
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User "+username+" successfully registered"});
    }else{
        return res.status(300).json({message: "Username already registered"});
    }
  }else{
    return res.status(300).json({message: "Username and/or password are missing"});
  }

});

public_users.get("/db",function(req,res){
    return res.status(200).json(booksdb);
})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    axios.get('https://andres-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/db')
        .then(response => {
            books=response.data
            return res.status(200).json(books);
        })
        .catch(error => {
            return res.status(500).json({message: "Internal error at getting db", error: error});
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let ISBN=req.params.isbn;
    axios.get('https://andres-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/db')
        .then(response => {
            books=response.data
            let book=Object.keys(books).filter(i => books[i].ISBN===ISBN);
            if(book.length>0){
                return res.status(200).json(books[book[0]]);
            }else{
                return res.status(400).json({message: "Book not found, given ISBN: "+ISBN});
            }
        })
        .catch(error => {
            return res.status(500).json({message: "Internal error at getting db", error: error});
        });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author=req.params.author;
    
    axios.get('https://andres-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/db')
        .then(response => {
            books=response.data
            let book=Object.values(books).filter((book) => book.author===author);
            if(book.length>0){
                return res.status(200).json(book);
            }else{
                return res.status(400).json({message: "Book not found, given author: "+author});
            }
        })
        .catch(error => {
            return res.status(500).json({message: "Internal error at getting db", error: error});
        });
 });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title=req.params.title;
    axios.get('https://andres-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/db')
        .then(response => {
            books=response.data
            let book=Object.values(books).filter((book) => book.title===title);
            if(book.length>0){
                return res.status(200).json(book);
            }else{
                return res.status(400).json({message: "Book not found, given title: "+title});
            }
        })
        .catch(error => {
            return res.status(500).json({message: "Internal error at getting db", error: error});
        });
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
