module.exports = {
    test: (main, chai) => {
        let str = 'A car, a man, a maraca.';
        let isPal = main(str);
        chai.expect(isPal).to.be.true;

        str = 'A tin mug for a jar of gum, Nita.';
        isPal = main(str);
        chai.expect(isPal).to.be.true;

        str = 'As I pee, sir, I see Pisa!';
        isPal = main(str);
        chai.expect(isPal).to.be.true;

        str = 'Jsut some regular sentence';
        isPal = main(str);
        chai.expect(isPal).to.be.false;
    },
};
