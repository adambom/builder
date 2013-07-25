describe('person', function () {
    var person;

    beforeEach(function () {
        person = new app.models.Person({ name: 'Joe' });
    });

    it('should respond to beep', function () {
        expect(person.respondTo('beep')).toEqual('boop');
    });
});