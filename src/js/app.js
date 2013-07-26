goog.provide('app');

goog.require('app.models.Person');

if (Modernizr.canvas) {
    console.log(new app.models.Person({
        name: 'Adam',
        location: 'SF'
    }));
}
