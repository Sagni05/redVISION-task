const booksController = require("./booksController")
const userController = require("./userController")


module.exports = {
    ...booksController,
    ...userController
};
