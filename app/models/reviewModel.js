const Database = require('./../config/database');

class Review extends Database {
  constructor() {
    super();

    this.schema = this.mongoose.Schema({
      review: {
        type: String,
        trim: true
      },
      rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5.0
      },
      createdAt: {
        type: Date,
        default: Date.now()
      },
      tour: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: true
      },
      user: {
        type: this.mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      }
    }, {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    });

    this.model = this.mongoose.model('Review', this.schema, 'reviews');
  }
}

module.exports = new Review().model;