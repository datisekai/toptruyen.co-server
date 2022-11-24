import express from "express";
import dotenv from "dotenv";
import HomeRouters from "../routers/Home.js";
import RankRouters from "../routers/Rank.js";
import DetailRouters from "../routers/Detail.js";
import ChapRouters from "../routers/Chap.js";
import SearchRouters from "../routers/Search.js";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Server datisekai is running");
});
app.use("/v1/home", HomeRouters);
app.use("/v1/rank", RankRouters);
app.use("/v1/detail", DetailRouters);
app.use("/v1/chap", ChapRouters);
app.use("/v1/search", SearchRouters);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
