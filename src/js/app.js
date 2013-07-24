goog.provide('app');

goog.require('app.models.Person');

console.log(new app.models.Person({
    name: 'Adam',
    location: 'SF'
}));