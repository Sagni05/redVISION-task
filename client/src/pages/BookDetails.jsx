import React, { useState, useEffect } from "react";
import "../App.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const BookDetails = () => {
  const [book, setBook] = useState({});

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${"http://localhost:5555/book/book"}/${id}`)
      .then((res) => {
        setBook(res.data);
        console.log(res.data, 45);
      })
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <div className="book-details">
      <div className="book-image">
        <h2>{book.title}</h2>
        <img src={book.image_url} alt="img" />
      </div>
      <div className="book-description">
        <bold>Description :</bold>
        <p>{book.description}</p>
        <h2>Author :</h2>
        <p>{book.authors}</p>
      </div>
    </div>
  );
};

export default BookDetails;
