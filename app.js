const express = require('express')
const app = express()
app.use(express.json()); // for JSON data
app.use(express.urlencoded({ extended: true })); // for form data

const port = 3000
const db=require("./config/mongoose-connections")
const userModel=require("./models/user-model.js")
const taskModel=require("./models/task-model.js")
const adminModel=require("./models/admin-model.js")
const cookieParser =require("cookie-parser");
const userRouter = require('./routes/usersRouter.js'); // Import the router
const taskRouter = require('./routes/taskRoutes'); // Import the router
const adminRouter = require('./routes/adminRoutes'); // Import the router
const indexRouter = require('./routes/index.js'); // Import the router
const flash=require("connect-flash");
app.use(cookieParser());
require("dotenv").config();
app.use('/users', userRouter);
app.use('/task', taskRouter);
app.use('/admin', adminRouter);
app.use('/', indexRouter);
app.use(flash());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
