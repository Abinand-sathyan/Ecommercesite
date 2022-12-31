const express=require('express')
const upload=require("../middleware/muter")
const session=require("../middleware/adminsession")
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
    postproductdata,
    productDelete,
    getproductedit,
    posteditproduct,
    getorderlist,
    orderdetails} = require("../controllers/admincontroler");


    
    //get methods
    
    router.get("/",getAdmin);
    
    router.get("/userdetails",session,getusers);
    router.get("/block/:id",blockuser);
    router.get("/unblock/:id",unblockuser);
    router.get("/categorylist",session,getcategorylist);
    router.get("/getaddcategory",session,getaddcategory);
    router.get("/categoryDelete/:id",categoryDelete);
    router.get("/categoryEdit/:id",categoryEdit)
    router.get("/getproductlist",session,getproductlist)
    router.get("/getaddproduct",getaddproduct)
    router.get("/productDelete/:id",productDelete);
    router.get("/getproductedit/:id",getproductedit);
    router.get("/getorderlist",session,getorderlist)
    router.get("/orderdetails/:id",orderdetails)
    

    //post methods

    router.post("/Adminlogin",AdminLogin);
    router.post("/postaddcategory",upload.array("ImageURL",3),postaddcategory);
    router.post("/posteditcategory/:id",upload.array("ImageURL",3),posteditcategory);
    router.post("/postproductdata",upload.array("ImageURL",4),postproductdata);
    router.post("/posteditproduct/:id",upload.array("ImageURL",4),posteditproduct);
     





module.exports = router;