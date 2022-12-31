const {usersession,checkBlock}=require("../middleware/usersession")
var express=require('express')
var router=express.Router();
var{postUserhome,
    getUserhome,
    getUserSignUp,
    getUserregister,
    // postotp,
    otp,
    getproductdetails,
    userlogin,
    getviewcart,
    getproducts,
    postviewcart,
    changequantity,
    deletecartproduct,
    getprofile,
    getaddress,
    addresdetails,
    deleteaddress,
    geteditaddress,
    getcheckout,
    userlogout,
    payment,
    PostEditaddress}=require("../controllers/usercontroler")


    //get methods
    
    router.get("/",getUserhome);
    router.get("/userlogin",userlogin);
    router.get("/usersignup",getUserSignUp);
    router.get("/logout",userlogout);
    router.get("/getproductdetails/:id",usersession,checkBlock,getproductdetails);
    router.get("/getviewcart",usersession,getviewcart);
    router.get("/products",getproducts);
    router.get("/otp",otp);
    router.get("/profile",usersession,checkBlock,getprofile);
    router.get("/address",usersession,checkBlock,getaddress);
    router.get("/editaddress/:id",usersession,checkBlock,geteditaddress);
    router.get("/getcheckout",usersession,checkBlock,getcheckout)
   


    //post methods
    
    router.post("/register",getUserregister);
    router.post("/gethome",postUserhome);
    // router.post("/userlogin",postotp);
    router.post('/postviewcart/:id',postviewcart);
    router.post("/addressdetails",addresdetails);
    router.post("/checkout",payment)
    router.post("/PostEditaddress/:id",PostEditaddress)
    

    
    
    
    router.delete('/deleteaddress/',usersession,checkBlock,deleteaddress)

    
    
    router
        .route("/cart/")
        .patch(changequantity)
        .delete(deletecartproduct)


   




module.exports = router;