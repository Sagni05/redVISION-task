import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { useAppContext } from "../context/appContext";
import { onTostifyFailure, onTostifySuccess } from "../Components/tosify/Tostify";

const Favorites = () => {
  const { addToFavorite, removeFromFavorite } = useAppContext();
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5555/book/getAllFavBooks", {
          headers: {
            Authorization: `${token}`,
          },
        });
        setFavoriteBooks(response.data.data);
        setLoading(false);
      } catch (error) {
        onTostifyFailure('Error fetching favorite books');
      }
    };

    fetchFavoriteBooks();
  }, [token]);

  const favoriteChecker = (id) => {
    return favoriteBooks.some((book) => book.id === id);
  };

  const removeFavoriteBook = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5555/book/removeFavBook/${bookId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      setFavoriteBooks(favoriteBooks.filter(book => book.id !== bookId));

      // Display success notification
      onTostifySuccess('Book removed from favorites successfully');
    } catch (error) {
      // Display error notification
      onTostifyFailure(`Error removing book from favorites : ${error}`);
    }
  };

  return (
    <div className="favorite">
      {loading ? (
        <p>Loading favorite books...</p>
      ) : favoriteBooks.length > 0 ? (
        favoriteBooks.map((book) => (
          <div key={book.id} className="book">
            <div>
              <h3>{book.bookName}</h3>
            </div>
            <div>
              <img src={book.imagePath} alt="img" />
            </div>
            <div>
              {favoriteChecker(book.id) ? (
                <button onClick={() => removeFavoriteBook(book.id)}>
                  Remove from Favorites
                </button>
              ) : (
                <button onClick={() => addToFavorite(book, token)}>
                  Add to Favorites
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <h1 className="blank">You don't have any favorite books.</h1>
      )}
    </div>
  );
};

export default Favorites;
