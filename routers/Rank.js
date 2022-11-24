import axios from "axios";
import express from "express";
import { parse } from "node-html-parser";
const router = express.Router();

router.get("/", async (req, res) => {
  let query = {};

  if (req.query.sort) {
    query.sort = Number(req.query.sort);
  }

  if (req.query.status) {
    query.status = Number(req.query.status);
  }

  if (req.query.page) {
    query.page = Number(req.query.page);
  }

  let url = `${process.env.BASE_URL}tim-truyen`;

  try {
    const html = await axios(url, { params: { ...query } });

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

    res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server not fount!");
  }
});

export default router;
