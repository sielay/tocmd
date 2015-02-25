/**
 *
 * This is kind of reverse of tests. It will create all mockups basing on basic files.
 * In the end it will create complete environment that should keep consistency. Use it only
 * when after chaning some features you expect some changes in input/output
 *
 */

var tocmd         = require('./../index'),
d                 = __dirname,
fs                = require('fs'),
path              = require('path'),
col               = tocmd.collector,
COMPLEX_HEADERS   = '/mockups/doc/myfiles/COMPLEX_HEADERS.md',
HEADER_PARSE      = '/mockups/mockup.header.parse.js',
HEADER_ORGANISE   = '/mockups/mockup.header.organise.js',
HEADER_INNER      = '/mockups/mockup.header.inner.js',
FILE_MAP          = '/mockups/mockup.file.map.js',
FILE_PARSE        = '/mockups/mockup.file.parse.js',
FILE_ORGANISE     = '/mockups/mockup.file.organise.js',
FILE_CRAWL        = '/mockups/mockup.file.crawl.js',
FORMAT_FULL       = '/mockups/mockup.format.full.js',
FORMAT_ONE        = '/mockups/mockup.format.one.js',
FORMAT_THREE      = '/mockups/mockup.format.three.js',
FORMAT_CLI        = '/mockups/mockup.format.cli.js',
MOCKUP_MD         = '/mockups/mockup.emde',
TAGS_MD           = '/mockups/mockup.tags.emde',
COMPOSER_PARSE    = '/mockups/mockup.composer.parse.js',
COMPOSER_BUILD_MD = '/mockups/mockup.composer.build.emde';

function exportModule(path, json) {
    var content = '\'use strict\';module.exports=' + JSON.stringify(json) + ';';
    fs.writeFileSync(path, content, 'utf8');
    return json;
}

exportModule(d + HEADER_PARSE, col.parseHeaders(fs.readFileSync(d + COMPLEX_HEADERS, 'utf8')));
exportModule(d + HEADER_ORGANISE, col.innerHeaders(d + COMPLEX_HEADERS));
exportModule(d + HEADER_INNER, col.parseFile(COMPLEX_HEADERS, true, __dirname));

col.mapFiles(__dirname, function (error, list) {
    var fileList = [];
    list.forEach(function (file) {
        fileList.push(path.relative(__dirname, file));
    });
    exportModule(d + FILE_MAP, fileList);
    step2(fileList);
});

function step2(fileList) {
    exportModule(d + FILE_ORGANISE, col.organise(exportModule(d + FILE_PARSE, col.parseFiles(fileList, null, null, col.fileSortFunction))));

    col.crawl(__dirname, true, function (error, tree) {
        exportModule(d + FILE_CRAWL, tree);
        step3(tree);
    }, col.fileSortFunction);
}

function step3(crawl) {
    exportModule(d + FORMAT_FULL, tocmd.formatter.linkize(crawl));
    exportModule(d + FORMAT_ONE, tocmd.formatter.linkize(crawl, {maxDepth: 1}));
    exportModule(d + FORMAT_THREE, tocmd.formatter.linkize(crawl, {maxDepth: 3}));

    var lines = [];
    var logger = {
        log: function (line) {
            lines.push(line);
        }
    };
    var tree = tocmd.formatter.linkize(crawl);
    tocmd.formatter.formatCLI(tree, null, logger);
    exportModule(d + FORMAT_CLI, lines);
    fs.writeFileSync(d + MOCKUP_MD, tocmd.formatter.formatMD(tree), 'utf8');
    exportModule(d + COMPOSER_PARSE, tocmd.composer.parse(fs.readFileSync(__dirname + TAGS_MD, 'utf8')));

    tocmd.composer.build(fs.readFileSync(d + TAGS_MD, 'utf8'), d + TAGS_MD, d + '/mockups', function (error, content) {
        fs.writeFileSync(d + COMPOSER_BUILD_MD, content, 'utf8');
    });
}