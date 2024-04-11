//db정보받기
const db = require("../config/db.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  // [msa]
  getAgentById: async (userId, result) => {
    try {
      let rawQuery = `
      SELECT *
      FROM agent
      RIGHT OUTER JOIN agentList
      ON ra_regno=agentList_ra_regno
      WHERE a_username=?;`;
      const res = await db.query(rawQuery, [userId]);
      result(res);
    } catch (error) {
      result(null, error);
    }
  },
  // [msa]
  updateAgent: async (id, body, result) => {
    try {
      const res = await db.query(
        `UPDATE agent SET a_email=? 
      WHERE a_username=?`,
        [body.email, id]
      );
      result(res);
    } catch (error) {
      result(null, error);
    }
  },
  // [msa]
  updateAgentPassword: async (id, body, result) => {
    try {
      const passwordHash = await bcrypt.hash(body.password, saltRounds);
      const passwordResult = await db.query(
        `SELECT a_password FROM agent WHERE a_username=?`,
        [id]
      );
      const password = passwordResult[0][0].a_password;
      const test = await bcrypt.compare(body.oldpassword, password);
      if (!test) {
        console.log("here!", test);
        result(null, "pwerror");
      } else {
        const res = await db.query(
          "UPDATE agent SET a_password=? WHERE a_username=?",
          [passwordHash, id]
        );
        result(res);
      }
    } catch (error) {
      console.error(error);
      result(null, error);
    }
  },
  // [msa]
  deleteAccountProcess: async (a_username) => {
    try {
      const rawQuery = `
      DELETE FROM agent
      WHERE a_username=?
      `;
      await db.query(rawQuery, [a_username]);
      return 1;
    } catch (error) {
      return null;
    }
  }
};
