const { diskStorage } = require("multer");
const multer = require("multer");
const _ = require("lodash");
const { SuccessRes, NotAllowedError, BadRequestError, NotFoundError } = require("../core");
const sequelize = require('../config/db');



const createBook = async (req, res, next) => {
    try {
        const { bookName, author, description, imagePath } = req.body;

        const { email } = req.user // we should add unique id but i'm adding email if role is multiple then difficult to understand

        // Check if the book already exists
        const existBookQuery = 'SELECT * FROM tbl_books WHERE bookName = ? AND author = ?';
        const [existBook] = await sequelize.query(existBookQuery, {
            replacements: [bookName, author],
        });

        if (existBook.length > 0) {
            throw new BadRequestError("Book already exists with the same name and author.");
        }

        const insertBookQuery = 'INSERT INTO tbl_books (bookName, author, description,imagePath, createdBy, modifiedBy) VALUES (?, ?, ?, ?, ?, ?)';
        await sequelize.query(insertBookQuery, {
            replacements: [bookName, author, description, imagePath, email, email],
        });

        res.send(SuccessRes('Book added successfully'));
    } catch (e) {
        next(e);
    }
};

const getBookById = async (req, res, next) => {
    try {
        const { id } = req.params;


        const getBookQuery = 'SELECT * FROM tbl_books WHERE id = ?';
        const [book] = await sequelize.query(getBookQuery, {
            replacements: [id],
        });

        if (!book || book.length === 0) {
            throw new NotFoundError('Book not found');
        }

        res.send(SuccessRes('Book found successfully', book));
    } catch (e) {
        next(e);
    }
};

const getAllBooks = async (req, res, next) => {
    try {
        const getAllBooksQuery = 'SELECT * FROM tbl_books';
        const [books] = await sequelize.query(getAllBooksQuery);
        res.send(SuccessRes('Books retrieved successfully', books));
    } catch (e) {
        next(e);
    }
};

const updateBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { email } = req.user;
        const { bookName, author, description, imagePath } = req.body;

        // Check if the book with the given id exists
        const checkBookQuery = 'SELECT * FROM tbl_books WHERE id = ?';
        const [existingBook] = await sequelize.query(checkBookQuery, {
            replacements: [id],
        });

        if (!existingBook || existingBook.length === 0) {
            throw new NotFoundError('Book not found');
        }

        // Check if another book with the same name and author exists
        const checkDuplicateQuery = 'SELECT * FROM tbl_books WHERE id != ? AND bookName = ? AND author = ?';
        const [duplicateBook] = await sequelize.query(checkDuplicateQuery, {
            replacements: [id, bookName, author],
        });

        if (duplicateBook && duplicateBook.length > 0) {
            throw new NotAllowedError('Another book with the same name and author already exists.');
        }

        // Update the book
        const updateBookQuery = 'UPDATE tbl_books SET bookName = ?, author = ?, description = ?, imagePath = ?, modifiedBy = ? WHERE id = ?';
        const [result] = await sequelize.query(updateBookQuery, {
            replacements: [bookName, author, description, imagePath, email, id],
        });

        if (result.affectedRows === 0) {
            throw new NotFoundError('Book not found');
        }

        res.send(SuccessRes('Book updated successfully'));
    } catch (e) {
        next(e);
    }
};

const deleteBook = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleteBookQuery = 'DELETE FROM tbl_books WHERE id = ?';
        const [result] = await sequelize.query(deleteBookQuery, {
            replacements: [id],
        });

        if (result.affectedRows === 0) {
            throw new NotFoundError('Book not found');
        }

        res.send(SuccessRes('Book deleted successfully', null, 201));
    } catch (e) {
        next(e);
    }
};


// Add Favorite Book API
const addFavoriteBook = async (req, res, next) => {
    try {
        const { id: bookId } = req.params;
        const { id: userId } = req.user;

        // Check if the book with the given ID exists
        let checkBookQuery = 'SELECT * FROM tbl_books WHERE id = ?';
        let [existingBook] = await sequelize.query(checkBookQuery, {
            replacements: [bookId],
        });

        if (!existingBook || existingBook.length === 0) {
            throw new NotFoundError('Book not found');
        }


        checkBookQuery = 'SELECT * FROM tbl_favorites WHERE userId = ? and bookId = ?';
        let [result] = await sequelize.query(checkBookQuery, {
            replacements: [userId, bookId],
        });

        if (result.length > 0) {
            throw new NotAllowedError('Already in favorite list');
        }

        // Add the book to favorites
        const addFavoriteQuery = 'INSERT INTO tbl_favorites (userId, bookId) VALUES (?, ?)';
        await sequelize.query(addFavoriteQuery, { replacements: [userId, bookId] });

        res.send(SuccessRes('Book added to favorites successfully'));
    } catch (e) {
        next(e);
    }
};


// Get User's Favorite Books API
const getUserFavoriteBooks = async (req, res, next) => {
    try {
        const { id } = req.user;
        // Execute the SQL query to retrieve favorite books for the user
        const query = `
            SELECT b.id, b.bookName, b.author, b.description, b.imagePath
            FROM tbl_books b
            INNER JOIN tbl_favorites f ON b.id = f.bookId
            WHERE f.userId = ?
        `;
        const [favoriteBooks] = await sequelize.query(query, { replacements: [id] });

        res.send(SuccessRes('Favorite books retrieved successfully', favoriteBooks));
    } catch (e) {
        next(e);
    }
};

// Remove Favorite Book API
const removeFavoriteBook = async (req, res, next) => {
    try {
        const { id: bookId } = req.params;
        const { id: userId } = req.user;

        const query = 'DELETE FROM tbl_favorites WHERE userId = ? AND bookId = ?';
        const [result] = await sequelize.query(query, { replacements: [userId, bookId] });

        if (result.affectedRows === 0) {
            throw new NotFoundError('Book not found');
        }


        res.send(SuccessRes('Book removed from favorites successfully'));
    } catch (e) {
        next(e);
    }
};




const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./public`);
    },
    filename: (req, file, cb) => {
        const date = Date.now();
        const originalname = file.originalname.split(".");
        cb(null, `${date + "." + originalname[1]}`);
    },
});

const upload = multer({
    storage: storage,
    limits: 5000000,
    fileFilter: (req, file, cb) => {
        if (file.originalname.split(".").length > 2) {
            cb(
                new NotAllowedError("File upload only supports the single extention")
            );
        }
        const extantion = ["jpeg", "png", "jpg", "mp4", "mkv", "3gp", "ogg"];
        if (!extantion.includes(file.originalname.split(".")[1].toLowerCase())) {
            cb(
                new NotAllowedError(`Only ( ${extantion.join()} ) Files Are Supported`)
            );
        } else {
            cb(null, true);
        }
    },
});

const uploadFileController = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new BadRequestError("No file was uploaded.");
        }

        const filePath = `/${req.file.filename}`;

        res.send(SuccessRes("File Uploaded Successfully", filePath, 201));
    } catch (e) {
        next(e);
    }
};



module.exports = {
    createBook,
    getAllBooks,
    updateBook,
    deleteBook,
    getBookById,
    upload,
    uploadFileController,
    addFavoriteBook,
    removeFavoriteBook,
    getUserFavoriteBooks
}