class ApiFeature {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};

    pagination.currentPage = page;
    pagination.pageSize = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);
    // Next page
    if (endIndex < countDocuments) {
      pagination.nextPage = page + 1;
    }
    // Previous page
    if (skip > 0) {
      pagination.previousPage = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;

    return this;
  }

  filter() {
    const queryStringObj = { ...this.queryString };
    const excludeFields = ["page", "limit", "sort", "fields"];
    excludeFields.forEach((field) => delete queryStringObj[field]);

    // if query contain gte, gt, lte, lt add $ sign
    const queryStr = JSON.stringify(queryStringObj);
    const queryStrWithDollarSign = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.mongooseQuery = this.mongooseQuery.find(
      JSON.parse(queryStrWithDollarSign)
    );

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // if query contain sort, add space between them
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      // Default sorting by latest
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      // if query contain fields, add space between them
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      // Default field limiting
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }

    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      let query = {};

      // Use keyword in query to search by title or description
      // Options: "i" => case insensitive
      if (modelName === "product") {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query = { title: { $regex: this.queryString.keyword, $options: "i" } };
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }

    return this;
  }
}

module.exports = ApiFeature;
