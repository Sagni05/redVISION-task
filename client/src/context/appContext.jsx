import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { onTostifyFailure, onTostifySuccess } from "../Components/tosify/Tostify";

const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("AppContext must be within AppContextProvider");
  }

  return context;
};

const AppContextProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [favorite, setFavorite] = useState([]);
  const [query, setQuery] = useState("");




  const getAllBooks = (tok) => {
    if (tok) {
      axios
        .get("http://localhost:5555/book/getAllBooks", {
          headers: {
            Authorization: `${tok}`,
          },
        })
        .then((res) => {
          setBooks(res.data.data);
        })
        .catch((err) => console.log(err));
    }
  }



  const addToFavorite = async (id, token) => {
    try {
      const response = await axios.post(`http://localhost:5555/book/addFavBook/${id}`, null, {
        headers: {
          Authorization: token
        },
      });

      onTostifySuccess(response.data.message);

    } catch (error) {
      onTostifyFailure(error.response.data.message);
    }
  };


  const removeFromFavorite = (id) => {
    const newFavorite = favorite.filter((book) => book.id !== id);
    setFavorite(newFavorite);
  };

  const searchBooks = books.filter((book) =>
    book.bookName.toLowerCase().includes(query)
  );

  return (
    <AppContext.Provider
      value={{
        favorite,
        addToFavorite,
        removeFromFavorite,
        searchBooks,
        setQuery,
        getAllBooks
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
