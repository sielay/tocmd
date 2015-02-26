'use strict';

var tocmd                   = require('./../index'),
    fs                      = require('fs'),
    should                  = require('should'),
    path                    = require('path'),
    COMPLEX_HEADERS         = '/mockups/doc/myfiles/COMPLEX_HEADERS.md',
    COMPLEX_HEADERS_CONTENT = fs.readFileSync(__dirname + COMPLEX_HEADERS, 'utf8'),
    HEADER_PARSE            = './mockups/mockup.header.parse',
    HEADER_ORGANISE         = './mockups/mockup.header.organise',
    HEADER_INNER            = './mockups/mockup.header.inner',
    FILE_MAP                = './mockups/mockup.file.map',
    FILE_PARSE              = './mockups/mockup.file.parse',
    FILE_ORGANISE           = './mockups/mockup.file.organise',
    FILE_CRAWL              = './mockups/mockup.file.crawl',
    FORMAT_FULL             = './mockups/mockup.format.full',
    FORMAT_ONE              = './mockups/mockup.format.one',
    FORMAT_THREE            = './mockups/mockup.format.three',
    FORMAT_CLI              = './mockups/mockup.format.cli',
    MOCKUP_MD               = '/mockups/mockup.emde',
    TAGS_MD                 = '/mockups/mockup.tags.emde',
    COMPOSER_PARSE          = './mockups/mockup.composer.parse',
    COMPOSER_BUILD_MD       = '/mockups/mockup.composer.build.emde';

describe('Collector', function () {

    it('Should parse headers', function () {
        tocmd.collector.parseHeaders(COMPLEX_HEADERS_CONTENT).should.eql(require(HEADER_PARSE));
    });

    it('Should organise headers', function () {
        tocmd.collector.organise(require(HEADER_PARSE)).should.eql(require(HEADER_ORGANISE));
    });

    it('Should organise headers from file', function () {
        tocmd.collector.innerHeaders(__dirname + COMPLEX_HEADERS).should.eql(require(HEADER_ORGANISE));
        tocmd.collector.parseFile(COMPLEX_HEADERS, true, __dirname).should.eql(require(HEADER_INNER));
    });

    it('Should be able to map all MD files or LICENSE file', function (done) {
        tocmd.collector.mapFiles(__dirname, function (error, list) {
            should.not.exist(error);
            var fileList = [];
            list.forEach(function (file) {
                fileList.push(path.relative(__dirname, file));
            });
            fileList.should.eql(require(FILE_MAP));
            done();
        })
    });

    it('Should parse files', function () {
        tocmd.collector.parseFiles(require(FILE_MAP), null, null, tocmd.collector.fileSortFunction).should.eql(require(FILE_PARSE));
    });

    it('Should organise files', function () {

        tocmd.collector.organise(require(FILE_PARSE)).should.eql(require(FILE_ORGANISE));
    });

    it('Should do all in one command', function (done) {
        tocmd.collector.crawl(__dirname, function (error, tree) {
            should.not.exist(error);
            should.exist(tree);
            tree.should.eql(require(FILE_ORGANISE));
            done();
        }, tocmd.collector.fileSortFunction);
    });

    it('Should do all in one command with contents', function (done) {
        tocmd.collector.crawl(__dirname, true, function (error, tree) {
            should.not.exist(error);
            should.exist(tree);
            tree.should.eql(require(FILE_CRAWL));
            done();
        }, tocmd.collector.fileSortFunction);
    });
});

describe('Formatter', function () {

    it('Should proprely hash header', function() {
        tocmd.formatter.hashHeader('Header 3 1.1.1').should.eql('user-content-header-3-111');
    });

    it('Should create full file tree', function () {
        tocmd.formatter.linkize(require(FILE_CRAWL)).should.eql(require(FORMAT_FULL));
    });

    it('Should create deptch limited tree', function () {
        tocmd.formatter.linkize(require(FILE_CRAWL), {
            maxDepth: 1
        }).should.eql(require(FORMAT_ONE));

        tocmd.formatter.linkize(require(FILE_CRAWL), {
            maxDepth: 3
        }).should.eql(require(FORMAT_THREE));
    });

    it('Should create nice CLI output', function () {

        var lines = [];
        var logger = {
            log: function (line) {
                lines.push(line);
            }
        };
        var tree = tocmd.formatter.linkize(require(FILE_CRAWL));
        tocmd.formatter.formatCLI(tree, null, logger);
        lines.should.eql(require(FORMAT_CLI));
    });

    it('Should create awesome MD output', function () {

        var tree = tocmd.formatter.linkize(require(FILE_CRAWL));
        tocmd.formatter.formatMD(tree).should.eql(fs.readFileSync(__dirname + MOCKUP_MD, 'utf8'));
    });



});

describe('Composer', function () {

    it('Understands tag', function () {
        tocmd.composer.parse(fs.readFileSync(__dirname + TAGS_MD, 'utf8')).should.eql(require(COMPOSER_PARSE));
    });

    it('Inserts toc', function (done) {
        var path = __dirname + TAGS_MD;
        tocmd.composer.build(fs.readFileSync(path, 'utf8'), path, __dirname + '/mockups', function (error, content) {
            should.not.exist(error);
            content.should.eql(fs.readFileSync(__dirname + COMPOSER_BUILD_MD, 'utf8'));
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