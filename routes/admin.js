var express=require('express')
var router=express.Router();
const {getAdmin,AdminLogin} = require("../controllers/admincontroler");


router.get("/",getAdmin);
router.post("/Adminlogin",AdminLogin);


module.exports = router;