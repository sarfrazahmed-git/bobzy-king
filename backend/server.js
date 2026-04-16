require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const authRouter = require("./routes/authRouter")
const cors = require("cors")
const cookieParser = require("cookie-parser")


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(cookieParser())
app.use("/auth", authRouter)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
