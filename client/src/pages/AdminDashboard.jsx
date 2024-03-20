import React from "react";
import "../App.css";
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const token = localStorage.getItem("token");

    const navigate = useNavigate();
    const { favorite, addToFavorite, removeFromFavorite, searchBooks } = useAppContext();

    const isBookInFavorites = (id) => {
        return favorite.some((book) => book.id === id);
    };

    return (
        <>
            <div className="book-list">
                {searchBooks.map((book) => (
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

export default AdminDashboard;
