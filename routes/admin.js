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
    categoryDelete,
    categoryEdit,
    posteditcategory,
    getproductlist,
    getaddproduct,
    postproductdata} = require("../controllers/admincontroler");


    router.get("/",getAdmin);
    router.post("/Adminlogin",AdminLogin);
    router.get("/userdetails",getusers);
    router.get("/block/:id",blockuser);
    router.get("/unblock/:id",unblockuser);
    router.get("/categorylist",getcategorylist);
    router.get("/getaddcategory",getaddcategory);
    router.post("/postaddcategory",upload.array("ImageURL",3),postaddcategory);
    router.post("/posteditcategory/:id",upload.array("ImageURL",3),posteditcategory);
    router.get("/categoryDelete/:id",categoryDelete);
    router.get("/categoryEdit/:id",categoryEdit)
    router.get("/getproductlist",getproductlist)
    router.get("/getaddproduct",getaddproduct)
    router.post("/postproductdata",upload.array("ImageURL",4),postproductdata);

   


module.exports = router;