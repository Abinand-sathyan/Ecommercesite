const mongoose=require("mongoose")
const categoryschema=new mongoose.Schema({
    CategoryName:{
        type:String,
        require:true
      
    },
    ImageURL:{
        type:Array,
         require:true
     }
},{
    timestamps:true
})
let categories=mongoose.model("category",categoryschema)
module.exports=categories;