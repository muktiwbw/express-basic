exports.findByQueryString = async (model, filterQuery = null, extraQuery = null) => {
  /**Filtering */
  let query = model.find(filterQuery || {});

  if (extraQuery) {
    /**Sorting */
    query = extraQuery.sort ? query.sort(extraQuery.sort.split('|').join(' ')) : query.sort('-createdAt');
    
    /**Limit */

    /**Pagination */
  }

  return query;
}