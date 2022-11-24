import axios from "axios";
import express from "express";
import { parse } from "node-html-parser";
const routes = express.Router();

routes.get("/:slug/:chap/:id", async (req, res) => {
  const slug = req.params.slug;
  const chap = req.params.chap;
  const id = req.params.id;

  if (!slug || !chap || !id) {
    return res.status(400).json("Thiếu tham số slug chap id");
  }

  try {
    const url = `${process.env.BASE_URL}truyen-tranh/${slug}/${chap}/${id}`;
    const html = await axios(url);
    const root = parse(html.data);
    const results = root.querySelectorAll(".page-chapter").map((item) => ({
      img: item.querySelector("img").getAttribute("src"),
      alt: item.querySelector("img").getAttribute("alt"),
    }));
    res.json({ results });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server not fount!");
  }
});
routes.get("/chapters/:slug/:chap/:id", async (req, res) => {
  const slug = req.params.slug;
  const chap = req.params.chap;
  const id = req.params.id;

  if (!slug || !chap || !id) {
    return res.status(400).json("Thiếu tham số slug chap id");
  }

  try {
    const url = `${process.env.BASE_URL}truyen-tranh/${slug}/${chap}/${id}`;
    const html = await axios(url);
    const root = parse(html.data);
    const chapters = root
      .querySelectorAll("#select_chapter > option")
      .map((item) => ({
        name: item.textContent,
        href: item.getAttribute("value").split("truyen-tranh")[1],
      }));
    res.json({ chapters });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server not fount!");
  }
});

export default routes;
