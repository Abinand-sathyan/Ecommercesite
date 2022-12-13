var express=require('express')
var router=express.Router();
var{getUserhome,
    getUserlogin,
    getUserSignUp,
    getUserregister,
    postotp,
    otp}=require("../controllers/usercontroler")

    router.get("/",getUserlogin);
    router.get("/usersignup",getUserSignUp);
    router.post("/register",getUserregister);
    router.post("/gethome",getUserhome);
    router.post("/userlogin",postotp);
    router.get("/otp",otp);



module.exports = router;