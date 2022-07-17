const express = require("express");
const Comment = require("../models/comment");
const router = express.Router();
const User = require("../models/user");

router.get("/", async (req, res, next) => {
  const { movieId } = req.query;
  try {
    const allComment = await Comment.findAll({
      where: { movieId },
      attributes: ["id", "content", "createdAt"],
      include: [
        {
          model: User,
          attributes: ["id", "nick"],
        },
      ],
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
  const { movieId, content } = req.body;
  try {
    const createdCommentInfo = await Comment.create({
      movieId: movieId,
      content: content,
      UserId: id,
    });

    res.status(200);

    return res.send({
      id: createdCommentInfo.dataValues.id,
      content: createdCommentInfo.dataValues.content,
      createdAt: createdCommentInfo.dataValues.createdAt,
      User: {
        id,
        nick,
      },
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.delete("/delete", async (req, res) => {
  const { commentId } = req.body;
  try {
    await Comment.destroy({
      where: { id: commentId },
    });
    res.status(200);
    return res.send("성공");
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
