'use strict';

import getUserMedia from './get-user-media';
import createAudioContext from './create-audio-context';
import createScriptProcessor from './create-script-processor';

const bufferSize = 2048;
const numberOfChannels = 1;

function AudioRecorder() {
    this.channels = [];
    this.audioContext = createAudioContext();
    this.isRecording = false;
    this.recordingLength = 0;

    // Note: As of the August 29 2014 Web Audio API spec publication, this feature has been marked
    // as deprecated, and is soon to be replaced by Audio Workers.
    this.scriptProcessorNode = createScriptProcessor(this.audioContext, bufferSize, numberOfChannels, numberOfChannels);
    this.scriptProcessorNode.onaudioprocess = audioProcess.bind(this);
}

AudioRecorder.prototype.getUserMediaSuccess = function getUserMediaSuccess(stream) {
    var sourceNode = this.audioContext.createMediaStreamSource(stream);
    sourceNode.connect(this.scriptProcessorNode);
    this.scriptProcessorNode.connect(this.audioContext.destination);
};

AudioRecorder.prototype.getUserMediaFail = function getUserMediaFail() {
    console.log('getUserMediaFail', arguments);
};

function audioProcess(audioProcessingEvent) {
    if (!this.isRecording) {
        return;
    }
    var inputBuffer = audioProcessingEvent.inputBuffer;

    for (let i = 0; i < inputBuffer.numberOfChannels; i++) {
        let channel = (this.channels[i] || []);
        channel.push(...inputBuffer.getChannelData(i));
        this.channels[i] = channel;
    }
    this.recordingLength += inputBuffer.length;
};

AudioRecorder.prototype.getPcmData = function getPcmData() {

    let totalLength = this.channels.reduce((previousValue, currentValue) => previousValue + currentValue.length, 0);
    let data = new Float32Array(totalLength);

    let dataIndex = 0;
    let channelValueIndex = 0;
    while (channelValueIndex < this.recordingLength) {
        for (let i = 0; i < this.channels.length; i++) {
            let channel = this.channels[i];
            let value = channel[channelValueIndex];
            data[dataIndex++] = value;
        }
        channelValueIndex++;
    }

    return data;
};

AudioRecorder.prototype.getAudio = function getAudio() {
    var constraints = { "audio": true };
    return getUserMedia(constraints).then(
        this.getUserMediaSuccess.bind(this),
        this.getUserMediaFail.bind(this)
    );
};

AudioRecorder.prototype.startRecording = function startRecording() {
    this.recordingLength = 0;
    this.channels = [];
    this.isRecording = true;
};

AudioRecorder.prototype.stopRecording = function stopRecording() {
    this.isRecording = false;
};

AudioRecorder.prototype.getWaveBlob = function getWaveBlob() {

    let pcmData = this.getPcmData();
    let headerLength = 0; // 44; RAW PCM , no header
    let dataLength = (pcmData.length * 2); // 16 bit = 2 bytes
    let totalLength = headerLength + dataLength;

    let waveBuffer = new ArrayBuffer(totalLength);
    let view = new DataView(waveBuffer);

    for (let i = 0, offset = 0; i < pcmData.length; i++ , offset += 2) {
        let value = Math.max(-1, Math.min(1, pcmData[i]));
        view.setInt16(offset, value < 0 ? value * 0x8000 : value * 0x7FFF, true);
    }

    return new Blob([view], { type: 'audio/raw' });
};

export default AudioRecorder;