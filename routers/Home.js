import axios from "axios";
import { parse } from "node-html-parser";
import express from "express";

const routes = express.Router();

routes.get("/", async (req, res) => {
  const url = process.env.BASE_URL;

  try {
    const html = await axios(url);
    const root = parse(html.data);
    const data = root.querySelectorAll(".item-manga").map((item, index) => {
      const name = item.querySelector(".caption > h3 > a").textContent;
      const img = item
        .querySelector(".image-item > a > img")
        .getAttribute("src");
      const href = item
        .querySelector(".image-item > a")
        .getAttribute("href")
        .split("truyen-tranh")[1];

      const newChapters = item
        .querySelectorAll(".caption > ul > .chapter-detail")
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
    return res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server not fount!");
  }
});
routes.get("/banner", async (req, res) => {
  const url = process.env.BASE_URL + "tim-truyen?sort=9";

  try {
    const html = await axios(url);
    const root = parse(html.data);
    const data = root.querySelectorAll(".item-manga").map((item) => {
      const name = item.querySelector(
        ".pop-up > .manga-information > .title > span"
      ).textContent;
      const img = item
        .querySelector(".item > .clearfix > .image-item > a > img")
        .getAttribute("src");
      const href = item
        .querySelector(".item > .clearfix > .image-item > a")
        .getAttribute("href")
        .split("truyen-tranh")[1];
      const description = item.querySelector(
        ".pop-up > .manga-information > .content-manga > p"
      ).innerHTML;
      const info = item
        .querySelectorAll(
          ".pop-up > .manga-information > .clearfix > .synopsis > p"
        )
        .map((p) => {
          return p.textContent;
        });

      return {
        name,
        img,
        href,
        description,
        info: info.reduce((final, i) => {
          final[i.split(":")[0]] = i.split(":")[1];
          return final;
        }, {}),
      };
    });

    return res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server not fount!");
  }
});

export default routes;
