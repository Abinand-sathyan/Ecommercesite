var express=require('express')
var router=express.Router();
var{getUserhome,getUserlogin,getUserSignUp}=require("../controllers/usercontroler")

router.get("/",getUserhome);
router.get("/userlogin",getUserlogin);
router.post("/usersignup",getUserSignUp);

module.exports = router;