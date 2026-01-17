require('dotenv').config()
const mongoose = require("mongoose");

const express = require('express');
const userModel = require('./models/user');
const path = require('path');
const postModel = require('./models/post');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const multerconfig = require('./config/multerConfig');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();

app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); // A middleware which converts form data to object and attaches it to req.body
app.use(express.json()); // A middleware which parses incoming JSON requests and puts the parsed data in req.body
app.use(cookieParser());
app.use(
  cors({
    origin: "https://blogging-application-two.vercel.app",
    credentials: true
  })
);

// MongoDB connection is done here
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("DB connection error:", err);
});

app.post( "/api/profileupload",
  authenticateToken,
  multerconfig.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const user = await userModel.findById(req.user.userid);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // save full public URL
      user.profilePic = `/static/profile/${req.file.filename}`;
      await user.save();

      return res.status(200).json({
        message: "Profile picture uploaded successfully",
        profilePic: user.profilePic,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Profile upload failed",
      });
    }
  }
);
 
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.userid)
      .populate("post");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/api/like/:id', authenticateToken, async (req, res) => {
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
  res.json({
      liked: post.likes.includes(req.user.userid), // T/F
      likes: post.likes
  })
});

app.get('/api/edit/:id', authenticateToken, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.id }).populate('user');
  if (!post) {
    return res.status(404).send("Post not found");
  }
  post.content = req.body.content;
  await post.save();
  res.status(200).json({ message: "Post updated successfully" });
});

app.get("/api/post/:id", authenticateToken, async (req, res) => {
  const post = await postModel.findById(req.params.id);
  res.json(post);
});

app.post("/api/post", authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Post content cannot be empty",
      });
    }

    const user = await userModel.findById(req.user.userid);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const post = await postModel.create({
      user: user._id,
      content,
    });

    user.post.push(post._id);
    await user.save();

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.post('/api/update/:id', authenticateToken, async (req, res) => {
  let post = await postModel.findOneAndUpdate({ _id: req.params.id }, {content: req.body.content});
  return res.status(200).json({ message: "Post updated successfully" });
});

app.post("/api/register", async (req, res) => {
  try {
    const { email, password, username, name, age } = req.body;

    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      username,
      name,
      email,
      password: hash,
      age,
    });

    const token = jwt.sign(
      { email: newUser.email, userid: newUser._id },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (!result) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { email: user.email, userid: user._id },
        "secretkey",
        { expiresIn: "1d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
      });

      return res.status(200).json({
        message: "Login successful",
      });
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/logout', async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
});

function authenticateToken(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Not authenticated. Please login.",
    });
  }

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on http://localhost:${process.env.PORT}`);
// });

module.exports = app;