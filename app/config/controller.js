const QueryBuilder = require('./../utils/queryBuilder');

class Controller {
  constructor() {
    //
  }

  async displayByQueryString(model, filterQuery = null, extraQuery = null) {   
    const queryBuilder = new QueryBuilder(model);
    
    return queryBuilder
              .filter(filterQuery)
              .sort(extraQuery)
              .select(extraQuery)
              .paginate(extraQuery)
              .get();
  }

  catchAsync(fn, req, res, next) {
    fn(req, res, next).catch(next);
  }
}

module.exports = Controller;