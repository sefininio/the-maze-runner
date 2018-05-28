##Binary Tree Depth

For a given binary tree, find the maximal depth.

for simplicity - assume branch names are `yes` and `no`

```javascript
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
```

should yield 4

```javascript
const tree = {}
```

should yield 0