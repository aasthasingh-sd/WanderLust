const mongoose = require("mongoose");
const initData = require("./data");
const listing = require("../models/listings");

main()
.then(() =>{
    console.log("connection successful");
}).catch(err =>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

const initDB = async() =>{
    await listing.deleteMany({});
    
    initData.data = initData.data.map((obj)=>({...obj,owner:'6adc862714075e6523aac922'})
    );
    await listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();