var express = require('express');
var router = express.Router();

const userModel = require("../models/userModel");
const Data = require("../models/tododata");

router.get('/', function(req, res, next) {
  res.render('index', { title: 'TODO' });
});

router.get("/login",function(req, res, next){
  res.render("login", { title: "Login page"})
});
router.post("/login", async function (req, res, next){
  try {
    const { email, password} = req.body;
    const user = await userModel.findOne({email});
    if (user === null){
      return res.send(`email not found. <a href="/login"> login again</a>`)
    }
    if( user.password !== password){
      return res.send(`Incorrect password. <a href="/login">signin</a>`);
    }
    res.redirect("/profile");
  } catch (error) {
    console.log(err);
  }
});

// ----------------------------------end------------------
router.get("/signup",function(req, res, next){
  res.render("signup", { title: "sign up page"})
});
router.post("/signup", async function(req, res, next){
  try {
    const newuser = new userModel(req.body);
    await newuser.save();
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
});
// ---------------------end-------------------
router.get("/profile", async function (req, res, next){
  const posts = await Data.find();
  res.render("profile",{ posts});
});

// ----------------------end----------------
router.get("/createtask",function (res, res, next){
  res.render("createtask",{ title: "fill your todo application"});
});
router.post("/createtask", async function (req, res, next){
  try {
    const newdata = new Data(req.body);
    await newdata.save();
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
  }
});
// ------------------------------------end-----------------------------
router.get("/delete/:id", async function(req, res, next){
  try {
    await Data.findByIdAndDelete(req.params.id);
     res.redirect("/profile");
  } catch (error) {
    res.send(error);
  }
});
// --------------------------------end----------------------
router.get("/update/:id",async function(req, res, next){
  try {
    const todata = await Data.findById(req.params.id);
    res.render("update",{post:todata})
  } catch (error) {
    console.log(error)
  }
});
router.post("/update/:id", async function(req, res, next){
  try {
    await Data.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/profile");
  } catch (error) {
    res.send(error);
  }
});







module.exports = router;
