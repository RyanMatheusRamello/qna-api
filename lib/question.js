const natural = require('natural');
const Client = require('./client');
const tokenizer = new natural.AggressiveTokenizerPt();

function isEqual(a, b){
    if(a.length!=b.length) return false;
    else{
        for(let i=0;i<a.length;i++)
            if(a[i]!=b[i])
                return false;
        return true;
    }
}

module.exports = class Question {

    constructor(name, question=[]){

        this._name = name;
        this.question = this._prepareQuestion(question);

    }

    async getPoints(text){

        const options = {};
        let max = 0;
        const terms = [];
        let _indexed = {};

        let tokens = tokenizer.tokenize(text);

        if(natural.JaroWinklerDistance(tokens[0].toLowerCase(), "me", true) > 0.85){
            if(
                natural.JaroWinklerDistance(tokens[1].toLowerCase(), "fale", true) > 0.85 ||
                natural.JaroWinklerDistance(tokens[1].toLowerCase(), "diga", true) > 0.85 ||
                natural.JaroWinklerDistance(tokens[1].toLowerCase(), "responda", true) > 0.85 ||
                natural.JaroWinklerDistance(tokens[1].toLowerCase(), "revele", true) > 0.85
                ){
                    tokens.shift();
                    tokens.shift();
                    if(tokens[0] && natural.JaroWinklerDistance(tokens[0].toLowerCase(), "qual", true) < 0.85){
                        tokens.unshift("qual");
                    }
            }
        }

        const token_filted = tokens.filter(e => e.length > 1);

        for(const question_index in this.question){

            const question = this.question[question_index];

            if(question.raw === text){
                _indexed[question_index] = 100;
                max = 100;
                break;
            }

            if(isEqual(tokens, question.raw_splited)){
                _indexed[question_index] = 95;
                max = 95;
                continue;
            }

            if(isEqual(token_filted, question.splited)){
                _indexed[question_index] = 90;
                max = 90;
                continue;
            }

            let m = 90;
            let x = 90/question.splited.length;

            for(const index in question.splited){
                
                let d = 0;
                if(question.splited[index] && token_filted[index]){
                    if(question.splited[index].startsWith("{") && question.splited[index].endsWith("}")){
                        let name = question.splited[index].replace(/\{\*+([a-zA-Z0-9]+)\*+\}/, "$1");
                        if(question.splited[index][2] !== "*"){
                            terms.push([question_index, name, token_filted[index]])
                            d = 1;
                        }else{
                            terms.push([question_index, name, token_filted.slice(Number(index)).join(" ")])
                            break;
                        }
                    }else{
                        d = natural.JaroWinklerDistance(question.splited[index], token_filted[index], true);
                    }
                }
                //console.log(`Diminuiu ${x * ((d - 1) * -1)}`, question.splited[index], token_filted[index], index, token_filted)
                m -= x * ((d - 1) * -1)

            }

            _indexed[question_index] = m;

            if(max < m) max = m;

            let d = natural.JaroWinklerDistance(question.raw, text, true) * 100;

            if(max < d) {
                max = d;
                _indexed[question_index] = d;
            }

            for(const index in question.splited_raw){
                
                let d = 0;
                if(question.splited_raw[index] && token_filted[index]){
                    if(question.splited_raw[index].startsWith("{") && question.splited[index].endsWith("}")){
                        let name = question.splited_raw[index].replace(/\{\*+([a-zA-Z0-9]+)\*+\}/, "$1");
                        if(question.splited_raw[index][2] !== "*"){
                            terms.push([question_index, name, token_filted[index]])
                            d = 1;
                        }else{
                            terms.push([question_index, name, token_filted.slice(Number(index)).join(" ")])
                            break;
                        }
                    }else{
                        d = natural.JaroWinklerDistance(question.splited_raw[index], token_filted[index], true);
                    }
                }
                //console.log(`Diminuiu ${x * ((d - 1) * -1)}`, question.splited[index], token_filted[index], index, token_filted)
                m -= x * ((d - 1) * -1)

            }

            if(max < m) {
                _indexed[question_index] = m;
                max = m;
            }

            let d2 = natural.JaroWinklerDistance(question.raw, text, true) * 100;

            if(max < d2) {
                max = d2;
                _indexed[question_index] = d2;
            }

        }

        let _m = -1;
        let _mi = -1;

        for(const key of Object.keys(_indexed)){
            if(_m < _indexed[key]){
                _mi = key;
                _m = _indexed[key]
            }
        }

        for(const item of terms.filter(e => e[0] == _mi)){
            options[item[1]] = item[2];
        }

        return {
            module: this,
            points: max,
            options
        }
    }

    /**
     * @private
     * @param {string[]} questions
     */
    _prepareQuestion(questions){

        const question = [];
        const extra = [];

        for(const _q of questions){
            /**
             * @type {{raw: string, raw_splited: string[], splited: string[]}}
             */
            const option = { raw: _q, raw_splited: [], splited: [] };
            const words = Client.tokenize(_q);
            option.raw_splited = words;
            option.splited = words.filter(e => e.length > 1);
            question.push(option);
        }

        return question;

    }

}