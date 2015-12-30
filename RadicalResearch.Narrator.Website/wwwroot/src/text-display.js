'use strict';

function TextDisplay(element, text, words) {
    this.element = element;
    this.text = text;
    this.words = words;
}

TextDisplay.prototype.init = function init() {

    // Empty element
    while (this.element.firstChild) {
        this.element.removeChild(this.element.firstChild);
    }

    // Add all words to element
    let currentWord;
    while(currentWord = this.text.nextWord())
    {
        var wordElement = document.createElement('span');
        wordElement.className = 'word';
        wordElement.appendChild(document.createTextNode(currentWord));
        wordElement.setAttribute('data-index', this.text.currentIndex);
        wordElement.setAttribute('data-word', currentWord);
        this.element.appendChild(wordElement);
        this.element.appendChild(document.createTextNode(' '));
    }

    // Attach click handler
    this.element.addEventListener('click', this.onWordClick.bind(this));

};

TextDisplay.prototype.update = function update() {
    var elements = document.querySelectorAll('[data-word]');
    for (var i = 0; i < elements.length; i++) {
        let element = elements[i];
        let word = element.getAttribute('data-word');
        element.classList.toggle('recorded', this.words.contains(word));
    }
};

TextDisplay.prototype.onWordClick = function onWordClick () {
    console.log('word click', arguments);
}


export default TextDisplay;