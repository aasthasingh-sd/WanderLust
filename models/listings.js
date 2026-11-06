const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
     description:{
        type:String,
    },
    image: {
    filename: {
        type: String,
        default: "listingimage"
    },
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"
    }
    },
     price:{
        type:Number,
       
    },
     location:{
        type:String,
    },
     country:{
        type:String,
    },
    reviews:[
        {
            type : Schema.Types.ObjectId,
            ref : "review",
        },
    ],
    owner:{
        type:  Schema.Types.ObjectId,
        ref :"user",
    },
    geometry:{
        type:{
            type: String,
            enum : ['Point'],
            required:true,
        },
        coordinates:{
            type:[Number],
            required:true,
        }
    },
    category:{
        type:String,
        enum:['Farms','Trending','Pools','Arctic','Sunny','Mountains','Beach','Bed','Homes','Ships','Castles'],
    }
});
listingSchema.post("findOneAndDelete" , async(listing)=>{
    if(listing){
        await review.deleteMany({_id: {$in: listing.reviews} });
}})


const listing = mongoose.model("list",listingSchema);
module.exports = listing;