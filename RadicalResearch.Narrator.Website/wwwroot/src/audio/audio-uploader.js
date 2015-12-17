'use strict';

function AudioUploader() {
}

AudioUploader.prototype.upload = function upload(blob, word) {

    function promiseFunction(resolve, reject) {

        var formData = new FormData();
        formData.append("word", word);
        formData.append("file", blob);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/audio', true);
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

        return xhr.send(formData);
    };

    return new Promise(promiseFunction.bind(this));
}

export default AudioUploader;