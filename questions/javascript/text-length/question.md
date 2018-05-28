## Total length of text

Given a long text, It is your task to find the **total length of all the words** that are **shorter** than **maxWordLength**.

For example, given the text 'Hello world!', the total length is:

```javascript
calculateTextLength('Hello world', 5);    // 0
calculateTextLength('Hello world', 6);    // 10
```

A few things to note in your solution:
* You can assume a non-empty text.
* The text might include white spaces, new lines, tabs etc.
* Some words might contain special characters that should be **ignored in the count**. The special characters that should be ignored are: `!@#$^&%*()+=-[]\/{}|:<>?,.`
```javascript
calculateTextLength('Hello world', 6);      // 10
calculateTextLength('Hello world!!', 6);    // 10
```
* You can only use functional programming and **are not allowed** to use `for`, `for..of`, `for...in`, `forEach`.

