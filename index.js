'use strict';

var sass = require('node-sass');
var path = require('path');
var async = require('async');

module.exports = function(builder) {
  builder.hook('before styles', function(pkg, next) {
    if (!pkg.config.styles) {
      return next();
    }

    var files = pkg.config.styles.filter(function(file) {
      return path.extname(file) === '.scss';
    });

    if (files.length === 0) {
      return next();
    }

    var loadPaths = (pkg.config.paths || [])
      .map(pkg.path, pkg)
      .concat(pkg.globalLookupPaths);

    async.each(files, function(file, cb) {
      var css = sass.renderSync({
        file: pkg.path(file),
        includePaths: loadPaths
      });

      pkg.removeFile('styles', file);
      pkg.addFile('styles', path.basename(file, path.extname(file)) + '.css', css);

      cb();
    }, next);
  });
};
