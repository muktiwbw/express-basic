const Database = require('../config/database');
const { default: slugify } = require('slugify');
const { default: validator } = require('validator');

class Tour extends Database{
  constructor() {
    super();

    this.schema = new this.mongoose.Schema({
      name: {
        type: String,
        required: [true, 'Missing name field'],
        unique: true,
        trim: true,
        validate: {
          validator: function(v) {
            return !validator.contains(v, 'fuck', { ignoreCase: true });
          },
          message: 'Name can\'t contain the word fuck'
        }
      },
      slug: String,
      secret: {
        type: Boolean,
        default: false
      },
      duration: {
        type: Number,
        required: [true, 'Missing duration field']
      },
      difficulty: {
        type: String,
        required: [true, 'Missing difficulty field'],
        enum: {
          values: ['easy', 'medium', 'difficult'],
          messages: 'Must be: easy, medium, or difficult'
        }
      },
      ratingAverage: {
        type: Number,
        default: 0
      },
      ratingQuantity: {
        type: Number,
        default: 0
      },
      price: {
        type: Number,
        required: [true, 'Missing price field']
      },
      priceDiscount: {
        type: Number,
        validate: {
          validator: function(v) {
            return v <= this.price;
          },
          message: 'Discount can\'t be higher than the price'
        }
      },
      summary: {
        type: String,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      imageCover: {
        type: String,
        required: [true, 'Missing imageCover field']
      },
      images: {
        type: [String]
      },
      createdAt: {
        type: Date,
        default: Date.now()
      },
      startDates: {
        type: [Date]
      }
    }, {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    });

    /**
     * Document Middleware
     *  Triggered by: validate, save, remove, updateOne, deleteOne, init
     *  While the create() method isn't in above list, create actually
     *  fires save() in the background.
     */
    this.schema.pre('save', function(next) { this.slug = slugify(this.name, { lower: true }); next(); });

    /**
     * Query Middleware
     * Triggered by: count, /^delete/, /^find/, /^update/, remove
     */
    this.schema.pre(/^find/, function(next) { this.find({ secret: false }); next(); });

    /**
     * Aggregate Middleware
     * Triggered by: aggregate
     */
    this.schema.pre('aggregate', function(next) { this.pipeline().unshift({ $match: { secret: false } }); next(); });

    /**
     * Little note:
     *  Declaring virtuals with get() needs a callback function.
     *  In that callback function, you can access the document fields
     *  by using "this".
     * 
     *  This is why we use ES5 function instead of ES6 arrow function.
     *  ES5 function doesn't bind outer scope's "this" automatically
     *  in them. You actually needs to use .bind() to do that (refers to routers declaration).
     *  That's why we need ES5 because we only need the "this" in the scope of that specific function.
     * 
     *  ES6's arrow function automatically binds outer scope's "this".
     *  In fact, it uses the "this" of any scope that declared it.
     * 
     *  In short, ES6's arrow function doesn't have private "this", and uses outer's scope instead.
     *  While ES5's only uses the "this" inside of it, and needs extra function (bind()) to bind 
     *  the outer scope's "this" to it.
     */
    this.schema.virtual('durationWeek').get(function() { return Math.ceil(this.duration / 7) });

    this.model = this.mongoose.model('Tour', this.schema, 'tours');
  }
}

module.exports = new Tour().model;