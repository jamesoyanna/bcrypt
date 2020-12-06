const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userModel = require("./models/user");
const bcrypt = require("bcryptjs");

mongoose
  .connect(
    "mongodb://localhost:27017/bcrypt",
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  )
  .then(function () {
    console.log("connected to database");
  })
  .catch(function (error) {
    console.log("Error occured" + error);
  });

const app = express();

app.use(
  bodyParser.urlencoded({ extended: false })
);
app.use(bodyParser.json());

app.post("/register",(req, res)=> {
  try {
    let x;
    console.log(req.body);
    bcrypt.genSalt(10,(err, salt)=> {
      bcrypt.hash(req.body.password, salt,(err, hash)=> {
        var userr = new userModel({
          email: req.body.email,
          name: req.body.name,
          password: hash,
        });
        userr.save((err, data)=> {
          if (err) {
            console.log(err);
            res.json({ er: err });
          } else {
            res.json({ da: data });
          }
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.json({ er: error });
  }
});
app.post("/login",(req, res)=> {
  try {
    userModel.find({ email: req.body.email },(err, data)=> {
      console.log(data);
      if (err) {
        res.json({ er: error });
      } else {
        if (data) {
          console.log("data" + data[0].password);
          bcrypt.compare(
            req.body.password,
            data[0].password,
            (err, result)=> {
              if (err) {
                res.json({
                  msg: "email password doesnt matched.Try again!",
                  er: err,
                });
              } else {
                res.json({ da: result, msg: "password matched" });
              }
            }
          );
        } else {
          res.json({ msg: "user doesnt exists" });
        }
      }
    });
  } catch (error) {
    res.json({ er: error });
  }
});

var port = process.env.PORT || 3000;
app.listen(port,()=> {
  console.log("server running at port " + port);
});  