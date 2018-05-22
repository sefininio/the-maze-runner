## Iterate randomly over an array using a Generator

Given an array, write a Generator to iterate over the array in a random order.

The generator will be tested by iterating over it with for..of loop.

Every item in the array should be returned exactly once.

**The given array should not be changed**

Loop example:

```javascript
for(x of iterateRandom([1,2,3])){
    // x is a random item
}
```