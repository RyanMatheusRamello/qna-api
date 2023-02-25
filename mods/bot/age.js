const Question = require("../../lib/question");

module.exports = class Age extends Question {

    constructor(){

        super("bot.age", {
            keywords: ["nasceu", "nascer"]
        })

    }

    reply(options){

        if(!options.age) return `Eu sou uma IA, não possuo idade`
        return `Eu tenho ${options.age} anos`

    }

}