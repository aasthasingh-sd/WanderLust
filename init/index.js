require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listings");

const dbUrl = process.env.ATLAS_DB;
const ownerId = '6aed95c95689c4d93aa4a129';

const initDB = async () => {
    await Listing.deleteMany({});

    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: new mongoose.Types.ObjectId(ownerId)
    }));

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
