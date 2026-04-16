const express = require('express');
const {signup, login} = require("../controllers/authcontrollers")
router = express.Router();

router.use("/signup", signup)
router.use("/login", login)

module.exports = router