const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");
const cors = require("cors");
dotenv.config();
const authRouter = require("./routes/auth");
const commentRouter = require("./routes/comment");
const movieapiRouter = require("./routes/movieapi");
const likeRouter = require("./routes/like");
const { sequelize } = require("./models");
const passportConfig = require("./passport");
const logger = require("./logger");
const helmet = require("helmet");
const hpp = require("hpp");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
  legacyMode: true,
});
redisClient.connect().catch(console.error);
const app = express();
passportConfig();
app.set("port", process.env.PORT || 8001);

sequelize
  .sync({ force: false })
  .then(() => {})
  .catch((err) => {
    console.error(err);
  });

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(hpp());
} else {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    store: new RedisStore({ client: redisClient }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/comment", commentRouter);
app.use("/like", likeRouter);
app.use("/movieapi", movieapiRouter);

app.use((req, res, next) => {
  const error = new Error(
    `${req.method}${req.url} 과 매치되는 주소가 없습니다`
  );
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500);
  logger.info("error");
  logger.error(error.message);
  res.send("에러가 발생하였습니다");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
