const express=require('express')
const upload=require("../middleware/muter")
const router=express.Router();
const {getAdmin,
    AdminLogin,
    getusers,
    blockuser,
    unblockuser,
    getcategorylist,
    getaddcategory,
    postaddcategory,
    getcategory} = require("../controllers/admincontroler");


    router.get("/",getAdmin);
    router.post("/Adminlogin",AdminLogin);
    router.get("/userdetails",getusers);
    router.get("/block/:id",blockuser);
    router.get("/unblock/:id",unblockuser);
    router.get("/categorylist",getcategorylist);
    router.get("/getaddcategory",getaddcategory);
    router.post("/postaddcategory",upload.array("ImageURL",3),postaddcategory);
   


module.exports = router;