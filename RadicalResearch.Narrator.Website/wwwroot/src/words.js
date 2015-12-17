'use strict';

function Words() {
    this.recorded = [];
}

/**
 * Load available word list from server
 */
Words.prototype.load = function load() {
    return this.download().then(this.downloadSuccess.bind(this));
}

Words.prototype.getWordKey = function (word) {
    return word.replace(/[^\w'\-]/g, '').toUpperCase();
}

Words.prototype.add = function add(word) {
    let key = this.getWordKey(word);
    if (this.recorded.indexOf(key) === -1) {
        this.recorded.push(key);
    }
}

Words.prototype.contains = function contains(word) {
    let key = this.getWordKey(word);
    return (this.recorded.indexOf(key) !== -1);
}

Words.prototype.download = function download() {
    function promiseFunction(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/audio', true);
        xhr.onload = function () {
            if (xhr.status < 400) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject(Error(xhr.statusText));
            }
        };
        xhr.onerror = function (e) {
            reject(e);
        };

        return xhr.send();
    };

    return new Promise(promiseFunction.bind(this));
}

Words.prototype.downloadSuccess = function downloadSuccess(wordList) {
    wordList.forEach((url) => this.addUrl(url));
}

Words.prototype.addUrl = function addUrl(url) {
    var word = /([\w-]+)\.mp3$/.exec(url)[1].toUpperCase();
    this.add(word);
}

export default Words;