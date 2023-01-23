const { default: mongoose } = require("mongoose");
const Blog = require("../model/Blog");
const User = require("../model/User");

const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find();
  } catch (error) {
    console.log(error);
    next(next);
  }
  if (!blogs) {
    return res.status(404).json({ message: "No blogs found!" });
  }
  return res.status(200).json({ blogs });
};

const addBlog = async (req, res, next) => {
  if (!req.body) {
    res.status(400).send({ message: "Cannot be empty" });
    return;
  }
  let { title, description, image, user } = req.body;
  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (error) {
    console.log(error);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "Unable to Find user by this Id" });
  }
  const blog = new Blog({
    title,
    description,
    image,
    user,
  });
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save({ session });
    existingUser.blogs.push(blog);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
  res.status(200).json({
    message: "Blog added successfully!",
    error: false,
    data: { blog },
  });
};

const updateBlog = async (req, res, next) => {
  let { title, description, image, user } = req.body;
  try {
    let blog = await Blog.findOne({ _id: req.params.id });
    if (blog) {
      await Blog.updateOne(
        { _id: req.params.id },
        {
          $set: { title, description, image, user },
        }
      );
      res.json({
        error: false,
        message: "user updated successfully",
        data: { title, description, image, user },
      });
    } else {
      res.json({
        error: true,
        message: "Invalid Id",
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  let blog;
  try {
    blog = await Blog.findByIdAndRemove({ _id: req.params.id }).populate(
      "user"
    );
    await blog.user.blogs.pull(blog);
    await blog.user.save();
  } catch (error) {
    console.log(error);
    next(error);
  }
  if (!blog) {
    return res.status(500).json({
      error: true,
      message: "Unable to delete",
      data: null,
    });
  }
  return res.status(200).json({ message: "Successfully Deleted!" });
};

const getBlogById = async (req, res, next) => {
  let { id } = req.params.id;
  try {
    const blog = await Blog.findOne(id).lean();
    res.json({
      error: false,
      message: "Blog fetched successfully",
      data: blog,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getByUserId = async (req, res, next) => {
  let userId = req.params.id;
  let userBlogs;
  try {
    userBlogs = await User.findById(userId).populate("blogs");
  } catch (error) {
    console.log(error);
    next(error);
  }

  if (!userBlogs) {
    return res.status(404).json({ message: "No blog found!" });
  }
  return res.status(200).json({ blogs: userBlogs });
};

module.exports = {
  getAllBlogs,
  addBlog,
  updateBlog,
  getBlogById,
  deleteBlog,
  getByUserId,
};
