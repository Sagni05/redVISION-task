import React, { useState, useEffect } from "react";
import "../App.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const BookDetails = () => {
  const [book, setBook] = useState({});

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:5555/book/book/${id}`)
      .then((res) => {
        setBook(res.data.data[0]);
        console.log(res.data.data);
      })
      .catch((err) => console.log(err));
  }, [id]);


  return (
    <div className="book-details">
      {book && Object.keys(book).length !== 0 ? (
        <>
          <div className="book-image">
            <h2>{book.bookName}</h2>
            <img src={book.imagePath} alt="img" />
          </div>
          <div className="book-description">
            <strong>Description:</strong>
            <p>{book.description}</p>
            <h2>Author:</h2>
            <p>{book.author}</p>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BookDetails;
