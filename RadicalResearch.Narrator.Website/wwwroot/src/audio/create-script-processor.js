function createScriptProcessor(audioContext, bufferSize, numberOfInputChannels, numberOfOutputChannels) {
    var method = (audioContext.createJavaScriptNode || audioContext.createScriptProcessor);
    return method.call(audioContext, bufferSize, numberOfInputChannels, numberOfOutputChannels);
};

export default createScriptProcessor;