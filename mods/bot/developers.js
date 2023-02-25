const Question = require("../../lib/question");

const join = (a) => {
    let t = "";
    for(const index in a){
        if(index != 0){
            if(index == a.length-1){
                t += " e "
            }else{
                t += ", "
            }
        }
        t += a[index];
    }
    return t;
}

module.exports = class Developers extends Question {

    constructor(){

        super("bot.developer", [
            "quem te desenvolveu",
            "quais pessoas te desenvolveram",
            "quem desenvolveu tu",
            "quem desenvolveu voce",
        ])

    }

    reply(options){

        return `Eu fui desenvolvid${options.gender == "F" ? "a" : "o"} por ${join(options.developers)}`

    }

}