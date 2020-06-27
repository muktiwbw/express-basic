const breakspace = (args) => {
  return args.split('|').join(' ');
};

const paginate = async (query, model, page = 1, perpage = 5) => {
  const skip = (page - 1) * perpage;
  const docNum = await model.estimatedDocumentCount();

  if (skip >= docNum) throw 'Page exceeds pagination';

  return query.skip(skip).limit(perpage);
};

exports.displayByQueryString = async (model, filterQuery = null, extraQuery = null) => {
  /**Filtering */
  let query = model.find(filterQuery || {});

  if (extraQuery) {
    /**Sorting */
    query = extraQuery.sort ? query.sort(breakspace(extraQuery.sort)) : query.sort('-createdAt');
    
    /**Field projection */
    query = extraQuery.fields ? query.select(breakspace(extraQuery.fields)) : query.select('-__v');
  }

  /**Pagination */
  query = await paginate(query, model, extraQuery.page, extraQuery.perpage);

  return query;
}