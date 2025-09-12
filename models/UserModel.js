import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
      
    },
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Session Schema
const sessionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
      
    },
    sessionToken: {
        type: String,
        required: false,
        unique: true,
    },
    userId: String,
    expires: Date,
});

// Account Schema
const accountSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
   
    },
    userId: String,
    providerId: String,
    providerUserId: String,
    accessToken: String,
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);
 export const Account = mongoose.models.Account || mongoose.model('Account', accountSchema);