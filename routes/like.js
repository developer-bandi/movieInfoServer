const express = require("express");
const Like = require("../models/like");
const router = express.Router();
const User = require("../models/user");

router.post("/", async (req, res, next) => {
  const { userId } = req.body;
  try {
    const allLikeMovie = await Like.findAll({
      where: { userId },
    });
    res.status(200);
    return res.send(allLikeMovie);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/add", async (req, res, next) => {
  const { UserId, movieId, movieName, posterPath } = req.body;
  try {
    await Like.create({
      movieId,
      movieName,
      posterPath,
      UserId,
    });
    const uploadedData = await Like.findOne({
      where: {
        movieId,
        UserId,
      },
      attributes: ["id"],
    });
    res.status(200);
    return res.send({ id: uploadedData });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.post("/delete", async (req, res, next) => {
  const { id } = req.body;
  try {
    await Like.destroy({
      where: { id },
    });
    res.status(200);
    return res.send("성공");
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
