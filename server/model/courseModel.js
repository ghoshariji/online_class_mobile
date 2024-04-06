const mongoose = require("mongoose");
const courseSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    about:{
        type:String
    },
    valid:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    faculty1:{
        type:String,
        required:true
    },
    prof1:{
        type:String
    },
    faculty2:{
        type:String,
    },
    prof2:{
        type:String
    }
})
const courseModel = mongoose.model("Courses",courseSchema);
module.exports = courseModel