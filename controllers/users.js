const User = require("../models/user");

module.exports.renderSignup = (req,res) =>{
    res.render("./users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
    try{
    let{username, email , password} = req.body;
    let newUser = new User({email , username});
   let regUser= await User.register(newUser,password);
   console.log(regUser);
   req.login(regUser,(err)=>{
    if(err){
        return next(err);
    }
   req.flash("success","welcome to WanderLust!!")
   res.redirect('/listings');
   })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogin = (req,res) =>{
    res.render("./users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to WanderLust!");
    let redirection = res.locals.saveRedirect || "/listings";
    res.redirect(redirection);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","you are successfully logged out!");
      res.redirect("/listings");
    })
};