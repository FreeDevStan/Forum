{
  'use strict'

  let mongoose = require('mongoose')
  let Schema = mongoose.Schema
  let bcrypt = require('bcrypt')

  // set up a mongoose model
  let UserSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    username: {
      type: String,
      unique: true,
      required: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    userStatus: {
      type: String,
      required: true
    }
  })

  UserSchema.pre('save', function (next) {
    let user = this
    if (this.isModified('password') || this.isNew) {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return next(err)
        }
        bcrypt.hash(user.passwordHash, salt, (err, hash) => {
          if (err) {
            return next(err)
          }
          user.passwordHash = hash
          next()
        })
      })
    } else {
      return next()
    }
  })

  UserSchema.methods.comparePassword = (passw, cb) => {
    bcrypt.compare(passw, this.passwordHash, (err, isMatch) => {
      if (err) {
        return cb(err)
      }
      cb(null, isMatch)
    })
  }

  module.exports = mongoose.model('User', UserSchema)
}
