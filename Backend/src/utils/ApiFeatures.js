export default class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // search by product name
  search() {
    if (this.queryString.keyword) {
      const keyword = {
        name: {
          $regex: this.queryString.keyword,
          $options: "i",
        },
      };

      this.query = this.query.find(keyword);
    }
    return this;
  }

  // filter by category, price, etc.
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["sort", "page", "limit", "keyword"];
    excludedFields.forEach((field) => delete queryObj[field]);

    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));
    // this.query = this.query.find(JSON.parse(queryStr));
    
    const mongoQuery = {};
    
    Object.keys(queryObj).forEach((key) => {
      if (key.includes("[")) {
        const [field, operator] = key.split("[");
        const op = operator.replace("]", "");
        console.log(field, operator, op);
        
        if (!mongoQuery[field]) mongoQuery[field] = {};
        mongoQuery[field][`$${op}`] = Number(queryObj[key]);
      } else {
        mongoQuery[key] = queryObj[key];
      }
      // JSON.parse(JSON.stringify(mongoQuery))
      console.log(mongoQuery);
      
    });
    
    this.query = this.query.find(mongoQuery);
    return this;
  }

  // sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  // pagiantaion
  paginate(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}
