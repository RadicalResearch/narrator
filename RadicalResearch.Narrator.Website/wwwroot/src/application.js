'use strict';

import Words from './words';
import Text from './text';
import TextDisplay from './text-display';
import AudioUploader from './audio/audio-uploader';
import AudioRecorder from './audio/audio-recorder';
import AudioPlayer from './audio/audio-player';

function Application(element) {

    this.element = element;
    this.text = new Text();
    this.word = null;
    this.words = new Words();
    this.audioUploader = new AudioUploader();
    this.audioRecorder = new AudioRecorder();
    this.audioPlayer = new AudioPlayer();

    this.textDisplay = new TextDisplay(
        document.getElementById('listen'),
        this.text,
        this.words
    );

}

Application.prototype.init = function init() {
    
    // TODO: select text
    //var titles = [
    //    'alices-adventures-in-wonderland',
    //    'emma',
    //    'pride-and-prejudice',
    //    'the-hound-of-the-baskervilles',
    //    'the-time-machine'
    //];
    
    //var title = titles[Math.floor(Math.random() * titles.length)];
    var title = 'common';

    var promise = Promise.all([
        this.audioRecorder.getAudio(),
        this.words.load(),
        this.text.load(title)
    ])
    .then(
        this.initSuccess.bind(this),
        this.error.bind(this)
    );
    return promise;
};

Application.prototype.initSuccess = function initSuccess() {
    this.element.classList.add('is-initialized');
    this.textDisplay.init();
    this.attach();
    this.nextWord();
};

Application.prototype.nextWord = function nextWord() {

    this.textDisplay.update();
    
    var word = this.text.nextWord();

    if (this.words.contains(word)) {
        this
            .play(word)
            .then(
                this.playSuccess.bind(this),
                this.playFail.bind(this)
                );
        return true;
    }

    this.setWord(word);

    return false;
};

Application.prototype.playSuccess = function playSuccess() {
    this.nextWord();
};

Application.prototype.playFail = function playFail() {
    console.log('Playing media failed');
    this.nextWord();
};

Application.prototype.attach = function attach() {
    var recordButtonElement = this.element.querySelector('.record-button');
    recordButtonElement.addEventListener('mousedown', this.startRecording.bind(this));
    recordButtonElement.addEventListener('mouseup', this.stopRecording.bind(this));

    this.element.classList.add('is-attached');
};

Application.prototype.play = function play(word) {
    return this.audioPlayer.play(word);
};

Application.prototype.setWord = function setWord(word) {
    this.word = word;
    this.element.classList.toggle('is-record-pending', (this.word && this.word !== ''));
    var recordWordElement = this.element.querySelector('.record-word');
    while (recordWordElement.firstChild) {
        recordWordElement.removeChild(recordWordElement.firstChild);
    }
    recordWordElement.appendChild(document.createTextNode(this.word));
};

Application.prototype.startRecording = function startRecording() {
    if (!this.word) {
        return;
    }
    this.audioRecorder.startRecording();
};

Application.prototype.stopRecording = function stopRecording() {

    this.audioRecorder.stopRecording();
    let blob = this.audioRecorder.getWaveBlob();

    this.audioUploader
        .upload(blob, this.word)
        .then(
            this.audioUploadSuccess.bind(this),
            this.error.bind(this)
            );
};

Application.prototype.audioUploadSuccess = function audioUploadSuccess() {
    this.words.add(this.word);
    this.nextWord();
};

Application.prototype.error = function error(exception) {
    console.log('Application error', exception);
};

export default Application;