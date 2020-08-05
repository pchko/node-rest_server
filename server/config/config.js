//PORT
process.env.PORT = process.env.PORT || 3000;

//Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev' ;

//DB URL
let DBurl = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : 'mongodb+srv://pchko:PAcheko666@cluster0.iprfl.mongodb.net/cafe';

process.env.URLDB = DBurl;
