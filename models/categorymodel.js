const mongoose=require("mongoose")
const categoryschema=new mongoose.Schema({
    CategoryName:{
        type:String,
      
    },
    images:{
        type:Array,
     }
})
let categories=mongoose.model("category",categoryschema)
module.exports=categories;