const express=require('express');
const router=express.Router();
const User=require('../models/User');
const bcrypt=require('bcryptjs');
const passport=require('passport');
//Login page
router.get('/login',(req,res)=>{
	res.render('login');
})

//Register page
router.get('/register',(req,res)=>{
	res.render('register');
})


//Register Handle
router.post('/register',(req,res)=>{
	const {name,email,password,password2}=req.body;
	let errors=[];
	if(!name || !email || !password || !password2){
		errors.push({msg: 'Please fill all fields'});
	}

	if(password !== password2){
		errors.push({msg: 'Passwords do not match'});
	}

	if(password.length < 6){
		errors.push({msg: 'Passwords should be at least 6 characters'});
	}
	
	if(errors.length>0){
		res.render('register',{
			errors,
			name,
			email,
			password,
			password2
		});
	}else{
		User.findOne({email:email})
			.then((user) => {if(user){
				errors.push({msg:'email already exists.'});
				res.render('register',{
					errors,
					name,
					email,
					password,
					password2
				});}else{
					const newUser=new User({
						name,
						email,
						password
					});
					//Hash Password
					bcrypt.genSalt(10, (err,salt)=>
						bcrypt.hash(newUser.password,salt,(err,hash)=>{
							if(err) throw err;
							//Set password to hashed
							newUser.password=hash;
							// Save user
							newUser.save()
								.then(user=>{
									req.flash('sucess_msg','You are now registered');
									res.redirect('login');
								}).catch(err=>console.log(err));
						}))
				}
			})
	}
}),

// Login handler
router.post('/login',(req,res,next)=>{
	passport.authenticate('local',{
		successRedirect: '/dashboard',
		failureRedirect: 'login',
		failureFlash: true
	})(req,res,next)
})

//Logout handle
router.get('/logout',(req,res)=>{
	req.logout();
	req.flash('sucess_msg','you are now logout')
	res.redirect('/users/login');
})
module.exports=router;
