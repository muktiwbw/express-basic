const Model = require('./../config/model');

class Tour extends Model{
  constructor() {
    super();

    this.schema = new this.mongoose.Schema({
      name: {
        type: String,
        required: [true, 'Missing name field'],
        unique: [true, 'Conflicting name with existed data'],
        trim: true
      },
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
    });

    this.model = this.mongoose.model('Tour', this.schema, 'tours');
  }
}

module.exports = Tour;

// const tourSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Missing name field'],
//     unique: [true, 'Conflicting name with existed data'],
//     trim: true
//   },
//   duration: {
//     type: Number,
//     required: [true, 'Missing duration field']
//   },
//   difficulty: {
//     type: String,
//     required: [true, 'Missing difficulty field'],
//     enum: ['easy', 'medium', 'difficult']
//   },
//   ratingAverage: {
//     type: Number,
//     default: 0
//   },
//   ratingQuantity: {
//     type: Number,
//     default: 0
//   },
//   price: {
//     type: Number,
//     required: [true, 'Missing price field']
//   },
//   priceDiscount: {
//     type: Number
//   },
//   summary: {
//     type: String,
//     trim: true
//   },
//   description: {
//     type: String,
//     trim: true
//   },
//   imageCover: {
//     type: String,
//     required: [true, 'Missing imageCover field']
//   },
//   images: {
//     type: [String]
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now()
//   },
//   startDates: {
//     type: [Date]
//   }
// });

// module.exports = mongoose.model('Tour', tourSchema, 'tours');