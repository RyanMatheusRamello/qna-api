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

module.exports = class Email extends Question {

    constructor(){

        super("bot.email", [
            "qual é o seu email",
            "qual é o seu e-mail",
            "qual é o seu endereço de e-mail",
            "qual é o seu endereço de email",
            "qual o seu email",
            "qual o seu e-mail",
            "qual o seu endereço de e-mail",
            "qual o seu endereço de email",
            "qual é seu email",
            "qual é seu e-mail",
            "qual é seu endereço de e-mail",
            "qual é seu endereço de email",
            "qual seu email",
            "qual seu e-mail",
            "qual seu endereço de e-mail",
            "qual seu endereço de email",
            "como te contatar",
            "qual seu e-mail de contato",
            "qual seu email de contato",
            "qual seu endereço"
        ])

    }

    reply(options){

        if(!options.email) return "Eu não possuo um e-mail";
        return `Meu e-mail é ${options.email}`;

    }

}