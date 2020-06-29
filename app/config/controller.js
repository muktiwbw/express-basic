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
}

module.exports = Controller;