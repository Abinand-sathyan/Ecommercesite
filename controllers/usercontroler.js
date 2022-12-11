const UserDB=require('../models/userModel')
const mongoose = require('mongoose')
const bcrypt=require('bcrypt')
const {sendotp,verifyotp}=require('../verification/otp')
const { SecondaryAuthTokenPage } = require('twilio/lib/rest/accounts/v1/secondaryAuthToken')
const getUserlogin = (req, res) => {
    res.render('user/UserLogin')
}
const getUserSignUp = (req, res) => {
    res.render('user/userSignUp')
    }
    const otp = (req, res) => {
        res.render('user/otpverification')
        }
const getUserregister = async(req, res) => {
    console.log(req.body);
    const pass1=req.body.password;
    const pass2=req.body.confirm_password;
    const email=req.body.email_address;
    const Number = req.body.mobile_number
    if(pass1!==pass2)
    {
        console.log("password not match");
        res.redirect('/usersignup')
    }
    else{
    const hashpassword=await bcrypt.hash(pass1,10)
    const hashpassword1=await bcrypt.hash(pass2,10)

    console.log(hashpassword,hashpassword1)
    await UserDB.findOne({email_address:email}).then(async(user)=>
       {console.log(user)
       if(user){
        console.log("exist email")
        res.redirect('/usersignup')
       }
       
       else{
                user=UserDB({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email_address: req.body.email_address,
                    password:hashpassword,
                    confirm_password:hashpassword1,
                    mobile_number: req.body.mobile_number


               

                    });
                  

                    await user.save()
                    console.log(user);
                    console.log("sucessfully acces");
                    res.render('user/userlogin')
                // sendotp(Number)
                // req.session.user1=req.body


                //    res.render('user/otpverification')
                //    console.log("redirected")

       }

    })
    }
}
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
const getUserhome = async(req, res) => {

    console.log("started login")
    console.log(req.body);

    const {email,password}=req.body
    console.log(email)
    const userdetails=await UserDB.findOne({email_address:email})
    console.log(userdetails);
    // res.render('user/userHome')
    if(userdetails){
        console.log("successfull user");
        console.log(password);
        console.log(userdetails.password);
        await bcrypt.compare(password,userdetails.password,(err,data)=>{
            console.log("data"+data)
           
            if(err) throw err;
            
            
            else if(data ==true )
            {
                console.log("console success");
                res.render('user/userHome')
            }
            else{
                console.log("wrong password");
                res.redirect('/')
            }
        })
    }
}
module.exports={getUserlogin,
                getUserhome,
                getUserSignUp,
                getUserregister,
                getUserhome,
                // postotp,
                otp
                }   