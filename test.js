#!/usr/bin/env node
/*
App to test some stuff
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

if (require.main == module) {
    console.log(process.argv)
    /program
        //.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        //.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        //.parse(process.argv);
    //var checkJson = checkHtmlFile(program.file, program.checks);
    //var outJson = JSON.stringify(checkJson, null, 4);*/
    console.log("called as a module");
} else {
    //exports.checkHtmlFile = checkHtmlFile;
    console.log("not called as a module");
}