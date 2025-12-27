require('dotenv').config()
const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const multerconfig = require('./config/multerConfig');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // A middleware which converts form data to object and attaches it to req.body
app.use(express.json()); // A middleware which parses incoming JSON requests and puts the parsed data in req.body
app.use(cookieParser());
app.use('/public', express.static('public'));
const bcrypt = require('bcrypt');


app.get('/', (req, res) => {
  res.render('index', { title: 'Home Page' });
}); 

app.get('/profile/upload', (req, res) => {
  res.render('profileupload', { title: 'Profile Upload' });
}); 

app.get('/login', (req, res) => {
   res.render('login', { title: 'Login Page' });
}); 

app.post('/upload', authenticateToken ,multerconfig.single("image"), async (req, res) => {
  let user = await userModel.findOne({email: req.user.email });
  user.profilePic = req.file.filename; 
  await user.save();
  res.redirect('/profile');
}); 


app.get('/profile', authenticateToken , async (req, res) => {
  let user = await userModel.findOne({email: req.user.email }).populate('post');
   if (!user) {
      return res.redirect('/login');
   }else{
      res.render('profile', { title: 'Profile Page', user: user });
   }
});

app.get('/like/:id', authenticateToken, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.id }).populate('user');

  if (!post) {
    return res.status(404).send("Post not found");
  }

  const likeIndex = post.likes.indexOf(req.user.userid);

  if (likeIndex === -1) {
    post.likes.push(req.user.userid);
  } else {
    post.likes.splice(likeIndex, 1);
  }

  await post.save();
  res.redirect('/profile');
});

app.get('/edit/:id', authenticateToken, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.id }).populate('user');

  res.render('edit', { title: 'Edit Post', post: post });
});

app.post('/post', authenticateToken , async (req, res) => {
  let user = await userModel.findOne({email: req.user.email })
  let {content} = req.body;

  let post = await postModel.create({
      user: user._id,
      content: content
   })

   user.post.push(post._id);
   await user.save();
   res.redirect('/profile');
}); 

app.post('/update/:id', authenticateToken, async (req, res) => {
  let post = await postModel.findOneAndUpdate({ _id: req.params.id }, {content: req.body.content});

  res.redirect('/profile');
});

app.post('/register', async (req, res) => {
   let {email, password, username, name, age} = req.body;

  let user = await userModel.findOne({email: email});
  if (user) {
    res.redirect('/login');
  } 
  else{
     bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, async function(err, hash) {
       const newuser =  await userModel.create({
            username: username,
            name: name,
            email: email,
            password: hash,
            age: age
        });
        
        let token = jwt.sign({ email: newuser.email , userid: newuser._id }, "secretkey");
        res.cookie('token', token);
        res.redirect('/login');
    });
  });
  }
});

app.post('/login', async (req, res) => {
   let {email, password} = req.body;

  let user = await userModel.findOne({email: email});
  if (!user) {
    res.status(400).send('User does not exist');
  } 
  else{
     bcrypt.compare(password, user.password, function(err, result){
        if(result) {
           let token = jwt.sign({ email: user.email , userid: user._id }, "secretkey");
           res.cookie('token', token);
           res.redirect('/profile');
        }else{
            res.redirect('/login');
        }
     })
  }
});

app.get('/logout', async (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

function authenticateToken(req, res, next) {
     if( req.cookies.token == null) res.redirect('/login');
     else{
       let data = jwt.verify(req.cookies.token, "secretkey")
       if(data) {
           req.user = data;
           next();
       } else {
           res.send('Invalid token');
       }
     }
    }

app.listen(process.env.PORT, () => {
  console.log('Server is running on http://localhost:', process.env.PORT);
});