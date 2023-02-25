const Question = require("../../lib/question");

const TXT = {
    "F": "feminino",
    "M": "masculino",
    "NB": "não binário"
}

module.exports = class Gender extends Question {

    constructor(){

        super("bot.gender", [
            "qual seu genero",
            "qual o seu sexo"
        ])

    }

    reply(options){

        if(!options.gender || !TXT[options.gender]) return `Eu sou uma IA, não possuo gênero`
        return `Eu sou do gênero ${TXT[options.gender]}`;

    }

}