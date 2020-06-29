class QueryBuilder {
  constructor(query) {
    this.query = query;
  }

  get() {
    return this.query;
  }

  breakspace(args) {
    return args.split('|').join(' ');
  }

  filter(filter = null) {
    this.query = this.query.find(filter || {});

    return this;
  }

  sort(extra = null) {
    if (extra && extra.sort) {
      this.query = this.query.sort(this.breakspace(extra.sort));
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  select(extra = null) {
    if (extra && extra.fields) {
      this.query = this.query.select(this.breakspace(extra.fields));
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate(extra = null) {
    const page = (extra && extra.page) ? parseInt(extra.page) : 1;
    const perpage = (extra && extra.perpage) ? parseInt(extra.perpage) : 10;
  
    const skip = (page - 1) * perpage;
  
    this.query = this.query.skip(skip).limit(perpage);

    return this;
  }
}

module.exports = QueryBuilder;