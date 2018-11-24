const clipboardy = require('clipboardy');
const stamp = `${~~((new Date).getTime() / 1000)}`;
clipboardy.writeSync(stamp);
console.log(`Coppied "${stamp}" to clipboard.`);
