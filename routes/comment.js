const express = require("express");
const Comment = require("../models/comment");
const router = express.Router();
const User = require("../models/user");
router.post("/", async (req, res, next) => {
  const { MovieId } = req.body;
  try {
    const allComment = await Comment.findAll({
      where: { MovieId },
      include: User,
    });
    res.status(200);
    return res.send(allComment);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/add", async (req, res, next) => {
  const { id, nick } = req.user.dataValues;
  const { MovieId, content } = req.body;
  try {
    const createComment = await Comment.create({
      movieId: MovieId,
      content: content,
      UserId: id,
    });
    const createCommentTime = await Comment.findOne({
      where: {
        movieId: MovieId,
        content: content,
        UserId: id,
      },
      attributes: ["id", "createdAt"],
    });
    res.status(200);
    return res.send({
      id: createCommentTime.id,
      userid: id,
      nick,
      createdAt: createCommentTime.createdAt,
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.post("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    await Comment.destroy({
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
