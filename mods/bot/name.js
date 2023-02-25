const Question = require("../../lib/question");

module.exports = class Name extends Question {

    constructor(){

        super("bot.name", [
            "qual o seu nome",
            "como se chamam",
            "como te chamam",
            "como você é chamado",
            "qual é a forma que tu é chamado",
            "qual é a forma que você é chamado",
            "qual é a forma que tu é chamada",
            "qual é a forma que você é chamada",
        ])

    }

    reply(options){

        return `Me chamam de ${options.name}`

    }

}