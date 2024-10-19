const mongoose=require('mongoose')

const collegeSchema= new mongoose.Schema({

        name : {
            type:String,
            unique:true,
            lowercase:true,
            required:true
        },
        fullName :{
            type:String,
            required:true,
            unique:true
        },
        logoLink: {
            type:String,
            required:true,
            unique:true,
           match:[/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/]
        },
        isDeleted : {
            type:Boolean,
            default:false
        }
},{timestamps:true}
)

module.exports=mongoose.model("College" ,collegeSchema)