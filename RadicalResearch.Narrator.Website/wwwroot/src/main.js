'use strict';

import Application from './application';

(function () {
    var element = document.documentElement;
    var application = new Application(element);
    application.init();
} ());