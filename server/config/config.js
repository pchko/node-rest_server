//PORT
process.env.PORT = process.env.PORT || 3000;

//Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev' ;

//DB URL
process.env.URLDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : process.env.MONGO_URI;


//TOKEN
process.env.EXPIRED_DATE_TOKEN = 60 * 60 * 24 * 30;  //30 DIAS

//SEED TOKEN
process.env.SEED = process.env.SEED || 'pchko';



