import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("AppContext must be within AppContextProvider");
  }

  return context;
};

const AppContextProvider = ({ children, token }) => {
  const [books, setBooks] = useState([]);
  const [favorite, setFavorite] = useState([]);
  const [query, setQuery] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5555/book/getAllBooks", {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          console.log(res, 666);
          setBooks(res.data.data);
        })
        .catch((err) => console.log(err));
    }
  }, [token]);


  const addToFavorite = async (id, token) => {
    try {
      const response = await axios.post(`http://localhost:5555/book/addFavBook/${id}`, null, {
        headers: {
          Authorization: token
        },
      });

      toast.success(response.data.message);

    } catch (error) {
      toast.error(error.response.data.message);
    }
  };


  const removeFromFavorite = (id) => {
    const newFavorite = favorite.filter((book) => book.id !== id);
    setFavorite(newFavorite);
  };

  const searchBooks = books.filter((book) =>
    book.bookName.toLowerCase().includes(query)
  );

  return (<>
    <AppContext.Provider
      value={{
        favorite,
        addToFavorite,
        removeFromFavorite,
        searchBooks,
        setQuery,
      }}
    >
      {children}
    </AppContext.Provider>
    <ToastContainer />
  </>
  );
};

export default AppContextProvider;
