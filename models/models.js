var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true, // Unique index
        match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]
    },
    numOfCups: Number,
    currentBalance: Number,
    totalNumOfCups: Number,
    totalMoneySpent: Number,
    /*photo: {
        fileName : String,
        url: String,
        contentType: String,
        size: String,
        dimensions: String
    }*/
    photo: String
});

userSchema.virtual('fullName').get(function(){
    return this.firstName + ' ' + this.lastName;
});

userSchema.set('toJSON', {getters:true, virtuals: true});
//Declare a model called User which has a schema userSchema
mongoose.model("User", userSchema);