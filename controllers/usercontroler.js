const UserDB = require("../models/userModel");
const categoryDB = require("../models/categorymodel");
const productDB =require("../models/addproductmodel");
const cartDB =require("../models/cartmodel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { sendotp, verifyotp } = require("../verification/otp");
// const {
//   SecondaryAuthTokenPage,
// } = require("twilio/lib/rest/accounts/v1/secondaryAuthToken");
const { render } = require("ejs");
const { response } = require("express");


const getUserhome = async(req, res) => {
  const categorylist=await categoryDB.find();
  const productlist=await productDB.find();
  res.render("user/userHome",{categorylist,productlist,user:req.session.user});
};


const userlogin=(req,res)=>{
  res.render("user/UserLogin")
}



const getUserSignUp = (req, res) => {
  res.render("user/userSignUp");
};
const otp = (req, res) => {
  res.render("user/otpverification");
};
const getUserregister = async (req, res) => {
  console.log(req.body);
  const pass1 = req.body.password;
  const pass2 = req.body.confirm_password;
  const email = req.body.email_address;
  const Number = req.body.mobile_number;
if (pass1 !== pass2) {
    console.log("password not match");
    res.redirect("/usersignup");
  } else {
    const hashpassword = await bcrypt.hash(pass1, 10);
    const hashpassword1 = await bcrypt.hash(pass2, 10);

    console.log(hashpassword, hashpassword1);
    await UserDB.findOne({ email_address: email }).then(async (user) => {
      console.log(user);
      if (user) {
        console.log("exist email");
        res.redirect("/usersignup");
      } else {
        user = UserDB({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email_address: req.body.email_address,
          password: hashpassword,
          confirm_password: hashpassword1,
          mobile_number: req.body.mobile_number,
        });

        await user.save();
        console.log(user);
        console.log("sucessfully acces");
        res.render("user/userlogin");
        // sendotp(Number)
        // req.session.user1=req.body
        // console.log( req.session.user1);

        //    res.render('user/otpverification')
        //    console.log("redirected")
      }
    });
  }
};



// const postotp = async (req, res) => {
//     console.log("haiinelooo")
//     console.log(req.body)

//     const otp = req.body.otp;

//     console.log("hellooooo233223")
//     const { first_name,last_name,email_address, password,confirm_password,mobile_number} = req.session.user1;
//     console.log(first_name);
//     await verifyotp(mobile_number, otp).then(async(verification_check)=>{
//         if(verification_check.status=="approved"){
//             console.log(password)
//             console.log("hellooooo2385296525696525665253223")
//             const hashpassword=await bcrypt.hash(password,10)
//             const hashpassword1=await bcrypt.hash(confirm_password,10)
//             user = UserDB({
//                 first_name: first_name,
//                 last_name: last_name,
//                 mobile: mobile,
//                 email_address: email_address,
//                 password:hashpassword,
//                 confirm_password:hashpassword1
//                     });
//                 user.save();

//                 console.log(user)
//                 res.render('user/UserLogin')

//         }
//         else{
//             req.send("otp error")
//         }
//      })

// }
const postUserhome = async (req, res) => {
  try{
  console.log("started login");
  console.log(req.body);

  const { email, password } = req.body;
  console.log(email);
  const userdetails = await UserDB.findOne({ email_address: email });
  if (userdetails) {
    console.log("successfull user");
    console.log(userdetails.password);
    await bcrypt.compare(password, userdetails.password, (err, data) => {
      console.log("data" + data);

      if (err) throw err;
      else if (data == true) {
        if(userdetails.block==true){
        console.log("console success");
        req.session.LoggedIn=true;
        req.session.user=userdetails;
        res.redirect("/");
      }
      else{
          console.log("User blocked");
          res.redirect("/userlogin");
      }
      } else {
        console.log("wrong password");
        res.redirect("/userlogin");
      }
    });
  }
}
catch{
  console.log("catched");
}
};


const getproductdetails= async(req,res)=>{
  console.log(req.params.id);
  const product_dtails = req.params.id
  const productsdatails= await productDB.findById({_id:product_dtails})
  console.log(productsdatails);
  res.render("user/productdetails",{productsdatails,user:req.session.user})


}


const getproducts=async(req,res)=>{
  const categorylist=await categoryDB.find();
  const productlist=await productDB.find();
  res.render("user/products",{categorylist,productlist,user:req.session.user})
}


const getviewcart=async (req,res)=>{
  try{
  const userId=req.session.user._id;
  console.log(userId);
  const cartitems=await cartDB.findOne({owner:mongoose.Types.ObjectId(userId)}).populate("items.productDedtails");
  console.log(cartitems);
  console.log("iugacdsy");
  res.render("user/viewcart",{cartitems,user:req.session.user})
}catch(err){
  console.log(err);
}
}






const postviewcart=async(req,res)=>{
  try{
 const productId=req.params.id;
 const User=req.session.user._id;
 console.log(productId,User);
 const user=await cartDB.findOne({owner:User})
 const product=await productDB.find({_id:productId})
 console.log(product,user);

 if(product[0].quantity<1){
  console.log("noo adition");
 }
else{
  const productprize=product[0].Prize
  if(!user){
    const Addtocart=await cartDB({
      owner:User,
      items:[{productDedtails:productId,total:productprize}],
      totalCart:productprize
    });
    Addtocart.save()
    .then((resp)=>{
      console.log(resp);
    })
  }
  else{
    const existProduct= await cartDB.findOne({
      owner:User,
      "items.productDedtails":productId
    })
    if(existProduct){
      console.log(existProduct+"+++++++++++++++++++")
      await cartDB.updateOne({ owner:User, "items.productDedtails":productId},
      {$inc:{"items.$.quantity":1,"items.$.total":productprize,totalCart:productprize}})
      .then((response)=>{
        console.log(response)
        })
        .catch((err)=>{
          console.log(err);
        });
      }
      else{
        await cartDB.updateOne({owner:User},{$push:{items:{productDedtails:productId,total:productprize}},
          $inc:{totalCart:productprize}

        })
      }
  }
}
  }
  catch{
    console.log("err");
  }
}




const changequantity=async(req,res)=>{
  try{
    console.log(req.body);
    const{cartId,productId,count}=req.query;
    console.log(cartId,productId,count,"ugdshfghdsVHgHVDA");
    const product=await productDB.findOne({_id:productId})
    if(count==1){
      var productprice=product.Prize;
    }
    else{
      var productprice=-product.Prize;
    }
    const cart=await cartDB.findOneAndUpdate({_id:cartId,"items.productDedtails":productId},
    {$inc:{"items.$.quantity":count,
    "items.$.total":productprice,
    totalCart:productprice},
  }).then(()=>{
    res.json();
  });
  }
  catch(error){
    res.render("admin/errorpage")

  }

};



const deletecartproduct=async(req,res)=>{
try{
console.log("cart delete");
const productId=req.query.productId
// console.log(productId,productId,"theeeeeeeeeeeeeeeeeee");
const userId=req.session.user;
console.log(productId,userId,"theeeeeeeeeeeeeeeeeee");
const product=await productDB.findOne({_id:productId})
console.log(product);
const productprize=product.Prize; 
const deleteproduct=await cartDB.findOneAndUpdate(
  {owner:userId},
  {$pull:{
    items:{productDedtails:productId}
  },
$inc:{totalCart:-productprize},
});
deleteproduct.save().then(()=>{
 res.json("success");
});
}
catch(error){
res.render("admin/errorpage");
}
};







module.exports = {
  getUserhome,
  getUserSignUp,
  getUserregister,
  postUserhome,
  // postotp,
  otp,
  getproductdetails,
  userlogin,
  getviewcart,
  getproducts,
  postviewcart,
  changequantity,
  deletecartproduct,
};
