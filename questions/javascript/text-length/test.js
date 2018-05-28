module.exports = {
    test: (main, chai, sinon) => {

        function sanity() {
            let totalLength = main('Hel!!lo world!', 5);
            chai.expect(totalLength).to.equal(0);

            totalLength = main('Hello world!', 6);
            chai.expect(totalLength).to.equal(10);

            totalLength = main('He!!llo world!', 6);
            chai.expect(totalLength).to.equal(10);
        }

        function complexText() {
            const mapSpy = sinon.spy(Array.prototype, 'map');
            const reduceSpy = sinon.spy(Array.prototype, 'reduce');

            const text = `1 22      333 4444  \t  
            \n55555`;

            let totalLength = main(text, 3);
            chai.expect(totalLength).to.equal(3);
            chai.expect(mapSpy.callCount + reduceSpy.callCount).to.be.at.least(1);

            totalLength = main(text, 4);
            chai.expect(totalLength).to.equal(6);

            Array.prototype.map.restore();
            Array.prototype.reduce.restore();
        }

        function specialChars() {
            const mapSpy = sinon.spy(Array.prototype, 'map');
            const reduceSpy = sinon.spy(Array.prototype, 'reduce');

            const text = `1!   #$22               %%%333
            
            \n4444!@#$^&%*()+=-[]\/{}|:<>?,. 55555`;

            let totalLength = main(text, 6);
            chai.expect(totalLength).to.equal(15);
            chai.expect(mapSpy.callCount + reduceSpy.callCount).to.be.at.least(1);

            Array.prototype.map.restore();
            Array.prototype.reduce.restore();
        }

        sanity();
        complexText();
        specialChars();
    },
};
