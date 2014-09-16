/*
 * grunt-filemap
 * https://github.com/dkrogh/grunt-filemap
 *
 * Copyright (c) 2014 Dennis Krogh
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('filemap', 'Crawls c', function() {
 
    var options = this.options({
      crawlDir: this.data.options.crawlDir,
      outputPath: this.data.options.outputPath
    });

    var done = this.async();
    create();
    function create() {
      var fs = require('fs');
      var path = require('path');

      function dirTree(filename) {
        var stats = fs.lstatSync(filename)
        var fileinfo = {
          path: filename,
          name: path.basename(filename)
        };

        if (stats.isDirectory()) {

          fileinfo.type = "folder";
          fileinfo.children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
          });

        } else {

          fileinfo.type = "file";

        }

        return fileinfo;
      }

      var dir = dirTree(options.crawlPath);

      var sitemapPath = path.join(options.outputPath, 'fileindex.json');

      grunt.file.write(sitemapPath, JSON.stringify(dir));

      grunt.log.writeln('fileindex.json has been created');

      done();
    }

  });

};
