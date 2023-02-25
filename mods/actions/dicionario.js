const Question = require("../../lib/question");
const Dicio = require("../../lib/dicionario");

module.exports = class Dicionario extends Question {

    constructor(){

        super("actions.dicionario", [
            "defina a palavra {**word**}",
            "defina {**word**}"
        ])

    }

    async reply(options, opt){

        console.log(opt);
        const {word} = opt;

        if(!word) return "Não entendi o que tenho que definir";

        const term = await Dicio.search(word);

        if(term.length === 0){
            return "Não conheço a palavra que você me pede para definir";
        }

        const result = await Dicio.details(term[0].url)

        return `De acordo com dicio.com.br, ${word} é um ${result.type}, cuja definição é ${result.details[0]}`

    }

}