'use strict';

var tocmd       = require('./../index'),
    fs          = require('fs'),
    should      = require('should'),
    util        = require('util'),
    path        = require('path'),
    exampleFile = __dirname + '/mockups/doc/myfiles/COMPLEX_HEADERS.md',
    fileContent = fs.readFileSync(exampleFile, 'utf8');

Object.prototype.dump = function () {
    console.log(util.inspect(this, false, null));
};

describe('Collector', function () {

    it('Should extract headers', function () {

        tocmd.collector.extractHeaders(fileContent).should.eql(require('./mockups/mockup.header.extract'));
    });

    it('Should parse headers', function () {
        tocmd.collector.parseHeaders(require('./mockups/mockup.header.extract')).should.eql(require('./mockups/mockup.header.parse'));
    });

    it('Should organise headers', function () {
        tocmd.collector.organise(require('./mockups/mockup.header.parse')).should.eql(require('./mockups/mockup.header.organise'));
    });

    it('Should organise headers from file', function () {
        tocmd.collector.innerHeaders(exampleFile).should.eql(require('./mockups/mockup.header.organise'));
        tocmd.collector.parseFile('/mockups/doc/myfiles/COMPLEX_HEADERS.md', true, __dirname).should.eql(require('./mockups/mockup.header.inner'));
    });

    it('Should be able to map all MD files or LICENSE file', function (done) {
        tocmd.collector.mapFiles(__dirname, function (error, list) {
            should.not.exist(error);
            var fileList = [];
            list.forEach(function (file) {
                fileList.push(path.relative(__dirname, file));
            });
            fileList.should.eql(require('./mockups/mockup.file.map'));
            done();
        })
    });

    it('Should parse files', function () {
        tocmd.collector.parseFiles(require('./mockups/mockup.file.map'), null, null, tocmd.collector.fileSortFunction).should.eql(require('./mockups/mockup.file.parse'));
    });

    it('Should organise files', function () {

        tocmd.collector.organise(require('./mockups/mockup.file.parse')).should.eql(require('./mockups/mockup.file.organise'));
    });

    it('Should do all in one command', function (done) {
        tocmd.collector.crawl(__dirname, function (error, tree) {
            should.not.exist(error);
            should.exist(tree);
            tree.should.eql(require('./mockups/mockup.file.organise'));
            done();
        }, tocmd.collector.fileSortFunction);
    });

    it('Should do all in one command with contents', function (done) {
        tocmd.collector.crawl(__dirname, true, function (error, tree) {
            should.not.exist(error);
            should.exist(tree);
            tree.should.eql(require('./mockups/mockup.file.crawl'));
            done();
        }, tocmd.collector.fileSortFunction);
    });

});

describe('Formatter', function () {

    it('Should create full file tree', function () {
        tocmd.formatter.linkize(require('./mockups/mockup.file.crawl')).should.eql(require('./mockups/mockup.format.full'));
    });

    it('Should create deptch limited tree', function () {
        tocmd.formatter.linkize(require('./mockups/mockup.file.crawl'), {
            maxDepth: 1
        }).should.eql(require('./mockups/mockup.format.one'));

        tocmd.formatter.linkize(require('./mockups/mockup.file.crawl'), {
            maxDepth: 3
        }).should.eql(require('./mockups/mockup.format.three'));
    });

    it('Should create nice CLI output', function () {

        var lines = [];
        var logger = {
            log: function (line) {
                lines.push(line);
            }
        };
        var tree = tocmd.formatter.linkize(require('./mockups/mockup.file.crawl'));
        tocmd.formatter.formatCLI(tree, null, logger);
        lines.should.eql(require('./mockups/mockup.format.cli'));
    });

    it('Should create awesome MD output', function () {

        var tree = tocmd.formatter.linkize(require('./mockups/mockup.file.crawl'));
        tocmd.formatter.formatMD(tree).should.eql(fs.readFileSync(__dirname + '/mockups/mockup.emde', 'utf8'));
    });

});

describe('Composer', function () {

    it('Understands tag', function () {
        tocmd.composer.parse(fs.readFileSync(__dirname + '/mockups/mockup.tags.emde', 'utf8')).should.eql(require('./mockups/mockup.composer.parse'));
    });

    it('Inserts toc', function (done) {
        var path = __dirname + '/mockups/mockup.tags.emde';
        tocmd.composer.build(fs.readFileSync(path, 'utf8'), path, __dirname + '/mockups', function (error, content) {
            should.not.exist(error);
            content.should.eql(fs.readFileSync(__dirname + '/mockups/mockup.composer.build.emde', 'utf8'));
            done();
        });
    });

    it('Parses file basing on their location - index', function (done) {
        var path = __dirname + '/mockups/README.MD',
            original = fs.readFileSync(path, 'utf8');

        tocmd.composer.buildFile(path, function (error) {
            should.not.exist(error);
            fs.readFileSync(path, 'utf8').should.eql(original);
            done();
        });
    });

    it('Parses file basing on their location - nested', function (done) {
        var path = __dirname + '/mockups/doc/myfiles/SOME.MD',
            original = fs.readFileSync(path, 'utf8');

        tocmd.composer.buildFile(path, function (error) {
            should.not.exist(error);
            fs.readFileSync(path, 'utf8').should.eql(original);
            done();
        });
    });

    it('Should build whole doc', function (done) {
        tocmd.composer.buildDoc(__dirname, done);
    });

});