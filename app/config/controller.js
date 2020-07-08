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

  filterBody(body, allowed) {
    const filtered = {};

    Object.keys(body).forEach(field => {
      if (allowed.includes(field)) {
        filtered[field] = body[field];
      }
    });

    return filtered;
  }

  getAll(Model, req, res, next) {
    const fn = async (req, res, next) => {
      const doc = await this.displayByQueryString(Model, req.filterQuery, req.extraQuery);

      return res
              .status(200)
              .json({
                status: 'success',
                docs: doc.length,
                data: {
                  doc
                }
              });
    };

    this.catchAsync(fn, req, res, next);
  }

  getOne(Model, req, res, next) {
    const fn = async (req, res, next) => {
      const doc = await Model.findById(req.params.id);

      return res
              .status(200)
              .json({
                status: 'success',
                data: {
                  doc
                }
              });
    };

    this.catchAsync(fn, req, res, next);
  }

  createOne(Model, req, res, next) {
    const fn = async (req, res, next) => {
      const doc = await Model.create(req.body);
    
      return res.status(201)
                .json({
                  status: 'created',
                  data: {
                    doc
                  }
                });
    };

    this.catchAsync(fn, req, res, next);
  }

  updateOne(Model, req, res, next) {
    const fn = async (req, res, next) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        
      if (!doc) { return next(new AppError('Document doesn\'t exist', 404)); }

      return res.status(201)
                .json({
                  status: 'updated',
                  data: {
                    doc
                  }
                });
    };
    
    this.catchAsync(fn, req, res, next);
  }

  deleteOne(Model, req, res, next) {
    const fn = async (req, res, next) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
  
      if (!doc) { return next(new AppError('Document doesn\'t exist', 404)); }
  
      return res.status(204)
                .json({
                  status: 'deleted',
                  data: {
                    doc
                  }
                });
    };

    this.catchAsync(fn, req, res, next);
  }
}

module.exports = Controller;