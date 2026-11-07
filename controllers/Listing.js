const listing = require("../models/listings");
const reviews = require("../models/review");
const multer  = require('multer');
const { storage } = require("../cloudConfig");
const upload = multer({storage});
const ExpressError = require("../utils/ExpressError");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.nav = async (req, res) => {
    let { location } = req.query;
    if(location == ""){
        req.flash("error","Location not found!");
    }else{
    let filter = {};

    if (location) {
        filter.location = {
            $regex: location,
            $options: "i"
        };
    }

    let lists = await listing.find(filter);

    res.render("./listings/index.ejs", {
        lists,
        selectedLocation: location
    });}
};

module.exports.index = async (req, res) => {
    let { category } = req.query;
    let filter ={};
    if(category){
        filter.category = category;
    }
   
    let lists = await listing.find(filter);
    res.render("./listings/index.ejs", { lists,selectedCategory: category });
};

module.exports.getNewForm =(req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.postNewForm = async(req,res)=>{
    let response = await geocodingClient.forwardGeocode({
  query:`${req.body.listing.location}, ${req.body.listing.country}`,
  limit: 1
})
  .send();

    let url = req.file?.path || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b";
    let filename = req.file?.filename || "defaultImage";
    let newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    
    if (!response.body.features.length) {
    throw new ExpressError(400, "Location not found!");
}
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success","New listing created");
    res.redirect("/listings");
};

module.exports.showListing = async(req,res) =>{
    let {id} = req.params;
    let list = await listing.findById(id).populate("reviews").populate("owner");
    if(!list){
        req.flash("error","The list you are trying to access does not exists");
        return res.redirect("/listings");
    }
    console.log(list);
    res.render("./listings/show.ejs", { list});
};

module.exports.getEditForm = async(req,res)=>{
    let {id} = req.params;
    let list = await listing.findById(id);
    if(!list){
        req.flash("error","The list you are trying to access does not exists");
        return res.redirect("/listings");
    }

    res.render("./listings/edit.ejs",{ list});
};
module.exports.UpdateForm = async(req,res)=>{
    let { id } = req.params;
    let list = await listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file?.path;
    let filename = req.file?.filename;
    list.image = {url,filename};
    await list.save();
    }
    req.flash("success","listing updated");
    res.redirect("/listings");
};
module.exports.DestroyListing = async(req,res)=>{
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
     req.flash("success","listing Deleted");
    res.redirect("/listings");
};