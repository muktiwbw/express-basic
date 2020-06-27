exports.querySeparator = (req, res, next) => {
  /** ===========================================================================
   * Extra query list contains list of querystring outside the main model fields
   * ============================================================================
   */
  const extraQueryList = ['sort', 'fields', 'page', 'perpage'];

  if (Object.keys(req.query).length > 0) {

    const filterQuery = {...req.query};
    const extraQuery = {};

    /**Separation */
    extraQueryList.forEach((q) => {
      if (Object.keys(filterQuery).includes(q)) {
        delete filterQuery[q];
      }

      if (Object.keys(req.query).includes(q)) {
        extraQuery[q] = req.query[q];
      }
    });

    /**Identifying advance filtering */
    const advanceFilterList = /\b(gte|gt|lte|lt)\b/g;

    /**Add dollar sign ($) to advance filter variables */
    req.filterQuery = JSON.parse(JSON.stringify(filterQuery).replace(advanceFilterList, match => `$${match}`));
    req.extraQuery = extraQuery;
  }
  
  next();
}