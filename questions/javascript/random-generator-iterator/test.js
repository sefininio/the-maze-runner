module.exports = {
    test: (main, chai) => {
        const orig = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

        const res1 = [...main(orig)];
        console.log(res1);
        const res2 = [...main(orig)];
        console.log(res2);

        const nonEqualValidator = (arr1, arr2, idx) => {
            return ;
        }

        const condition = res1.some((val, idx) => res1[idx] != res2[idx]);

        return chai.expect(condition, "Some items in the same index should be different").to.be.true;
    },
};
