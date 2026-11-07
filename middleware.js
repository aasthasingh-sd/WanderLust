const listing = require("./models/listings");
const review = require("./models/review");
const {listingSchema , reviewSchema} = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLogIn = (req,res,next)=>{
    if(! req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create a new listing");
        return res.redirect("/users/login");
    }
    next();
};

module.exports.saveRedirect =(req,res,next)=>{
    if(req.session.redirectUrl){
       res.locals.saveRedirect =  req.session.redirectUrl; 
    }
    next();
};

module.exports.authorization = async(req,res,next)=>{
    let{id} = req.params;
    let list = await listing.findById(id);
    if(!res.locals.currUser && list.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you don't have the permission to perform this action");
        return res.redirect(`/listings/${id}`);
    }
next();
}
module.exports.isAuthor = async(req,res,next)=>{
    let{id,reviewId} = req.params;
    let Review = await review.findById(reviewId);
    if(!Review.author.equals(res.locals.currUser._id)){
        req.flash("error","You did not created this Review");
        return res.redirect(`/listings/${id}`);
    }
next();
}
module.exports.validateReview = (req, res, next ) =>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404,errMsg);
    }else{
        next();
    }
}
module.exports.validateSchema = (req, res, next ) =>{

let { error } = listingSchema.validate(req.body);
    
    if(error){
         let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404,errMsg);
    }else{
        next();
    }
}