require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listings");
const User = require("./models/user");

const dbUrl = process.env.ATLAS_DB;


const initDB = async () => {
    await Listing.deleteMany({});
    const user = await User.findOne();
    if(!user){
        throw new Error("No user found. Create a user first.");
    }else{
        initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: user._id
    }));
    }

    await Listing.insertMany(initData.data);

    console.log("Sample listings initialized successfully!");
};

const main = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log("MongoDB connected successfully!");

        await initDB();

    } catch (err) {
        console.error("Initialization failed:", err);

    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed.");
    }
};

main();
