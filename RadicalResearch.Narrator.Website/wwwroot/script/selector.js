// 'use strict';
// 
// function queryFactory(element){
// 	return function query(selector){
// 		return element.querySelector(selector);
// 	}
// }
// 
// function queryAllFactory(element){
// 	return function queryAll(selector){
// 		return element.querySelectorAll(selector);
// 	}
// }
// 
// function queryAncestorsFactory(){
// 	return function queryAncestors(selector){
// 		var parent = this;
// 		while(parent && !parent.matches(selector)){
// 			parent = parent.parentNode;
// 		};
// 		return parent;
// 	}
// }
// 
// module.exports = function selector(element){
// 	return {
// 		query: queryFactory(element),
// 		queryAll: queryAllFactory(element),
// 		queryAncestors: queryAncestorsFactory(element),
// 	}
// }