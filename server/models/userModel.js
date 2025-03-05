import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    usertype: { 
        type: String, 
        required: true,
        enum: ["freelancer", "client"]  
    }
});

export default mongoose.model("User", userSchema);
