const { sign } = require("jsonwebtoken");
const { SuccessRes, BadRequestError } = require("../core");
const { genSalt, hash, compare } = require("bcryptjs");
const { TOKEN_SECRET } = require("../config/config");
const sequelize = require("../config/db");

const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Fetch user from the database based on email
        const existUser = "SELECT * FROM tbl_m_user WHERE email = ?"
        const [user] = await sequelize.query(existUser, {
            replacements: [email],
        });

        // Check if user exists
        if (user.length == 0) {
            throw new BadRequestError("User does not exist. Please check the email and try again.");
        }


        // Compare passwords
        const matchPassword = await compare(password, user[0].password);
        if (!matchPassword) {
            throw new BadRequestError("Password does not match. Please check and try again.");
        }

        // Generate JWT token
        const token = sign({ id: user[0].id, email: user[0].email, role: user[0].roleId }, TOKEN_SECRET);
        res.send(SuccessRes("User logged in successfully", token));
    } catch (e) {
        next(e);
    }
};

const signUpUserController = async (req, res, next) => {
    try {
        const { fullName, email, contactNo, password } = req.body;

        // Check if email already exists
        const existUserQuery = "SELECT * FROM tbl_m_user WHERE email = ?"
        const [existingEmail] = await sequelize.query(existUserQuery, {
            replacements: [email],
        });
        if (existingEmail.length > 0) {
            throw new BadRequestError("User email already exists. Please change the email and try again.");
        }

        // Check if contact number already exists
        const existNumber = "SELECT * FROM tbl_m_user WHERE contactNo = ?"
        const [existingContactNo] = await sequelize.query(existNumber, {
            replacements: [contactNo],
        });
        if (existingContactNo.length > 0) {
            throw new BadRequestError("Provided contact number is already in use.");
        }

        // Hash password
        const salt = await genSalt(12);
        const hashPassword = await hash(password, salt);

        // Insert new user into the database
        const insertUser = "INSERT INTO tbl_m_user (fullName, email, contactNo, password) VALUES (?, ?, ?, ?)"
        await sequelize.query(
            insertUser,
            {
                replacements: [fullName, email, contactNo, hashPassword],
            }
        );

        res.send(SuccessRes("User signed up successfully"));
    } catch (e) {
        next(e);
    }
};

module.exports = {
    loginController,
    signUpUserController,
};
