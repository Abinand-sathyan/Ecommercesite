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
    }=require("../controllers/usercontroler")

    router.get("/",getUserhome);
    router.get("/userlogin",userlogin);
    router.get("/usersignup",getUserSignUp);
    router.post("/register",getUserregister);
    router.post("/gethome",postUserhome);
    router.get("/getproductdetails/:id",usersession,checkBlock,getproductdetails);
    // router.post("/userlogin",postotp);
    router.get("/getviewcart",usersession,getviewcart);
    router.post('/postviewcart/:id',postviewcart);
    router.get("/products",getproducts);
    router.get("/otp",otp);
   

    router
          .route("/cart/")
          .patch(changequantity)
          .delete(deletecartproduct)


    //       router
    // .route('/cart/')
    // .get(userSession,checkBlock,cartView )
    // .patch( cartChangeQuantity )
    // .delete( deleteCartProduct)




module.exports = router;