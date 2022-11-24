import axios from "axios";
import express from "express";
import { parse } from "node-html-parser";
const routes = express.Router();

routes.get("/", async (req, res) => {
  const keyword = req.query.keyword;
  const page = Number(req.query.page) || 1;

  if (!keyword) {
    return res.status(400).json("Không có từ khóa tìm kiếm");
  }

  try {
    const url = `${process.env.BASE_URL}tim-truyen`;
    const html = await axios(url, { params: { page, keyword } });
    const root = parse(html.data);
    const data = root.querySelectorAll(".item-manga").map((item) => {
      const name = item.querySelector(
        ".item > .clearfix > .caption > h3 > a"
      ).textContent;
      const img = item
        .querySelector(".item > .clearfix > .image-item > a > img")
        .getAttribute("src");
      const href = item
        .querySelector(".item > .clearfix > .image-item > a")
        .getAttribute("href")
        .split("truyen-tranh")[1];

      const newChapters = item
        .querySelectorAll(".item > .clearfix > .caption > ul > .chapter-detail")
        .map((chapter) => {
          return {
            name: chapter.querySelector("a").textContent,
            href: chapter.querySelector("a").getAttribute("href"),
            time: chapter.querySelector("i").textContent,
          };
        });

      return {
        name,
        img,
        href,
        newChapters,
      };
    });

    const totalPage = root.querySelectorAll(
      ".pagination > .page-item > .page-link"
    );

    res.json({
      data,
      totalPage:
        totalPage.length > 0
          ? Number(totalPage[totalPage.length - 2].textContent)
          : 1,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server not fount!");
  }
});

export default routes;
