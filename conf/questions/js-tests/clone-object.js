module.exports = {
    test: (main, chai) => {
        const obj = { a: 1, b: 2 };
        const newObject = main(obj);
        chai.expect(newObject, 'clone basic object correctly').to.deep.equal(obj);
        chai.expect(newObject === obj, 'cloned === original').to.equal(false);

        const a = { c: { d: 3 } };
        const obj1 = { a, b: 2 };
        const newObject1 = main(obj1);
        chai.expect(newObject1, 'should clone as expected').to.deep.equal(obj1);
        chai.expect(newObject1 === obj1, 'cloned === original').to.equal(false);
        chai.expect(a === newObject1.a, 'clone inner object').to.equal(false);
    },
};
