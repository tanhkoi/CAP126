var express = require("express");
var router = express.Router();
let userControllers = require("../controllers/users");
let { check_authentication } = require("../utils/check_auth");
let jwt = require("jsonwebtoken");
let constants = require("../utils/constants");

router.post("/login", async function (req, res, next) {
  try {
    let username = req.body.username;
    let password = req.body.password;
    console.log(username, password);
    let result = await userControllers.checkLogin(username, password);
    let exp = new Date(Date.now() + 3600 * 1000);
    let token = jwt.sign(
      {
        id: result,
        expireIn: exp.getTime(),
      },
      constants.SECRET_KEY
    );
    res.cookie("token", token, {
      httpOnly: true,
      expires: exp,
      signed: true,
    });
    res.status(200).send({
      success: true,
      data: token,
    });
  } catch (error) {
    next(error);
  }
});
router.post("/signup", async function (req, res, next) {
  try {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let result = await userControllers.createAnUser(
      username,
      password,
      email,
      "user"
    );
    res.status(200).send({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/me", check_authentication, async function (req, res, next) {
  try {
    res.send({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
});
router.post(
  "/changepassword",
  check_authentication,
  async function (req, res, next) {
    try {
      let oldpassword = req.body.oldpassword;
      let newpassword = req.body.newpassword;
      let user = userControllers.changePassword(
        req.user,
        oldpassword,
        newpassword
      );
      res.send({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
