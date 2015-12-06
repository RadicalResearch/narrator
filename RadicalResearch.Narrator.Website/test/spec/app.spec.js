'use strict';

var app = require('/script/app.js');

describe('App', function(){

	beforeEach(function(){
		app = app();
	});
	
	describe('when the application loads', function(){
		
		it.skip('should have recording disabled', function(){
		});
		
		it.skip('should request user audio', function(){
		});
		
	});
	
	describe('when user audio is available', function(){
		
		it.skip('should enable recording', function(){
		});
		
	});
	
	describe.skip('when the record button is pressed', function(){

		it('should start recording', function(){
		});
		
	});
	
	describe.skip('when the record button is released', function(){

		it('should stop recording', function(){
		});
		
	});

});