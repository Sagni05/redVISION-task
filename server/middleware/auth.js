const { verify } = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../config/config");
const { UnauthorizedError, Unauthorize } = require("../core");

const authenticate = (req, res, next) => {
    try {
        let token = req?.headers?.authorization || req?.headers?.Authorization;

        let user;

        if (!token) {
            throw new UnauthorizedError();
        }

        if (token.split(" ")?.length === 2) {
            user = verify(token.split(" ")[1], TOKEN_SECRET);
        } else {
            user = verify(token, TOKEN_SECRET);
        }

        req.user = user;

        next();
    } catch (e) {
        throw new UnauthorizedError();
    }
};

const authorizeUser =
    (...roles) =>
        (req, res, next) => {
            // console.log(req.user.role);
            if (!roles.includes(req.user.role)) {
                throw new Unauthorize();
            }
            next();
        };

module.exports = { authenticate, authorizeUser };
