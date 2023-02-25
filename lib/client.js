const { readdirSync } = require("fs");
const options = require("../options.json")

module.exports = class Client {

    constructor(){

        this.modules = [];

        for(const mod_category of readdirSync("mods")){

            for(const mod_file of readdirSync("mods/"+mod_category)){

                const mod = require("../actions/"+mod_category+"/"+mod_file);

                this.modules.push(new mod());

            }

        }

    }

    static tokenize(str){

        const sp = str.split(/[ \?\!\.\,\-]/).filter(e => /[a-zA-Z0-9]/.test(e));
        return sp;

    }

    async question(text){

        const prom = [];

        this.modules.forEach(async (element) => {
            prom.push(element.getPoints(text));
        })

        const result = await Promise.all(prom);

        result.sort((a, b) => {
            return b.points - a.points
        });

        return {
            type: result[0].module._name,
            points: result[0].points,
            text: await result[0].module.reply(options, result[0].options || {}),
            results: result.slice(1, 5).map(e => ({
                type: e.module._name,
                value: e.points,
            }))
        };

    }

}