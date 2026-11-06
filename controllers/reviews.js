const listing = require("../models/listings");
const reviews = require("../models/review");


module.exports.createReview = async(req,res)=>{
    let list = await listing.findById(req.params.id);
    let newReview = new reviews(req.body.review);
    newReview.author = req.user._id;
    list.reviews.push(newReview);

    await newReview.save();
    await list.save();

    req.flash("success","New Review created");
   res.redirect(`/listings/${list._id}`);

};

module.exports.destroyReview = async(req,res)=>{
    let {id , reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull :{reviews : reviewId} });
    await reviews.findByIdAndDelete(reviewId);
     req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
};