require('angular');
require('angular-mocks/angular-mocks');

var srcContext = require.context('./app/.', true,  /\.js$/);
srcContext.keys().forEach(srcContext);