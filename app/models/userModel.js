const Database = require('./../config/database');
const { default: validator } = require('validator');
const bcrypt = require('bcrypt');

class User extends Database {
  constructor() {
    super();

    this.schema = new this.mongoose.Schema({
      name: {
        type: String,
        required: [true, 'Missing name field'],
        trim: true
      },
      email: {
        type: String,
        required: [true, 'Missing email field'],
        unique: true,
        lowercase: true,
        validate: {
          validator: function(v) {
            return validator.isEmail(v);
          },
          message: 'Email address is not valid'
        }
      },
      role: {
        type: String,
        required: [true, 'Missing role field'],
        enum: ['admin', 'lead-guide', 'guide', 'user']
      },
      photo: {
        type: String,
        required: [true, 'Missing photo field'],
        default: 'default.jpg'
      },
      password: {
        type: String,
        required: [true, 'Missing password field'],
        minlength: [8, 'Password must be longer or equal to 8 characters'],
        select: false
      },
      passwordConfirm: {
        type: String,
        required: [true, 'Missing passwordConfirm field'],
        validate: {
          // * Only runs on save()
          validator: function(v) {
            return v === this.password;
          },
          message: 'Passwords don\'t match'
        },
        select: false
      },
      createdAt: {
        type: Date,
        default: Date.now()
      },
      passwordUpdatedAt: {
        type: Date,
        default: Date.now(),
        select: false
      }
    }, {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    });

    this.schema.pre('save', async function(next) {
      if (this.isModified('password')) {
        /**
         * * Use commonly used salt amount (10). The higher it is, the longer it takes
         * * to generate.
         * 
         * * Assign passwordConfirm to undefined to delete this field in database.
         * * Tried using null but it just appear as null instead of removed.
         */
        this.password = await bcrypt.hash(this.password, 10).catch(next);
        this.passwordConfirm = undefined;
      }

      next();
    });

    this.schema.methods.passwordMatch = async (passInput, passStored) => {
      return await bcrypt.compare(passInput, passStored);
    }

    this.schema.methods.tokenIssuedAfterLastPasswordChange = (tokenIssued, passwordUpdatedAt) => {
      return tokenIssued > parseInt(passwordUpdatedAt.getTime() / 1000);
    }

    this.model = this.mongoose.model('User', this.schema, 'users');
  }
}

module.exports = new User().model;