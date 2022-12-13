const mongoose=require("mongoose")
const addproductschema=mongoose.Schema({
    ProductName:{
        type:String,
       
    },
    Discription:{
        type:String,
       
    },
    Prize:{
        type:Number,
       
    },
    Size:{
        type:Number,
        
    },
    Color:{
        type:String,
        
    },
    Category:{
        type:String,
        
    },
    Mainimage:{
        type:String,
        
    },
    Subimage1:{
        type:String,
        
    },
    Subimage2:{
        type:String,
        
    },
    Subimage3:{
        type:String,
        
    },
},{
    timestamps:true
})
let AddProduct=mongoose.model("addproduct",addproductschema)
module.exports=AddProduct;
