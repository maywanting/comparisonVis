export default class jsonData {
    static getData (fileName) {
        let filePath = 'data/fish/';
        let file = filePath + fileName + '.json';
        return fetch(file).then(response => response.json()).then(jsondata => {
            this.res = jsondata;
        });
    }
    static resData () {
        return this.res;
    }
};
