const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required: true
    }
})

UserSchema.pre('save',function(next){
    const user = this
    if(!user.isModified('password')){
        return next()
    }

    bcrypt.genSalt((err,salt)=>{
        bcrypt.hash(user.password,salt,(err,hash)=>{
            user.password = hash
            next()
        })
    })
})

UserSchema.methods.checkPassword = function(password){
    return new Promise((resolve, reject)=>{
        bcrypt.compare(password,this.password,(error,isMatch)=>{
            if(error){
                reject(error)
            }else{
                resolve(isMatch)
            }
        })
    })
}
const User = mongoose.model('User',UserSchema)
module.exports = User