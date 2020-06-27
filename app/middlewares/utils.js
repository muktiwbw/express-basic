exports.querySeparator = (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
    const dirtyQueryList = ['sort', 'page'];

    const cleanQuery = {...req.query};
    const dirtyQuery = {};

    dirtyQueryList.forEach((q) => {
      if (Object.keys(cleanQuery).includes(q)) {
        delete cleanQuery[q];
      }

      if (Object.keys(req.query).includes(q)) {
        dirtyQuery[q] = req.query[q];
      }
    });

    req.cleanQuery = cleanQuery || {};
    req.dirtyQuery = dirtyQuery || {};
  }
  
  next();
}