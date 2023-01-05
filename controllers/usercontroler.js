const UserDB = require("../models/userModel");
const categoryDB = require("../models/categorymodel");
const productDB = require("../models/addproductmodel");
const cartDB = require("../models/cartmodel");
const AddresDB = require("../models/address");
const orderdB = require("../models/ordermodel")
const bannerDB=require("../models/bannermodel")
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { sendotp, verifyotp } = require("../verification/otp");
// const {
//   SecondaryAuthTokenPage,
// } = require("twilio/lib/rest/accounts/v1/secondaryAuthToken");
const { render } = require("ejs");
const { response } = require("express");

const getUserhome = async (req, res) => {
  try{
  const categorylist = await categoryDB.find();
  const productlist = await productDB.find();
  const bannerdata = await bannerDB.find();
  res.render("user/userHome", {
    categorylist,
    productlist,
    bannerdata,
    user: req.session.user,
   });
}catch(error){
  res.render("admin/errorpage")
};
}


const userlogin = (req, res) => {
  res.render("user/UserLogin",{usRblockERR:req.flash("usRblockERR"),
  passERR:req.flash("passERR")});
};


const userlogout=(req,res)=>{
  req.session.destroy()
  res.redirect("/userlogin")
}


const getUserSignUp = (req, res) => {
  res.render("user/userSignUp",{
 PassMatchERR:req.flash("PassMatchERR")
,EmailExist:req.flash("EmailExist")});
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
    req.flash("PassMatchERR","password does not match")
    res.redirect("/usersignup");
  } else {
    const hashpassword = await bcrypt.hash(pass1, 10);
    const hashpassword1 = await bcrypt.hash(pass2, 10);

    console.log(hashpassword, hashpassword1);
    await UserDB.findOne({ email_address: email }).then(async (user) => {
      console.log(user);
      if (user) {
        console.log("exist email");
        req.flash("EmailExist","Email already exist")
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
  try {
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
          if (userdetails.block == true) {
            console.log("console success");
            req.session.LoggedIn = true;
            req.session.user = userdetails;
            res.redirect("/");
          } else {
            console.log("User blocked");
            req.flash("usRblockERR","YoU are blocked")
            res.redirect("/userlogin");
          }
        } else {
          console.log("wrong password");
          req.flash("passERR","Wrong passwor or email")
          res.redirect("/userlogin");
        }
      });
    }
  } catch(error){
    res.render("admin/errorpage")
  }
};


const getproductdetails = async (req, res) => {
  try{
  console.log(req.params.id);
  const product_dtails = req.params.id;
  const productsdatails = await productDB.findById({ _id: product_dtails });
  console.log(productsdatails);
  res.render("user/productdetails", {
    productsdatails,
    user: req.session.user,
  });
}catch(error){
  res.render("admin/errorpage");
};
}


const getproducts = async (req, res) => {
  try{
  const categorylist = await categoryDB.find();
  const productlist = await productDB.find();
  res.render("user/products", {
    categorylist,
    productlist,
    user: req.session.user,
  });
}catch(error){
  res.render("admin/errorpage")
};
}


const getviewcart = async (req, res) => {
  try {
    const userId = req.session.user._id;
    console.log(userId);
    const cartitems = await cartDB
      .findOne({ owner: mongoose.Types.ObjectId(userId) })
      .populate("items.productDedtails");
    if(cartitems.items.length!==0){
    res.render("user/viewcart", { cartitems, user: req.session.user });
    }else{
      res.render("user/emptycart", {user: req.session.user });
    }
  } catch (error) {
    res.render("admin/errorpage")
  }
};


