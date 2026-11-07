if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
};

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const lists = require("./routes/list");
const Review = require("./routes/Rev");
const UserRoute = require("./routes/User");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User =require("./models/user");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);

const port = process.env.PORT || 8080;
const dbUrl = process.env.ATLAS_DB;
main()
.then(()=>{
    console.log("connection successful");
}).catch(err =>{ console.log(err)});

async function main(){
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret :  process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log('Some error occured in Mongo Store');
});

const sessionOptions ={
    store,
    secret : process.env.SECRET,
    resave:false,
    saveUninitialized : true
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings",lists);
app.use("/listings/:id/reviews",Review);
app.use("/users",UserRoute);

app.use((err, req,res,next) =>{
     console.error("========== ACTUAL ERROR ==========");
     console.error(err);
    console.error(err.stack);

    let{ statusCode = 500 , message = 'Error occured'} = err;
    res.status(statusCode).render("./listings/error.ejs" , { message });
});

app.get("/", (req, res) => {
   res.redirect("/listings");
});


app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});