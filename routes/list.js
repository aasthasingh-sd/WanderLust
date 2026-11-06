const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {isLogIn,validateSchema,authorization} = require("../middleware");
const listingController = require("../controllers/Listing");
const { listingSchema } = require("../schema");
const multer  = require('multer');
const { storage } = require("../cloudConfig");
const upload = multer({storage});


//Index Route
router.get("/", wrapAsync(listingController.index));
//New Route
//Get form
router.get("/new",isLogIn,listingController.getNewForm);

//Post form
router.post("/",upload.single("listing[image][url]"),validateSchema,wrapAsync(listingController.postNewForm));

//Show Route
router.get("/:id", wrapAsync (listingController.showListing));

//get edit form
router.get("/:id/edit",isLogIn,authorization, wrapAsync (listingController.getEditForm));

//put route
router.put("/:id",upload.single("listing[image][url]"),validateSchema,isLogIn,authorization, wrapAsync(listingController.UpdateForm));

//delete route
router.delete("/:id",isLogIn,authorization, wrapAsync (listingController.DestroyListing));


module.exports = router;