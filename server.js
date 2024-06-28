const express = require("express");
const connectDb = require("./connect.js");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./authMiddleware.js");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use("/", require("./routes/main.js"));
app.use("/blogs", authMiddleware, require("./routes/blogs.js"));
app.use("/comments", authMiddleware, require("./routes/commentSection.js"));

app.all("*", (req, res) => {
    res.status(404).render("not_found.ejs");
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    connectDb(process.env.MONGO_URI);
})

