
    const getAdmin = (req, res) => {
             res.render('admin/Adminlogin')
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
    module.exports={getAdmin,
                   AdminLogin}
