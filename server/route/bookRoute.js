const express = require("express");
const { createBook,
    getAllBooks,
    updateBook,
    deleteBook,
    upload,
    uploadFileController,
    getBookById,
    addFavoriteBook,
    removeFavoriteBook,
    getUserFavoriteBooks } = require("../controller");
const {
    validate, booksBody, authenticate, authorizeUser, UpdateBooksBody, idParamSchema, validateIdParam
} = require("../middleware");


const router = express.Router();

router.post("/addBook", authenticate, authorizeUser(1), validate(booksBody), createBook);

router.get("/getAllBooks", authenticate, getAllBooks);

router.get("/book/:id", validateIdParam, getBookById);

router.put("/book/:id", authenticate, authorizeUser(1), validateIdParam, validate(UpdateBooksBody), updateBook);

router.delete("/book/:id", authenticate, authorizeUser(1), validateIdParam, deleteBook);

router.post("/addFavBook/:id", authenticate, validateIdParam, addFavoriteBook)
router.delete("/removeFavBook/:id", authenticate, validateIdParam, removeFavoriteBook)
router.get("/getAllFavBooks", authenticate, getUserFavoriteBooks)

router.post(
    "/book/upload/image",
    upload.single("file"),
    uploadFileController
);

module.exports = router;
