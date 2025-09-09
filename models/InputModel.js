import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    prompt:{
        type: String,
        required: true,
    },
    videos:{
        type:Array

    }
   
   
})

const InputModel = mongoose.models.input || mongoose.model('input', Schema)

export default InputModel;
