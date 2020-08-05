//PORT
process.env.PORT = process.env.PORT || 3000;

//Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev' ;

//DB URL
let DBurl = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : process.env.MONGO_URI;

process.env.URLDB = DBurl;
