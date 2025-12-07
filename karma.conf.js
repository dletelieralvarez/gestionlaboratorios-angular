module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),                           
      require('@angular-devkit/build-angular/plugins/karma'),
    ],

    reporters: ['progress', 'kjhtml', 'coverage'],          // usa 'coverage'

    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/gestionlaboratorios-angular'),
      subdir: '.',                                          
      reporters: [
        { type: 'html' },                                   // index.html etc
        { type: 'lcovonly', file: 'lcov.info' },            // genera lcov.info
        { type: 'text-summary' },                           // resumen en consola
      ],
      fixWebpackSourcePaths: true,
    },

    browsers: ['ChromeHeadless'],
    singleRun: false,
  });
};
