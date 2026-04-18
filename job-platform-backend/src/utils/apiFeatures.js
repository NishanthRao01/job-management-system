class APIFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        let queryObj = {};
        if (this.queryString.status) {
            queryObj.status = this.queryString.status;
        }
        if (this.queryString.search) {
            queryObj.$or = [
                { company: { $regex: this.queryString.search, $options: "i" } },
                { role: { $regex: this.queryString.search, $options: "i" } }
            ];
        }
        this.query = this.query.find(queryObj);
        return this;
    }
    sort(){
        if(this.queryString.sort === "oldest"){
            this.query = this.query.sort({createdAt: 1});
        }else{
            this.query =  this.query.sort({createdAt: -1});
        }
        return this;
    }
    paginate(){
        const page = parseInt(this.queryString.page) || 1;
        const limit = parseInt(this.queryString.limit) || 10;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;