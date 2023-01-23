const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
//now express has given all of its reference to this app
const app = express();
//getting PORT from config.env
dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;
//getting the database connection here
const connectDb = require("../socialMedia/server/database/connection");
const route = require("./server/routes/user-routes");
const blogRoute = require("./server/routes/blog-routes");

//application server doesnt know that
//what type of data it is receiving from the request.body
//so we need to tell the application we are receiving json body
app.use(express.json());

//db connection
connectDb();

//routes
app.use("/api/user", route);
app.use("/api/blog", blogRoute);
// app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
