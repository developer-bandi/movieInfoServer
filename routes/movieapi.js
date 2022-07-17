const axios = require("axios");
const express = require("express");
const nation = require("../lib/nation");
const router = express.Router();

router.get("/home", async (req, res, next) => {
  try {
    const resultObj = {};
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
          resultObj.nowShowingInfo = res0.data.results.map((posterInfo) => {
            return {
              id: posterInfo["id"],
              title: posterInfo["title"],
              overview: posterInfo["overview"],
              voteAverage: posterInfo["vote_average"],
              posterPath: posterInfo["poster_path"],
            };
          });
          resultObj.nowCommingInfo = res1.data.results.map((posterInfo) => {
            return {
              id: posterInfo["id"],
              title: posterInfo["title"],
              overview: posterInfo["overview"],
              voteAverage: posterInfo["vote_average"],
              posterPath: posterInfo["poster_path"],
            };
          });
        })
      );
    for (let i = 0; i < resultObj.nowShowingInfo.length; i++) {
      const tempvalue = await axios.get(
        `https://api.themoviedb.org/3/movie/${resultObj.nowShowingInfo[i]["id"]}/videos?api_key=${process.env.API_KEY}&language=ko-KR`
      );
      if (tempvalue.data.results.length !== 0) {
        resultObj.key =
          tempvalue.data.results[tempvalue.data.results.length - 1]["key"];
        break;
      }
    }

    return res.send(JSON.stringify(resultObj));
  } catch (error) {
    console.error(error);
    return res.send(error);
  }
});

router.get("/rank", async (req, res, next) => {
  try {
    const resultObj = {};
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
          resultObj.topRated = res0.data.results.map((movieInfo) => {
            return {
              id: movieInfo.id,
              title: movieInfo.title,
              overview: movieInfo.overview,
              voteAverage: movieInfo.vote_average,
              posterPath: movieInfo.poster_path,
            };
          });
          resultObj.popular = res1.data.results.map((movieInfo) => {
            return {
              id: movieInfo.id,
              title: movieInfo.title,
              overview: movieInfo.overview,
              voteAverage: movieInfo.vote_average,
              posterPath: movieInfo.poster_path,
            };
          });
        })
      );

    return res.send(JSON.stringify(resultObj));
  } catch (error) {
    console.error(error);
    return res.send("error");
  }
});

router.get("/search", async (req, res, next) => {
  let { keyword, page } = req.query;
  keyword = encodeURI(keyword);
  try {
    const searchResult = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=ko-KR&query=${keyword}&page=${page}&include_adult=true&region=KR`
    );
    return res.send({
      page: searchResult.data.page,
      totalPage: searchResult.data.total_pages,
      results: searchResult.data.results.map((movieInfo) => {
        return {
          title: movieInfo.title,
          id: movieInfo.id,
          posterPath: movieInfo.poster_path,
          rate: movieInfo.vote_average,
          release:
            movieInfo.release_date === "" ? "정보없음" : movieInfo.release_date,
        };
      }),
    });
  } catch (error) {
    console.error(error);
    return res.send(error.message);
  }
});

router.get("/detail", async (req, res, next) => {
  const { movieId } = req.query;
  try {
    const movieDetailData = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}&language=ko-KR`
    );
    const processData = {};
    processData.genres = movieDetailData.data.genres.map((genresObj) => {
      return genresObj.name;
    });
    processData.title = movieDetailData.data["title"];
    processData.releaseDate = movieDetailData.data["release_date"];
    processData.nation =
      movieDetailData.data["production_countries"][0] === undefined
        ? "정보없음"
        : nation[movieDetailData.data["production_countries"][0]["name"]];
    processData.runtime = movieDetailData.data["runtime"] + "분";
    processData.rate = movieDetailData.data["vote_average"];
    processData.posterPath = movieDetailData.data["poster_path"];
    processData.overview = movieDetailData.data["overview"];
    processData.tagline = movieDetailData.data["tagline"];
    return res.send(JSON.stringify(processData));
  } catch (error) {
    console.error(error);
    return res.send("error");
  }
});

module.exports = router;
