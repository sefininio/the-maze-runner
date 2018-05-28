module.exports = {
    test: (main, chai) => {
        const tree = {
            yes: {
                yes: {
                    x: 42,
                },
                no: null,
            },
            no: {
                yes: 2,
                no: {
                    yes: {
                        foo: 'abc',
                        no: {
                            bar: 'xyz',
                        },
                    },
                },
            },
        };

        return (
            chai.expect(main(tree)).to.equal(4) &&
            chai.expect(main({})).to.equal(0)
        );
    },
};
