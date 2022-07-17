const express = require("express");
const Like = require("../models/like");
const router = express.Router();
const User = require("../models/user");

router.get("/", async (req, res, next) => {
  const { id } = req.user.dataValues;
  try {
    const allLikeMovie = await Like.findAll({
      where: { userId: id },
      attributes: ["movieId", "movieName", "posterPath"],
    });
    res.status(200);
    return res.send(allLikeMovie);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  const UserId = req.user.dataValues.id;
  const { movieId, movieName, posterPath } = req.body;
  try {
    const uploadedData = await Like.create({
      movieId,
      movieName,
      posterPath,
      UserId,
    });

    res.status(200);
    return res.send({
      id: uploadedData.dataValues.id,
      movieId: uploadedData.dataValues.movieId,
      movieName: uploadedData.dataValues.movieName,
      posterPath: uploadedData.dataValues.posterPath,
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.delete("/delete", async (req, res, next) => {
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
