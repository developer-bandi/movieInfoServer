const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const crypto = require("crypto-js");
const User = require("../models/user");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "userid",
        passwordField: "password",
      },
      async (userid, password, done) => {
        try {
          const exUser = await User.findOne({ where: { userid } });
          if (exUser) {
            var bytes = crypto.AES.decrypt(
              password,
              process.env.PASSWORD_SECRET
            );
            var decrypted = bytes.toString(crypto.enc.Utf8);
            const result = await bcrypt.compare(decrypted, exUser.password);

            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다" });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다" });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
