'use strict';

var createRecorder = require('/script/recorder.js');

describe('Wav recorder', function(){
	it('should record sound', function(){
		var recorder = createRecorder();
		expect(recorder).not.to.be.null;
	})
});