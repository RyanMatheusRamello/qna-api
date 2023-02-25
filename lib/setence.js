const { SentenceTokenizerNew, WordTokenizer, JaroWinklerDistance } = require("natural");
const removeAccents = require("./accent");
const { readFileSync } = require("fs");

const tokenizer = new SentenceTokenizerNew();
const wordTokenizer = new WordTokenizer();

function word_type(palavra, words){
    
    if(words[palavra]){
        return [palavra, words[palavra]]
    }
    let m = -1;
    let t = null;
    let w = null;
    for(const word of Object.keys(words)){
        let k = JaroWinklerDistance(word, palavra, true)
        if(k > m){
            m = k;
            t = words[word];
            w = word;
            if(k === 1) return [w, word];
        }
    }
    if(m > 0.85) return [w, t];
    return null;
}

const negative = ["não", "nao", "negativo"];

const terms = {
    "identify": ["quem", "identifique"],
    "question": ["qual", "como", "em"],
    "explication": ["cujo", "explique"],
    "local": ["onde", "local"],
    "quantity": ["quanto", "quantos"],
    "time": ["quando"]
}

const pronomes = [
    ["eu", "meu"], // referencia o guest
    ["tu", "voce", "vc", "seu", "sua"], // referencia o bot
    ["ele", "ela", "dele", "dela", "de", "da"], // referencia outra pessoa
    ["nos", "nosso", "nossos"], // referencia o bot, mas com o guest tbm
    ["vos", "voces", "seus", "suas"], // referencia o bot e mais alguem
    ["eles", "elas", "deles", "delas"] // referencia outras pessoas
]

const article = {
    "_global": ["que"],
    "definition": ["a", "o"],
    "expecification": ["do", "da"]
}

const temps = {
    "passed_def": ["foi"],
    "present_def": ["é"],
    "future_def": ["será"]
}

function tokenize_question(obj, keywords=[]){
    const words = JSON.parse(readFileSync("lib/db/words.json"));

    for(const keyword of keywords){
        if(!words[keyword]){
            words[keyword] = ["keywords"];
        }else{
            words[keyword].push("keywords");
        }
    }

    const tokens = obj.tokenized;

    function next_type(n=1){
        return tokens[i+n].type;
    }

    function get_next(n=1){
        return tokens[i+n];
    }

    function has_next(n=1){
        return !!tokens[i+n];
    }

    let i=-1;
    obj.extra = {}
    obj.values = [];
    obj.values_all = [];
    while(!!tokens[i+1]){
        i++;

        switch(tokens[i].type){
            case "person": 
                if(tokens[i].param[0] === 2 || tokens[i].param[0] === 4 || tokens[i].param[0] === 5){
                    obj.referenceBot = true;
                }
                if(tokens[i].param[0] === 1 || tokens[i].param[0] === 4){
                    obj.referenceGuest = true;
                }
                break
            case "uknown":
                obj.values_all.push(tokens[i].value);
                const type = word_type(tokens[i].value, words);
                console.log(tokens[i].value, type);
                if(type){
                    for(const t of type[1]){
                        if(!obj.extra[t]) obj.extra[t] = [];
                        obj.extra[t].push(type[0]);
                    }
                }else{
                    obj.values.push(tokens[i].value);
                }
                break;
        }
        
    }

}

module.exports = function setence(text){

    const ret = [];

    const setences = tokenizer.tokenize(removeAccents.remove(text));

    for(const setence of setences){

        const obj = {
            type: "uknown",
            typePrecision: -1,
            referenceBot: false,
            referenceGuest: false,
            person: [],
            tokens: [],
            tokenized: []
        }

        obj.tokens = wordTokenizer.tokenize(setence);

        // obtenha o tipo de termo
        let _tn = null;
        let _tm = -1;
        for(const term_key of Object.keys(terms)){
            for(const term of terms[term_key]){
                const k = JaroWinklerDistance(term, obj.tokens[0], true);
                if(k > _tm){
                    _tm = k;
                    _tn = term_key;
                    if(k === 1) break; 
                }
            }
        }

        obj.type = _tn;
        obj.typePrecision = _tm * 100;

        if(obj.typePrecision < 85){
            obj.type = "term_uknown";
            obj.typePrecision = 84.9;
            obj.tokens.unshift("?");
        }

        for(const token of obj.tokens.slice(1)){
            let _tn = null;
            let _tm = -1;
            for(const article_key of Object.keys(article)){
                for(const artic of article[article_key]){
                    const k = JaroWinklerDistance(token, artic, true);
                    if(k > _tm){
                        _tm = k;
                        _tn = article_key;
                        if(k === 1) break;
                    }
                }
            }
            if(_tm === 1){
                obj.tokenized.push({
                    type: _tn,
                    param: [],
                    precision: _tm*100,
                    value: token
                });
                continue;
            }
            for(const temp_key of Object.keys(temps)){
                for(const artic of temps[temp_key]){
                    const k = JaroWinklerDistance(token, artic, true);
                    if(k > _tm){
                        _tm = k;
                        _tn = temp_key;
                        if(k === 1) break;
                    }
                }
            }
            if(_tm === 1){
                obj.tokenized.push({
                    type: _tn,
                    precision: _tm*100,
                    param: [],
                    value: token
                });
                continue;
            }
            let p = null;
            for(const index in pronomes){
                const _index = `person`
                for(const pronome of pronomes[index]){
                    const k = JaroWinklerDistance(token, pronome, true);
                    if(k > _tm){
                        p = Number(index) + 1;
                        _tm = k;
                        _tn = _index;
                        if(k === 1) break;
                    }
                }
            }
            if(_tm === 1){
                obj.tokenized.push({
                    type: _tn,
                    precision: _tm*100,
                    param: [p],
                    value: token
                });
                continue;
            }
            obj.tokenized.push({
                type: _tm*100 > 85 ? _tn : "uknown",
                precision: _tm*100,
                param: (_tn == "person" && _tm*100 > 85) ? [p] : [],
                value: token
            });
        }

        tokenize_question(obj)
        ret.push(obj);

    }

    return ret;

}