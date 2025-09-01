const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json())
app.use(cors());
require("dotenv").config();

// authentication routes
const authRoutes = require("./routes/authRoutes")
const noteRoutes = require("./routes/noteRoutes")
const connectDB = require("./config/db");
const authMiddleware = require("./middlewares/authMiddleware");








// db connection
connectDB();

app.get('/', (req, res) => {
    res.send("hello")
})

app.use('/api', authRoutes)
app.use('/api/notes', authMiddleware, noteRoutes)
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`app is listening on port: ${PORT}`)
})