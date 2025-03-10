const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const validUsername=users.filter((user) => {return user.username===username});
    if(validUsername.length>0){
       return true;
    }else{
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const validUsername=users.filter((user) => {return user.username===username && user.password===password});
    if(validUsername.length>0){
       return true;
    }else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username=req.body.username;
    const password=req.body.password;
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60  });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User "+username+" successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username ("+username+") and password ("+password+")" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn=req.params.isbn;
  const review=req.body.review;
    let book=Object.keys(books).filter(i => {return books[i].ISBN===isbn });
    if(book.length>0){
        let bookId=book[0];
        book=books[bookId]
        let reviews=book.reviews;
        let user=req.session.authorization.username;
        reviews[user]=review;
        book.reviews=reviews;
        books={...books,
            bookId: book
        }
        return res.status(400).json({message: "Review registered for "+book.title+" on behalf of "+user});
    }else{
        return res.status(400).json({message: "Book not found, given ISBN: "+isbn});
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn=req.params.isbn;
      let book=Object.keys(books).filter(i => {return books[i].ISBN===isbn });
      if(book.length>0){
          let bookId=book[0];
          book=books[bookId]
          let reviews=book.reviews;
          let user=req.session.authorization.username;
          if(reviews[user]){
            delete reviews[user];
            book.reviews=reviews;
            books={...books,
                bookId: book
            }
            return res.status(400).json({message: user+"'s review deleted for "+book.title});

          }else{
            return res.status(400).json({message: user+"'s doesn't have any review for "+book.title});
          }
      }else{
          return res.status(400).json({message: "Book not found, given ISBN: "+isbn});
      }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
