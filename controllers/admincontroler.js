const UserDB=require('../models/userModel')
const categoryDB=require('../models/categorymodel')
const mongoose = require('mongoose')
const { LogInstance } = require('twilio/lib/rest/serverless/v1/service/environment/log')
const { findOne } = require('../models/userModel')
   const getAdmin = (req, res) => {
      res.render('admin/Adminlogin')
       }
    
    
   const getusers = async (req,res) =>{
          let userdetails=await UserDB.find()
         //  console.log(userdetails)
          res.render('admin/userdetails',{userdetails})
          }

   const blockuser= async(req,res)=>{
      const userid=req.params.id;
      // console.log(userid);
      let data =await UserDB.findByIdAndUpdate(userid,{block: false});
      if(data)
      {
         res.redirect('/admin/userdetails')
      }
      else{
         res.redirect('/admin/dashboard')
      }
   }


   const unblockuser= async(req,res)=>{
      console.log("eraagrgwrgWF");
      const userid=req.params.id;
      // console.log(userid);
      let data =await UserDB.findByIdAndUpdate(userid,{block: true});
      // console.log(data);
      if(data)
      {
         res.redirect('/admin/userdetails')
      }
      else{
         res.redirect('/admin/dashboard')
      }
   }

      
     
      const AdminLogin=(req, res)=> {
      console.log(req.body);
      const AdmineMail=process.env.ADMIN_EMAIL
      const Adminpassword=process.env.ADMIN_PASSWORD
      const{email ,password}=req.body
      console.log(email,password);
      console.log(AdmineMail,Adminpassword);

      if(AdmineMail==email&&Adminpassword==password)
      {
         res.render('admin/dashboard')
      }
      else{
         res.redirect("/admin")
      }

     } 
     
     

     const getcategorylist = async(req, res) => {
     const categorydata=await categoryDB.find();
     console.log(categorydata);
     res.render('admin/categorylist',{categorydata})
       }


    const getaddcategory = (req, res) => {
      console.log("the real");
      res.render('admin/addcategory')
        }
        
   const postaddcategory = async(req, res) => {
      // console.log(req.body);
      // console.log(req.files);
      const reqcategoryname=req.body.categoryname;
      const reqimageUrl=req.files;
      console.log(reqcategoryname,reqimageUrl);
      if(reqcategoryname&&reqimageUrl)
      {
         const Regex=new RegExp(reqcategoryname,'i')
         let DBcategory=await categoryDB.findOne({CategoryName:{$regex:Regex}}) 
         console.log(DBcategory);
         if(!DBcategory)
         {
            Object.assign(req.body,{CategoryName:reqcategoryname,images:reqimageUrl});
            console.log(req.body);
            const newcategory= await new categoryDB(req.body);
              await newcategory.save()
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
   }

     

      
   


    module.exports={getAdmin,
                   AdminLogin,
                   getusers,
                   blockuser,
                   unblockuser,
                   getcategorylist,
                   getaddcategory,
                   postaddcategory}
