const express = require("express");
const cors = require("cors");
const { json, urlencoded } = express;
const { join } = require("path");
const { ErrorRes } = require("./core");
const { PORT } = require("./config/config");
const { userRouter, bookRouter } = require("./route");

const app = express();

app.use(
    cors({
        origin: "*",
    })
);

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));


app.use("/user", userRouter);
app.use("/book", bookRouter);

app.use((err, req, res, next) => {
    if (err) {
        let { statusCode, message } = err;
        return res
            .status(statusCode || 500)
            .send(ErrorRes(message || "Internal Server Error", statusCode || 500));
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
