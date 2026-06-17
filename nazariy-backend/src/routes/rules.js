const express = require("express");
const { query } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /rules — yo'l qoidalari toifalari va belgilari
router.get("/", requireAuth, async (req, res) => {
  const categories = await query("SELECT * FROM RuleCategory ORDER BY createdAt ASC");
  const items = await query("SELECT * FROM RuleItem ORDER BY `order` ASC");

  res.json(categories.map(cat => ({
    id: cat.id,
    title: { uz: cat.titleUz, ru: cat.titleRu, kril: cat.titleKril },
    desc: { uz: cat.descUz || "", ru: cat.descRu || "", kril: cat.descKril || "" },
    color: cat.color,
    icon: cat.icon,
    items: items.filter(it => it.categoryId === cat.id).map(it => ({
      id: it.id,
      title: { uz: it.titleUz, ru: it.titleRu, kril: it.titleKril },
      desc: it.descUz ? { uz: it.descUz, ru: it.descRu || it.descUz, kril: it.descKril || it.descUz } : null,
      image: it.image,
    })),
  })));
});

module.exports = router;
