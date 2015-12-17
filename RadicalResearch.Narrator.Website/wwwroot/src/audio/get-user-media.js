function getUserMedia(constraints) {

    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        return navigator.mediaDevices.getUserMedia(constraints);
    }

    var method = (navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia);
    if (method) {
        return new Promise(function (resolve, reject) {
            try{
                method.call(navigator, constraints, resolve, reject);
            }catch(e){
                reject(e);
            }
        });
    }
    
    throw new Error('getUserMedia not supported');
}

export default getUserMedia;