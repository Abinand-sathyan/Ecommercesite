const mongoose=require("mongoose")
const orderSchema=mongoose.Schema({
    Date:{
        type:String,
        require:true
    },
    
    Time:{
        type:String,
        require:true
    },

   UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    
    Products:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"addproduct"},
        quantity:{
             type:Number,
             default:1},
        total:{
             type:Number,
             default:0},
        }],
        total: {
            type: Number,
            required: true,
          },
          address: {
            fName: String,
            addressLine: String,
            city: String,
            country: String,
            state:String,
            pincode: Number,
          },
          paymentMethod: {
            type: String,
            required: true,
          },
          paymentStatus: {
            type: String,
            required: true,
          },
          orderStatus: {
            type: String,
            required: true,
          },
          track:{
            type: String,
          },
          returnreason:{
            trpe:String,
          }
},{
    timestamps:true
});
const order=mongoose.model("Order",orderSchema)
module.exports=order;