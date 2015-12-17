'use strict';

function Text() {
    this.title = null;
    this.rx = /[\w\-']+/g;
    this.currentIndex = 0;
}

Text.prototype.nextWord = function nextWord() {
    let result = this.rx.exec(this.text);
    if (result) {
        this.currentIndex++;
        return result[0];
    }
    return null;
}

Text.prototype.load = function load(title) {
    this.title = title;
    return this.download().then(this.downloadSuccess.bind(this));
}

Text.prototype.download = function download() {

    function promiseFunction(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/text/' + this.title + '.txt', true);
        xhr.onload = function () {
            if (xhr.status < 400) {
                resolve(xhr.response);
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
};

Text.prototype.downloadSuccess = function downloadSuccess(text) {
    this.text = text;
    this.reset();
}

Text.prototype.reset = function reset() {
    this.currentIndex = 0;
    this.rx.lastIndex = 0;
}

export default Text;