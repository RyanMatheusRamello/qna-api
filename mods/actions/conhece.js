const Question = require("../../lib/question");
const Dicio = require("../../lib/dicionario");
const conhece = require("../../lib/conhece");

module.exports = class Dicionario extends Question {

    constructor(){

        super("actions.conhece", [
            "voce conhece {**entity**}",
            "vc conhece {**entity**}",
            "tu conhece {**entity**}",
            "tu já ouviu falar de {**entity**}",
            "tu já ouviu falar do {**entity**}",
            "tu já ouviu falar da {**entity**}",
        ])

    }

    async reply(options, { entity }){
        
        if(!entity) return "Eu não entendi o que você está me perguntando";

        const term = conhece(entity);

        return term

    }

}