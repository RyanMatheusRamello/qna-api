const { JaroWinklerDistance } = require("natural");

const ENTITIES = [
    "livro",
    "filme",
    "serie",
    "anime",
    "dorama",
    "manga",
    "youtuber",
    "tiktoker"
]

module.exports = function Conhece(term){

    const i = term.split(" ");

    let _en = null;
    let _ep = -1;

    for(const entity of ENTITIES){
        let p = JaroWinklerDistance(entity, i[0], true);
        if(_ep < p){
            _ep = p;
            _en = entity;
        }
        if(_ep === 1){
            break;
        }
    }

    if(_ep > 0.80) return [_en, i.slice(1).join(" ")];
    return null

}