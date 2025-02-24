const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    workingHours:{
        start:String,
        end:String
    }
},{
    timestamps:true
})

module.exports = mongoose.model("Doctor",doctorSchema);