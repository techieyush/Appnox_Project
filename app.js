const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/authenticationDemo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('DB Connected Successfully');
  })
  .catch((err) => {
    console.log(err);
  });

app.use('/auth', authRouter);
app.use('/user', userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

module.exports = app;
