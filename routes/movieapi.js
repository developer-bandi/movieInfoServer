const axios = require("axios");
const express = require("express");
const router = express.Router();

router.get("/home", async (req, res, next) => {
  try {
    const resultArr = [];
    await axios
      .all([
        axios.get(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.API_KEY}&language=ko-KR&page=1&region=KR`
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.API_KEY}&language=ko-KR&page=1&region=KR`
        ),
      ])
      .then(
        axios.spread((res0, res1) => {
          resultArr[0] = res0.data.results;
          resultArr[1] = res1.data.results;
        })
      );

    const tempvalue = await axios.get(
      `https://api.themoviedb.org/3/movie/${resultArr[0][0]["id"]}/videos?api_key=${process.env.API_KEY}&language=ko-KR`
    );
    resultArr[2] =
      tempvalue.data.results[tempvalue.data.results.length - 1]["key"];

    return res.send(JSON.stringify(resultArr));
  } catch (error) {
    return res.send("error");
  }
});

router.get("/rank", async (req, res, next) => {
  try {
    const resultArr = [];
    await axios
      .all([
        axios.get(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.API_KEY}&language=ko-KR&page=1&region=KR`
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&language=ko-KR&page=1&region=KR`
        ),
      ])
      .then(
        axios.spread((res0, res1) => {
          resultArr[0] = res0.data;
          resultArr[1] = res1.data;
        })
      );

    return res.send(JSON.stringify(resultArr));
  } catch (error) {
    console.error(error);
    return res.send("error");
  }
});

router.post("/search", async (req, res, next) => {
  const { name, page } = req.body;
  try {
    const data = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=ko-KR&query=${name}&page=${page}&include_adult=true&region=KR`
    );

    return res.send(JSON.stringify(data.data));
  } catch (error) {
    console.error(error);
    return res.send(error.message);
  }
});

router.post("/detail", async (req, res, next) => {
  const { id } = req.body;
  try {
    const data = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.API_KEY}&language=ko-KR`
    );
    return res.send(JSON.stringify(data.data));
  } catch (error) {
    return res.send("error");
  }
});

module.exports = router;
