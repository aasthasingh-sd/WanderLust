const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const {isLogIn,isAuthor,validateReview} = require("../middleware");
const listing = require("../models/listings");

const reviewController = require("../controllers/reviews");
const reviews = require("../models/review");


//post route
router.post("/",validateReview,isLogIn, wrapAsync(reviewController.createReview));

//Reviews delete
router.delete("/:reviewId" ,isLogIn,isAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router;
