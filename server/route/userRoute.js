const { Router } = require("express");
const {
    validate,
    loginBody,
    signUpBody
} = require("../middleware");
const { loginController, signUpUserController } = require("../controller");


const router = Router();

router.post(
    "/login",
    validate(loginBody),
    loginController
);


router.post(
    "/signUp",
    validate(signUpBody),
    signUpUserController
);



module.exports = router;
