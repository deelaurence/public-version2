let myLoggerModule = require('./logger');
let names = require('./test')

myLoggerModule.info('node.js started')
myLoggerModule.warning('node.js started')
// myLoggerModule.mood('node.js started')
console.log(myLoggerModule.info('ill be late'));
console.log(names);
console.log(names.name);


