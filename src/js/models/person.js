goog.provide('app.models.Person');
goog.require('app.models.Model');

app.models.Person = app.models.Model.extend({

    respondTo: function (cmd) {
        if (cmd === 'beep') {
            return 'boop';
        }
    }

});