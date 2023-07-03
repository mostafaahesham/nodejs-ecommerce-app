class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryStringObj = { ...this.queryString };
    const execludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "keyword",
      "rand",
    ];
    execludedFields.forEach((field) => delete queryStringObj[field]);

    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search() {
    if (this.queryString.keyword) {
      const keyword = this.queryString.keyword;
      const query = {};
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { "variants.color": { $regex: keyword, $options: "i" } },
        { "variants.sizes.name": { $regex: keyword, $options: "i" } },
      ];

      this.mongooseQuery = this.mongooseQuery.find(query);
    }

    return this;
  }

  paginate(count) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(count / limit);

    if (endIndex < count) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;

    return this;
  }

  shuffle() {
    if (this.queryString.rand) {
      this.mongooseQuery = this.mongooseQuery
        .find({})
        .limit(Number(this.queryString.rand))
        .lean()
        .then((docs) => {
          const randomizedDocs = docs.sort(() => Math.random() - 0.5);
          return randomizedDocs;
        });
    }
    return this;
  }
}

module.exports = ApiFeatures;
