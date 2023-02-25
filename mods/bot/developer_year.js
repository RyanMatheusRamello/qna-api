const Question = require("../../lib/question");

module.exports = class DevelopedYear extends Question {

    constructor(){

        super("bot.developed_year", [
            "em que ano você foi desenvolvido",
            "em que ano você foi desenvolvida",
            "em que ano tu foi desenvolvida",
            "em que ano tu foi desenvolvido",
            "que ano você foi desenvolvida",
            "que ano você foi desenvolvido",
            "ano você foi desenvolvida",
            "ano você foi desenvolvido",
            "que ano tu foi desenvolvida",
            "que ano tu foi desenvolvido",
            "ano tu foi desenvolvida",
            "ano tu foi desenvolvido",
        ])

    }

    reply(options){

        return `Eu fui desenvolvid${options.gender == "F" ? "a" : "o"} no ano de ${options.developer_year || 2023}`;

    }

}