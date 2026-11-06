const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirect} = require("../middleware");

const userController = require("../controllers/users");
router.route("/signup")
   .get( userController.renderSignup)
   .post( wrapAsync(userController.signup));

router.route("/login")
   .get(userController.renderLogin)
   .post(saveRedirect,
     passport.authenticate("local",
    {failureRedirect: "/users/login",
    failureFlash: true,
}), userController.login);


//log out route
router.get("/logout",userController.logout);

module.exports = router;