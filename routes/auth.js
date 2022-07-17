const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../models/user");
const crypto = require("crypto-js");
const router = express.Router();

router.get("/logincheck", async (req, res, next) => {
  if (req.user === undefined) {
    res.status(203);
    return res.send("로그인되지 않음");
  }
  return res.send({
    id: req.user.dataValues.id,
    userid: req.user.dataValues.userid,
    nick: req.user.dataValues.nick,
  });
});

router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { userid, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { userid } });
    if (exUser) {
      res.status(403);
      return res.send("존재하는 아이디 입니다");
    }
    const bytes = crypto.AES.decrypt(password, process.env.PASSWORD_SECRET);
    const decrypted = bytes.toString(crypto.enc.Utf8);
    const hash = await bcrypt.hash(decrypted, 12);
    await User.create({
      userid,
      nick,
      password: hash,
    });
    res.status(201);
    return res.send("회원가입에 성공하였습니다");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      next(authError);
    }
    if (!user) {
      res.status(202);
      return res.send(info.message);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      res.status(200);
      return res.send({
        id: user.dataValues.id,
        userid: user.dataValues.userid,
        nick: user.dataValues.nick,
      });
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  return res.send("success");
});

router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    res.redirect("http://localhost:3000");
  }
);

router.get("/naver", passport.authenticate("naver", { authType: "reprompt" }));

router.get(
  "/naver/callback",

  passport.authenticate("naver", { failureRedirect: "http://localhost:3000" }),
  (req, res) => {
    res.redirect("http://localhost:3000");
  }
);

module.exports = router;
