const mongoose = require("mongoose");
const chatSchema = mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    chat:[]
})

const chatModel = mongoose.model("chat",chatSchema);
module.exports = chatModel