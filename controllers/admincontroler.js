const UserDB = require("../models/userModel");
const categoryDB = require("../models/categorymodel");
const productDB = require("../models/addproductmodel");
const orderDB = require("../models/ordermodel");
const bannerDB=require("../models/bannermodel")
const mongoose = require("mongoose");
const moment = require("moment");
const { findOne, findById, validate } = require("../models/userModel");

const getAdmin = (req, res) => {
  res.render("admin/Adminlogin");
};

const getusers = async (req, res) => {
  let userdetails = await UserDB.find();
  res.render("admin/userdetails", { userdetails });
};

const blockuser = async (req, res) => {
  const userid = req.params.id;
  // console.log(userid);
  let data = await UserDB.findByIdAndUpdate(userid, { block: false });
  if (data) {
    res.redirect("/admin/userdetails");
  } else {
    res.redirect("/admin/dashboard");
  }
};



const unblockuser = async (req, res) => {
  try{
  console.log("eraagrgwrgWF");
  const userid = req.params.id;
  // console.log(userid);
  let data = await UserDB.findByIdAndUpdate(userid, { block: true });
  // console.log(data);
  if (data) {
    res.redirect("/admin/userdetails");
  } else {
    res.redirect("/admin/dashboard");
    }
}catch(error){
  res.render("admin/errorpage")
}
};





const AdminLogin = (req, res) => {
  try{
  console.log(req.body);
  const AdmineMail = process.env.ADMIN_EMAIL;
  const Adminpassword = process.env.ADMIN_PASSWORD;
  const { email, password } = req.body;
  console.log(email, password);
  console.log(AdmineMail, Adminpassword);

  if (AdmineMail == email && Adminpassword == password) {
    req.session.adminlogin = true;
    res.render("admin/dashboard");
  } else {
    res.redirect("/admin");
  }
}catch(error){
  res.render("admin/errorpage")
}
};

const getcategorylist = async (req, res) => {
  try{
  const categorydata = await categoryDB.find();
  console.log("categories", categorydata);
  res.render("admin/categorylist", { categorydata });
}catch(error){
  res.render("admin/errorpage")
}
};

const getaddcategory = (req, res) => {
  try{
  console.log("the real");
  res.render("admin/addcategory");
}catch(error){
  res.render("admin/errorpage")
}
};

