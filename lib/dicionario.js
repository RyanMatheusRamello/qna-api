const Cheerio = require("cheerio");
const axios = require("axios")

module.exports = class Dicio {

    /**
     * @private
     */
    static _completeURL(url){
        if(url.startsWith("http://") || url.startsWith("http://")) return url;
        if(url.startsWith("/")) return `https://www.dicio.com.br${url}`
        return `https://www.dicio.com.br/${url}`
    }

    static async search(word){

        const resultPage = await axios.default.get(`https://www.dicio.com.br/pesquisa.php?q=${encodeURI(word)}`, {
            maxRedirects: 0,
            validateStatus: () => true
        });
        
        if(resultPage.status === 200){
            const $ = Cheerio.load(resultPage.data);

            const result = [];

            const _self = this;
            $(".resultados li").each(function(){
                const url = _self._completeURL($(this).find("a").attr("href"));
                const word = $(this).find(".list-link").text().trim();
                result.push({
                    url, word
                });
            })

            return result
        }else if(resultPage.status === 301){

            const result = [];
            result.push({
                url: this._completeURL(resultPage.headers.location),
                word: resultPage.headers.location.replace(/^\/|\/$/g, "")
            })

            return result;


        }

        return [];
    }

    static async details(url){

        const resultPage = await axios.default.get(url);

        const $ = Cheerio.load(resultPage.data);

        const word = $(".title-header h1").text().trim();
        let etim = null;
        let type = null;
        const details = [];

        $(".significado span").each(function(){
            //console.log($(this).text(), $(this).attr("class"));
            if($(this).hasClass("cl")){
                type = $(this).text().trim();
            }else if($(this).hasClass("etim")){
                // etimologia
                etim = $(this).text().trim();
            }else{
                // explication
                details.push($(this).text().trim())
                
            }
        })

        return {
            word,
            type,
            etim,
            details
        }

    }

}