const postviewcart = async (req, res) => {
  try {
    const productId = req.params.id;
    const User = req.session.user._id;
    console.log(productId, User);
    const user = await cartDB.findOne({ owner: User });
    const product = await productDB.find({ _id: productId });
    console.log(product, user);
    let price;
    if(product.discountPrice<product.Prize&&product.discountPrice!=0){
     price=product[0].discountPrice;
    }else{
      price=product[0].Prize;
    }

    if(product[0].quantity < 1) {
      console.log("noo adition");
      res.json({noAvailability:true})
    } else {
      const productprize = product[0].Prize;
      if (!user) {
        const Addtocart = await cartDB({
          owner: User,
          items: [{ productDedtails: productId, total: productprize }],
          totalCart: productprize,
        });
        Addtocart.save().then((resp) => {
          console.log(resp);
        });
      } else {
        console.log("=====================");
        const existProduct = await cartDB.findOne({
          owner: User,
          "items.productDedtails": productId,
        });
        if (existProduct !=null) {
          console.log("+++++++++++++++++++++++++");
         const  proQuantity=await cartDB.aggregate([
          {
            $match:{owner:mongoose.Types.ObjectId(User)}},
            {
              $project:{
                items:{
                  $filter:{
                    input:"$item",
                    cond:{
                      $eq:[
                        "$$this.productDedtails",
                        mongoose.Types.ObjectId(productId)
                      ],
                    },
                  },
                },
              },
            },
         ]);
    console.log(proQuantity,"00000000000000000000000");
    const quantity=  proQuantity[0].items[0].quantity;
    console.log(quantity,"--------------------------------------------");
    if(product.quantity<=quantity){
      res.json({ stockReached: true });
    }else{ console.log(existProduct + "+++++++++++++");
          await cartDB
            .updateOne(
              { owner: User, "items.productDedtails": productId },
              {
                $inc: {
                  "items.$.quantity": 1,
                  "items.$.total": productprize,
                  totalCart: productprize,
                },
              }
            )
            .then((response) => {
              console.log(response);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
        else {
          await cartDB.updateOne(
            { owner: User },
            {
              $push: {
                items: { productDedtails: productId, total: productprize },
              },
              $inc: { totalCart: productprize },
            }
          );
        }
      }
    }
  } catch(error){
    res.render("admin/errorpage")
  }
};


const changequantity = async (req, res) => {
  try {
    console.log(req.body);
    const { cartId, productId, count } = req.query;
    console.log(cartId, productId, count, "ugdshfghdsVHgHVDA");
    const product = await productDB.findOne({ _id: productId });
    if (count == 1) {
      var productprice = product.Prize;
    } else {
      var productprice = -product.Prize;
    }
    const cart = await cartDB
      .findOneAndUpdate(
        { _id: cartId, "items.productDedtails": productId },
        {
          $inc: {
            "items.$.quantity": count,
            "items.$.total": productprice,
            totalCart: productprice,
          },
        }
      )
      .then(() => {
        res.json();
      });
  } catch (error) {
    res.render("admin/errorpage");
  }
};





const deletecartproduct = async (req, res) => {
  try {
    console.log("cart delete");
    const productId = req.query.productId;
    // console.log(productId,productId,"theeeeeeeeeeeeeeeeeee");
    const userId = req.session.user;
    console.log(productId, userId, "theeeeeeeeeeeeeeeeeee");
    const product = await productDB.findOne({ _id: productId });
    console.log(product);
    const cart= await cartDB.findOne({owner:userId})
  
    const index= await cart.items.findIndex((el)=>{
      return el.productDedtails==productId;
    })
    const productprize = cart.items[index].total;
    const deleteproduct = await cartDB.findOneAndUpdate(
      { owner: userId },
      {
        $pull: {
          items: { productDedtails: productId },
        },
        $inc: { totalCart: -productprize },
      }
    );
    deleteproduct.save().then(() => {
      res.json("success");
    });
  } catch (error) {
    res.render("admin/errorpage");
  }
};


const getprofile = async (req, res) => {
  try{
  const User = req.session.user._id;
  const addressdetails = await AddresDB.findOne({ User: User });
  let address;
  if (addressdetails) {
    address = addressdetails.Address;
  } else {
    address = [];
  }
  res.render("user/profile", { address, user: req.session.user });
}catch(error){
  res.render("admin/errorpage")
};
}


const getaddress = (req, res) => {
  try{
  res.render("user/address", { user: req.session.user });
}catch(erro){
  res.render("admin/errorpage");
}
};



const addresdetails = async (req, res) => {
  try {
    console.log(req.body);
    const { Fname, Pincode, Addressline, city, State, Country } = req.body;
    if (Fname && Pincode && Addressline && city && State && Country) {
      const userId = req.session.user._id;
      console.log(userId);
      const Existuser = await AddresDB.findOne({ User: userId });
      console.log(Existuser);
      if (Existuser) {
        await AddresDB.findOneAndUpdate(
          { User: userId },
          { $push: { Address: [req.body] } }
        ).then(() => {
          res.redirect("/profile");
        });
      } else {
        const addaddress = await AddresDB({
          User: userId,
          Address: [req.body],
        });
        await addaddress.save().then(() => {
          res.redirect("/profile");
        });
      }
    } else {
      console.log("DSFHGFHJFi");
      res.redirect("/address");
    }
  }catch {
    (error) => {
      res.render("admin/errorpage");
    };
  }
};


const deleteaddress= async (req,res)=>{
  try{
  const userId=req.session.user._id;
  const addressId=req.query.addressId;
  console.log(addressId);
  await AddresDB.updateOne({User:userId},{$pull:{Address:{_id:addressId}}})
  res.json("success")
  }catch(error){
    res.render("admin/errorpage");
  }
}


const geteditaddress=async(req,res)=>{
  try{
console.log(req.params.id);
const user=req.session.user._id
const addressdetails= await AddresDB.findOne({User:user})
console.log(addressdetails);
const address= addressdetails.Address.find((el)=>
  el._id.toString()===req.params.id
);
console.log(address);
  res.render("user/editaddress",{address,user: req.session.user,EdiaddressERR:req.flash("EdiaddressERR") })
}catch(error){
  res.render("admin/errorpage")
}
}



const PostEditaddress=async(req,res)=>{
  try{
  console.log(req.params.id);
  const addressId=req.params.id;
  const { Fname, Pincode, Addressline, city, State, Country } = req.body;
  if(Fname&&Pincode&&Addressline&&city&&State&&Country )
  {
    const address= await AddresDB.findOne({User:req.session.user})
    console.log(address);
    const chngaddrss=await AddresDB.updateMany({
             "address._id":addressId  
    },
    {
      $set:{
        "address.$.Fname":Fname,
        "address.$.Pincode":Pincode,
        "address.$.Addressline":Addressline,
        "address.$.city":city,
        "address.$.State":State,
        "address.$.Country":Country,
      },
      new:true
    },
    {upsert:true})
    res.redirect("/profile")
  }else{
    req.flash("EdiaddressERR","Full fill the coloms")
    res.redirect("/editaddress/"+req.params.id)
  }
  console.log(chngaddrss);
}catch(error){
  res.render("admin/errorpage")
}
}





const  getcheckout=async(req,res)=>{
  try{
  const User = req.session.user._id;
  const addressdetails = await AddresDB.findOne({ User: User });
  const cartitems = await cartDB
  .findOne({ owner: mongoose.Types.ObjectId(User) })
  .populate("items.productDedtails");
   let address;
  if (addressdetails) {
    address = addressdetails.Address;
  } else {
    address = [];
  }
  res.render("user/checkout", {cartitems, address, user: req.session.user,purchasErr:req.flash("purchasErr") });
}catch(error){
  res.render("admin/errorpage")
}
}


const payment =async(req,res)=>{
  const addressindex=req.body.index;
  const paymethod=req.body.paymode;
  console.log(addressindex,paymethod);
  const userid=req.session.user._id;
  const selectedaddress= await AddresDB.findOne({User:userid})
  const address=selectedaddress.Address[parseInt(addressindex)];
  const cartdetails=await cartDB.findOne({owner:userid}).populate("items.productDedtails")
  const cartitem=cartdetails.items;
  console.log(cartitem,address,selectedaddress,"thre threw +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  const carttotal=cartdetails.totalCart;
 if(addressindex&&paymethod)
 {
   if(paymethod==='cash on delivery')
   {
    console.log("the ehbvdiubvskall hoiiii");
     const order= await orderdB({
      UserId:userid,
      Products:cartitem,
      address:address,
      paymentMethod:paymethod,
      total:carttotal,
      orderStatus:'confirm',
      paymentStatus:'peyment pending'
     })
     order.save().then(async()=>{
      const usercart=await cartDB.findOneAndRemove({owner:userid})
       res.json({status:true})
     })
    
   }
}
else
{
  console.log("hayyy");
  req.flash("purchasErr","Select address or Payment method")
  res.redirect("/getcheckout")
}
}




const  ordersucecss=(req,res)=>{
  try{
  res.render("user/ordersuccess",{user: req.session.user })
  }catch(error){
    res.render("admin/errorpage")
  }
}



const  getorderlist=async(req,res)=>{
  try{
  const orderdetials = await orderdB.find({UserId:req.session.user}).populate("UserId").sort({'createdAt':-1});
  console.log(orderdetials,"checkk order listt");
  res.render("user/orderlist",{orderdetials,user: req.session.user })
  }catch(error){
    res.render("admin/errorpage")
  }
}


const orderdetials=async(req,res)=>{
  try{
    
  const odrdtls=await orderdB.findOne({_id:req.params.id}).populate("Products.productDedtails")
  console.log("<><><><><><>>>>><>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><",odrdtls);
     res.render("user/ordersuccess",{odrdtls,user: req.session.user})
}catch(error){
 res.render("admin/errorpage")
}
}






module.exports = {
  getUserhome,
  getUserSignUp,
  getUserregister,
  postUserhome,
  //postotp,
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
  PostEditaddress,
  ordersucecss,
  getorderlist,
  orderdetials
};
