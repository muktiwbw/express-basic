class Controller {
  constructor() {
    //
  }

  breakspace(args) {
    return args.split('|').join(' ');
  }

  sort(query, extra) {
    return extra.sort ? query.sort(this.breakspace(extra.sort)) : query.sort('-createdAt');
  }

  select(query, extra) {
    return extra.fields ? query.select(this.breakspace(extra.fields)) : query.select('-__v');
  }

  paginate(query, extra) {
    let page = 1;
    let perpage = 5;
    
    if (extra) {
      page = parseInt(extra.page || page);
      perpage = parseInt(extra.perpage || perpage);
    }
  
    const skip = (page - 1) * perpage;
  
    return query.skip(skip).limit(perpage);
  }

  async displayByQueryString(model, filterQuery = null, extraQuery = null) {
    /**Filtering */
    let query = model.find(filterQuery || {});
  
    if (extraQuery) {
      /**Sorting */
      query = this.sort(query, extraQuery);
      
      /**Field projection */
      query = this.select(query, extraQuery);
    }
  
    /**Pagination */
    query = this.paginate(query, extraQuery);
    
    return query;
  }
}

module.exports = Controller;