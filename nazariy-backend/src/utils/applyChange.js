const { query } = require("../db");
const { genId } = require("./id");

const EMPTY_OPTIONS = JSON.stringify({ uz: ["", "", "", ""], ru: ["", "", "", ""], kril: ["", "", "", ""] });

// Frontenddagi `applyChange(type, payload)` funksiyasining backend ekvivalenti.
// PendingChange tasdiqlanganda yoki super admin to'g'ridan-to'g'ri amal bajarganda chaqiriladi.
//
// payload shakllari (frontend bilan bir xil):
//   add_ticket:           { isPro, questionCount }
//   delete_ticket:        { ticketId }
//   toggle_ticket_pro:    { ticketId, isPro }
//   edit_ticket_questions:{ ticketId, questions: [...] }
//   add_topic:            { title:{uz,ru,kril}, color, icon? }
//   delete_topic:         { topicId }
//   add_rule_category:    { title:{uz,ru,kril}, color, icon? }
//   add_rule_item:        { categoryId, item:{uz,ru,kril,desc?,image?} }
//   delete_rule_item:     { itemId }

async function applyChange(type, payload) {
  switch (type) {
    case "add_ticket": {
      const last = await query("SELECT number FROM Ticket ORDER BY number DESC LIMIT 1");
      const number = (last[0]?.number || 0) + 1;
      const result = await query("INSERT INTO Ticket (number, isPro) VALUES (?,?)", [number, payload.isPro ? 1 : 0]);
      const ticketId = result.insertId;

      const count = payload.questionCount || 20;
      const values = [];
      const placeholders = [];
      for (let i = 0; i < count; i++) {
        values.push(genId(), ticketId, i, "", "", "", EMPTY_OPTIONS, 0, "", "", "");
        placeholders.push("(?,?,?,?,?,?,?,?,?,?,?)");
      }
      await query(
        `INSERT INTO Question (id,ticketId,\`order\`,questionUz,questionRu,questionKril,optionsJson,correct,explanationUz,explanationRu,explanationKril) VALUES ${placeholders.join(",")}`,
        values
      );
      return { id: ticketId, number, isPro: !!payload.isPro };
    }

    case "delete_ticket": {
      await query("DELETE FROM Ticket WHERE id = ?", [payload.ticketId]);
      return { ok: true };
    }

    case "toggle_ticket_pro": {
      await query("UPDATE Ticket SET isPro=? WHERE id=?", [payload.isPro ? 1 : 0, payload.ticketId]);
      return { id: payload.ticketId, isPro: !!payload.isPro };
    }

    case "edit_ticket_questions": {
      const { ticketId, questions } = payload;
      // Eski savollarni o'chirib, yangilarini yaratamiz (oddiy yondashuv)
      await query("DELETE FROM Question WHERE ticketId = ?", [ticketId]);

      const values = [];
      const placeholders = [];
      questions.forEach((q, i) => {
        values.push(
          genId(), ticketId, i,
          q.question?.uz || "", q.question?.ru || "", q.question?.kril || "",
          JSON.stringify(q.options || { uz: [], ru: [], kril: [] }),
          q.correct || 0, q.image || null, q.topicId || null,
          q.explanation?.uz || "", q.explanation?.ru || "", q.explanation?.kril || ""
        );
        placeholders.push("(?,?,?,?,?,?,?,?,?,?,?,?,?)");
      });
      if (values.length) {
        await query(
          `INSERT INTO Question (id,ticketId,\`order\`,questionUz,questionRu,questionKril,optionsJson,correct,image,topicId,explanationUz,explanationRu,explanationKril) VALUES ${placeholders.join(",")}`,
          values
        );
      }
      return { ok: true };
    }

    case "add_topic": {
      const id = genId();
      await query("INSERT INTO Topic (id,titleUz,titleRu,titleKril,color,icon) VALUES (?,?,?,?,?,?)", [
        id, payload.title.uz, payload.title.ru || payload.title.uz, payload.title.kril || payload.title.uz,
        payload.color, payload.icon || "book",
      ]);
      return { id };
    }

    case "delete_topic": {
      await query("DELETE FROM Topic WHERE id = ?", [payload.topicId]);
      return { ok: true };
    }

    case "add_rule_category": {
      const id = genId();
      await query("INSERT INTO RuleCategory (id,titleUz,titleRu,titleKril,color,icon) VALUES (?,?,?,?,?,?)", [
        id, payload.title.uz, payload.title.ru || payload.title.uz, payload.title.kril || payload.title.uz,
        payload.color, payload.icon || "info",
      ]);
      return { id };
    }

    case "add_rule_item": {
      const { categoryId, item } = payload;
      const last = await query("SELECT `order` FROM RuleItem WHERE categoryId=? ORDER BY `order` DESC LIMIT 1", [categoryId]);
      const order = (last[0]?.order || 0) + 1;
      const id = genId();
      await query(
        "INSERT INTO RuleItem (id,categoryId,`order`,titleUz,titleRu,titleKril,descUz,descRu,descKril,image) VALUES (?,?,?,?,?,?,?,?,?,?)",
        [id, categoryId, order, item.uz, item.ru || item.uz, item.kril || item.uz,
         item.desc?.uz || null, item.desc?.ru || null, item.desc?.kril || null, item.image || null]
      );
      return { id };
    }

    case "delete_rule_item": {
      await query("DELETE FROM RuleItem WHERE id = ?", [payload.itemId]);
      return { ok: true };
    }

    default:
      throw new Error(`Noma'lum o'zgarish turi: ${type}`);
  }
}

module.exports = { applyChange };
