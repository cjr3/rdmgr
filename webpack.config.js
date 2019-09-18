const path = require('path');

module.exports = {
    entry:'./src/index.js',
    target:'electron-renderer',
    resolve:{
        //alias:{
            //App:path.resolve(__dirname, 'src/')
        //},
        modules:[path.resolve(__dirname, 'src'), 'node_modules'],
    }
}