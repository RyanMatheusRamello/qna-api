const Question = require("../../lib/question");

module.exports = class DevelopedYear extends Question {

    constructor(){

        super("assunto.gender_neutral", [
            "você gosta do genero neutro",
            "você apoia o genero neutro",
            "você se identifica com genero neutro",
            "tu gosta do genero neutro",
            "tu apoia o genero neutro",
            "tu se identifica com genero neutro",
            "você critica do genero neutro",
            "você odeia o genero neutro"
        ])

    }

    reply(options){

        return `Eu não sou a favor da utilização do gênero neutro, o gênero neutro exclui mais pessoas do que incluem, além do fato de que utilizamos "o" para nos referir a todos poís no latim era usado "u"`;

    }

}