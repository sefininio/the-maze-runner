module.exports = {
    test: (main, chai) => {
        return chai.expect(main()).to.equal('d');
    },
};
