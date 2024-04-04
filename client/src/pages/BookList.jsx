import React, { useEffect, useState } from "react";
import "../App.css";
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";

const BookList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { favorite, addToFavorite, removeFromFavorite, searchBooks, getAllBooks } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;
  const isBookInFavorites = (id) => {
    return favorite.some((book) => book.id === id);
  };

  // Logic to calculate pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = searchBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(searchBooks.length / booksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    getAllBooks(token);
  }, []);

  return (
    <>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      <div className="book-list">
        {currentBooks.map((book) => (
          <div key={book.id} className="book">
            <div>
              <h3>{book.bookName}</h3>
            </div>
            <div>
              <img
                src={book.imagePath}
                alt="img"
                onClick={() => navigate(`/books/${book.id}`)}
              />
            </div>
            <div>
              {isBookInFavorites(book.id) ? (
                <button onClick={() => removeFromFavorite(book.id)}>
                  Remove from Favorites
                </button>
              ) : (
                <button onClick={() => addToFavorite(book.id, token)}>
                  Add to Favorites
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BookList;
