var express=require('express')
var router=express.Router();
var{getUserhome,getUserlogin}=require("../controllers/usercontroler")

router.get("/",getUserhome);
router.get("/userlogin",getUserlogin);

module.exports = router;