module.exports = {
    test: (main, chai) => {
        return (
            chai.expect(main(2, 3)).to.equal(5) &&
            chai.expect(main(2)(3)).to.equal(5)
        );
    },
};