const postaddcategory = async (req, res) => {
  try{
  console.log("vjbkcjkvbvbjvjkvjvjnk");
  console.log(req.body);
  console.log(req.files);
  const reqcategoryname = req.body.categoryname;
  const reqimageUrl = req.files;
  console.log(reqcategoryname, reqimageUrl);
  if (reqcategoryname && reqimageUrl) {
    const Regex = new RegExp(reqcategoryname, "i");
    let DBcategory = await categoryDB.findOne({
      CategoryName: { $regex: Regex },
    });
    console.log(DBcategory);
    if (!DBcategory) {
      Object.assign(req.body, {
        CategoryName: reqcategoryname,
        ImageURL: reqimageUrl,
      });
      console.log(req.body);
      const newcategory = await new categoryDB(req.body);
      await newcategory
        .save()
        .then((result) => {
          console.log("created category");
          res.redirect("/admin/categorylist");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      //   req.flash("catExistErr", "Category already exists");
      res.redirect("/admin/getaddcategory");
      console.log("allready exist");
    }
  } else {
    // req.flash("catAddErr", "Fill full coloms");
    res.redirect("/admin/getaddcategory");
  }
}catch(error){
  res.render("admin/errorpage")
}
};

const categoryDelete = async (req, res) => {
  try{
  const catid = req.params.id;
  await categoryDB.findByIdAndRemove(catid).then((category) => {
    res.redirect("/admin/categorylist");
  });
}catch(error){
  res.render("admin/errorpage")
}
};

const categoryEdit = async (req, res) => {
  try{
  console.log(req.params.id);
  const catidedit = req.params.id;
  const editdata = await categoryDB.findById({ _id: catidedit });
  console.log(editdata);
  if (editdata) {
    res.render("admin/editcategory", { editdata });
  }
}catch(error){
  res.render("admin/errorpage")
}
};

const posteditcategory = async (req, res) => {
  try{
  console.log(req.files, req.params, req.body);
  const editname = req.body.categoryname;
  const editimage = req.files;
  const Editid = req.params.id;
  console.log(editimage);
  if (editname && editimage) {
    if (req.files.length == 0) {
      Object.assign(req.body, { CategoryName: editname });
      await categoryDB.findByIdAndUpdate(
        Editid,
        { $set: req.body },
        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );
      res.redirect("/admin/categorylist");
    } else {
      console.log(req.body);
      Object.assign(req.body, {
        CategoryName: editname,
        ImageURL: editimage,
        createdAt: moment().format("MM/DD/YYYY"),
      });
      await categoryDB.findByIdAndUpdate(
        Editid,
        { $set: req.body },
        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );
      res.redirect("/admin/categorylist");
    }
  } else {
    res.redirect("/admin/categorylist");
  }
}catch(error){
  res.render("admin/errorpage")
}
};

const getproductlist = async (req, res) => {
  try{
  console.log("get pro list");
  const ProductDetails = await productDB.find();
  console.log(ProductDetails);
  res.render("admin/productlist", { ProductDetails });
  }catch(error){
    res.render("admin/errorpage")
  }
};

const getaddproduct = async (req, res) => {
  console.log("get pro list");
  const categoryname = await categoryDB.find();
  res.render("admin/addproduct", { categoryname,
    addPROerr:req.flash("addPROerr") });
};

const postproductdata = async (req, res) => {
  try {
    console.log(req.body, req.files);

    const img = [];
    req.files.forEach((fl) => {
      img.push(fl.filename);
    });
    console.log(img);

    const { ProductName, quantity, Discription, Prize, Size, Color, Category } =
      req.body;
    console.log(
      ProductName,
      quantity,
      Discription,
      Prize,
      Size,
      Color,
      Category,
      "hghfgfghfgf"
    );
    if (
      ProductName &&
      quantity &&
      Discription &&
      Prize &&
      Size &&
      Color &&
      Category
    ) {
      console.log("fehehdggdgdgdg");

      await Object.assign(req.body, {
        ImageURL: img,
        createdAt: moment().format("MM/DD/YYYY"),
      });
      console.log(req.body);
      const newproduct = await new productDB(req.body);
      await newproduct
        .save()
        .then((result) => {
          console.log(result);
          res.redirect("/admin/getaddproduct");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      req.flash("addPROerr","full fil the colomns")
        res.redirect("/admin/getaddproduct");
    }
  } catch(error){
    res.render("admin/errorpage")
  }
};

const productDelete = async (req, res) => {
  try{
  console.log("weffffffwef");
  const deletepoduct = req.params.id;
  await productDB.findByIdAndRemove(deletepoduct);
  res.redirect("/admin/getproductlist");
  }catch(error){
    res.render("admin/errorpage")
  }
};


const getproductedit = async (req, res) => {
  try{
  console.log(req.params, "kuguigyifuyfuigiy");
  const editproductid = req.params.id;
  console.log(editproductid);
  const editproductdata = await productDB.findById({ _id: editproductid });
  const editcategory = await categoryDB.find();
  console.log(editproductdata);
  res.render("admin/editproduct", { editproductdata, editcategory });
  }catch(error){
    res.render("admin/errorpage")
  }
};

const posteditproduct = async (req, res) => {
  try {
    console.log(req.body, req.files, req.params,"++++++++++++++++++++++++");
    const body = req.body;
    const productId = req.params.id;
    console.log(productId);
    if (req.files.length === 0) {
      console.log(productId, "jjkhghghgkvjsa");
    //  let abcd =  await productDB.findByIdAndUpdate(productId, 
    //     { $set: body });
    Object.assign(body);
    await productDB.findByIdAndUpdate(productId, { $set: body });

        console.log("<><><>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<")
      res.redirect("/admin/getproductlist");
    } else {
      const img = [];

      req.files.forEach((arrimg) => {
        img.push(arrimg.filename);
      });
      Object.assign(body, { ImageURL: img });
      await productDB.findByIdAndUpdate(productId, { $set: body });
      res.redirect("/admin/getproductlist");
    }
  } catch {
    res.redirect(`/getproductedit/${productId}`);
  }
};


const getorderlist = async (req, res) => {
  try {
    const orderdetials = await orderDB.find().populate("UserId").sort({'createdAt':-1});
    console.log(orderdetials);
    res.render("admin/orderlist", { orderdetials });
  } catch (error) {
    res.render("admin/errorpage");
  }
};




const orderdetails=async(req,res)=>{
 console.log(req.params.id,"order details checking");
 try{
    
  const odrdtls=await orderDB.findOne({_id:req.params.id}).populate("Products.productDedtails")
  console.log("<><><><><><>>>>><>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><",odrdtls);
     res.render("admin/orderdetails",{odrdtls,user: req.session.user})
}catch(error){
 res.render("admin/errorpage")
}
}



const bannerlist=async(req,res)=>{
  try{
    const bannerdetails=await bannerDB.find()
  res.render("admin/banner_list",{bannerdetails})
  }catch(error){
    res.render("admin/errorpage")
  }
}


const add_banner=async(req,res)=>{

  res.render("admin/add_banner",{BannerADDerr:req.flash("BannerADDerr")})
}


const postbannerdetails=async(req,res)=>{
  try{
    console.log(req.files,req.body);
    const ImageURL=req.files;
    const {main_head,sub_head,route,offer}=req.body;
    if(main_head&&sub_head&&route&&offer&&ImageURL){
      Object.assign(req.body,{ImageURL})
      const bannerdata= await new bannerDB(req.body);
      await bannerdata.save()
      .then((response)=>{
        res.redirect("/admin/bannerlist")
      })
    }else{
      req.flash("BannerADDerr","full fill the colomns")
      res.redirect("/admin/addbanner")
    }
  }catch(error){
    res.render("admin/errorpage")
  }
}

const deletebanner=async(req,res)=>{
  try{
  console.log(req.body);
  const bannerid=req.body.id1
  const deletebanner=await bannerDB.findOne({_id:bannerid}).remove()
//  const deletebanner=await bannerDB.findOneAndUpdate(
//     {_id:bannerid},
//     {$set:{delete:true}});
    // deletebanner.save().then(()=>
    res.json({status:true})

}catch(error){
  res.render("admin/errorpage")
}
}


const changestatus=async(req,res)=>{
  try{
    oredrId=req.body.orderId;
    ordrsts=req.body.value;
    console.log(oredrId,ordrsts);
    if(ordrsts=="Delivered")
    {
        await orderDB.updateOne(
          {_id:oredrId},
          {
            $set: {
              track: ordrsts,
              orderStatus: ordrsts,
              paymentStatus: "Payment Completed",
            },
          }
          ).then((response)=>{
             res.json({status:true})
      })
    }else{
      await orderDB.updateOne(
        {_id:oredrId},
        {
          $set: {
            track: ordrsts,
            orderStatus: ordrsts,
          },
        }
        ).then((response)=>{
           res.json({status:true})
    })
    }

  }catch(erorr){
    res.render("admin/errorpage")
  }
}





module.exports = {
  getAdmin,
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
  orderdetails,
  add_banner,
  bannerlist,
  changestatus,
  postbannerdetails,
  deletebanner
};
