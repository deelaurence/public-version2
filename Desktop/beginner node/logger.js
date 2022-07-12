let log = {
    info: function (info){
        console.log('info?:' + info);
    }
    ,
    warning: function(warning){
        console.log('warning:' + warning);
    },
    error: function(error) {
        console.log('error:'+ error);
    }

    
};

console.log(log.info);
console.log(log.warning);

// info('i will be late')


module.exports = log