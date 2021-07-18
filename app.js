const express=require('express');
const expressLayout=require('express-ejs-layouts');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');

const db=require('./config/keys').MongoURI;

require('./config/passport')(passport);

mongoose.connect(db, {useNewUrlParser:true,
						useUnifiedTopology:true})
	.then(()=>console.log("MongoDB connected..."))
	.catch(err=>console.log(err));
const app=express();

//EJS
app.use(expressLayout);
app.set('view engine','ejs');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(session({
	secret:'secret',
	resave: true,
	saveUnitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req,res,next)=>{
	res.locals.sucess_msg=req.flash('sucess_msg');
	res.locals.error_msg=req.flash('error_msg');
	res.locals.error=req.flash('error');
	next();
});


app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

//app.get('/',(req,res)=>{
//	res.send('hello');
//})

/*if(process.env.NODE_ENV==='production'){
	//app.use(express.static('client/build'));
	app.get('*',(req,res)=>{
		
	})
}
*/
const PORT =process.env.PORT || 5000;

app.listen(PORT);
