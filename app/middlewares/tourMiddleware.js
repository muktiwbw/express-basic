const Middleware = require('./../config/middleware');

class TourMiddleware extends Middleware{
  constructor() {
    super();
  }

  /** =================================================================
   * COMMONLY USED ENDPOINTS
   *  Basically you assign the query string manually, and then assign
   *  the function as the most front middleware.
   * 
   *  The middleware stack would look like this:
   * 
   *    =========================================
   *    1. Common endpoint middleware
   *    =========================================
   *    2. Utility middleware (optional)
   *    =========================================
   *    3. Controller
   *    =========================================
   * 
   *  This way, the end user don't need to put long query string
   *  when they send a request.
   * ==================================================================
   * 
   * 
   */
  
  topThreeToursByRating(req, res, next) {
    req.query.sort = '-ratingAverage|price';
    req.query.fields = 'name|duration|difficulty|ratingAverage|price';
    req.query.limit = 3;
  
    next();
  };
  
  /** 
   * 
   * COMMONLY USED ENDPOINTS
   * ==================================================================
  */

}

module.exports = new TourMiddleware();