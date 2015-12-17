function createAudioContext() {
    return new (window.AudioContext || window.webkitAudioContext);
}

export default createAudioContext;