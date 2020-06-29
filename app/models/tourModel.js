const Database = require('../config/database');
const { default: slugify } = require('slugify');

class Tour extends Database{
  constructor() {
    super();

    this.schema = new this.mongoose.Schema({
      name: {
        type: String,
        required: [true, 'Missing name field'],
        unique: [true, 'Conflicting name with existed data'],
        trim: true
      },
      slug: String,
      duration: {
        type: Number,
        required: [true, 'Missing duration field']
      },
      difficulty: {
        type: String,
        required: [true, 'Missing difficulty field'],
        enum: ['easy', 'medium', 'difficult']
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
        type: Number
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

    this.schema.pre('save', function(next) { this.slug = slugify(this.name, { lower: true }); next(); });

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