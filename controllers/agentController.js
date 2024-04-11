//Models
const agentModel = require("../models/agentModel.js");

module.exports = {
  settings: (req, res) => {
    agentModel.getAgentById(req.headers.userid, (result, err) => {
      if (result === null) {
        console.log("error occured: ", err);
      } else {
        res.json({
          agent: result[0][0],
          path: "settings"
        });
      }
    });
  },

  updateSettings: (req, res) => {
    const body = req.body;
    agentModel.updateAgent(body.userId, body, (result, err) => {
      if (result === null) {
        console.log("error occured: ", err);
      } else {
        return res.status(302).redirect("/agent/settings");
      }
    });
  },
  updatePassword: (req, res) => {
    agentModel.updateAgentPassword(req.body.userId, req.body, (result, err) => {
      if (result === null) {
        if (err === "pwerror") {
          res.json({ message: "입력한 비밀번호가 잘못되었습니다." });
        }
      } else {
        res.redirect("/agent/settings");
      }
    });
  },

  deleteAccount: async (req, res) => {
    try {
      await agentModel.deleteAccountProcess(req.body.userId);
      res.clearCookie("userType");
      res.clearCookie("authToken")
      res.status(302).redirect("/");
    } catch (error) {
      res.json({ message: error });
    }
  }
};
