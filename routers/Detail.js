import axios from "axios";
import express from "express";
import { parse } from "node-html-parser";
const router = express.Router();

router.get("/:slug/:id", async (req, res) => {
  const slug = req.params.slug;
  const id = req.params.id;

  if (!slug || !id) {
    return res.status(400).json("Thiếu tham số slug và id");
  }

  const url = `${process.env.BASE_URL}truyen-tranh/${slug}/${id}`;

  try {
    const html = await axios(url);
    const root = parse(html.data);

    const name = root.querySelector(".title-manga").textContent;
    const author = root.querySelector(
      ".info-detail-comic > .author > .detail-info"
    ).textContent;
    const img = root.querySelector(".image-info > img").getAttribute("src");
    const updatedAt = root.querySelector(".time-update").textContent;
    const status = root.querySelector(
      ".info-detail-comic > .status > .detail-info > span"
    ).textContent;
    const categories = root
      .querySelectorAll(
        ".info-detail-comic > .category > .detail-info > span > a"
      )
      .map((category) => ({
        category: category.textContent,
        href: category.getAttribute("href"),
      }));

    const content = root.querySelector(".detail-summary").textContent;
    const chapters = root
      .querySelectorAll("#list-chapter-dt > nav > ul > li")
      .map((chapter) => ({
        name: chapter.querySelector(".chapters > a").textContent,
        href: chapter
          .querySelector(".chapters > a")
          .getAttribute("href")
          .split("truyen-tranh")[1],
        time: chapter.querySelectorAll(".text-center")[0]?.textContent,
      }))
      .filter((p) => p.time);

    res.json({
      name,
      author,
      img,
      status,
      updatedAt,
      content,
      categories,
      chapters,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server not fount!");
  }
});

// vd: /v1/details/dai-quan-gia-la-ma-hoang-21948

export default router;
