'use strict';

import createAudioContext from './create-audio-context';

function AudioPlayer() {
    this.audioContext = createAudioContext();
}

AudioPlayer.prototype.download = function download(word) {

    function promiseFunction(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '//radicalresearch.blob.core.windows.net/audio/' + word.toUpperCase() + '.mp3', true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
            if (xhr.status < 400) {
                resolve(xhr.response);
            } else {
                reject(Error(xhr.statusText));
            }
        };
        xhr.onerror = function(e) {
            reject(e);
        };

        return xhr.send();
    };

    return new Promise(promiseFunction.bind(this));
}

AudioPlayer.prototype.play = function play(word) {
    return this
        .download(word)
        .then(this.decodeAudioData.bind(this))
        .then(this.playAudioBuffer.bind(this));
}

AudioPlayer.prototype.decodeAudioData = function decodeAudioData(audioData) {
    function promiseFunction(resolve, reject) {
        try {
            this.audioContext.decodeAudioData(audioData, resolve, reject);
        } catch (e) {
          reject(e);
        }
    };
    return new Promise(promiseFunction.bind(this));
};

AudioPlayer.prototype.playAudioBuffer = function playAudioBuffer(audioBuffer) {

    function promiseFunction(resolve) {
        
        var durationMin = 10;
        var speed = 300;
        var duration = Math.max((audioBuffer.duration * 1000) - speed, durationMin);
        setTimeout(resolve, duration);

        let audioBufferSource = this.audioContext.createBufferSource();
        audioBufferSource.connect(this.audioContext.destination);
        audioBufferSource.buffer = audioBuffer;
        audioBufferSource.start();
        audioBufferSource.onended = resolve;
    };

    return new Promise(promiseFunction.bind(this));
};

export default AudioPlayer;