require("dotenv").config();

const {
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    PORT,
    TOKEN_SECRET,
} = process?.env;

if (
    !DB_NAME ||
    !DB_USER ||
    !DB_PASSWORD ||
    !DB_HOST ||
    !PORT ||
    !TOKEN_SECRET
) {
    throw new Error("Your env Configuration Is Incompleted");
}

const envConfigs = {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    PORT,
    TOKEN_SECRET,
};

module.exports = envConfigs;
