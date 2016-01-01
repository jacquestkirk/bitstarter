#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URLFILE_DEFAULT = "NONE"; //"https://pure-mesa-6806.herokuapp.com/";

var assertFileExists = function (infile) {
    console.log("checking file exists")
    var instr = infile.toString();
    if (!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    console.log("file Exists")
    return instr;
};

var cheerioHtmlFile = function (htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function (checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function (htmlfile, checksfile, urlfile) {
    console.log("URL:")
    console.log(urlfile);
    if (urlfile == "NONE") {
        console.log("use html file")
        $ = cheerioHtmlFile(htmlfile);
        var checks = loadChecks(checksfile).sort();
        //console.log(checks);
        var out = {};
        for (var ii in checks) {
            var present = $(checks[ii]).length > 0;
            out[checks[ii]] = present;
        }
        return out;
    } 
    else {
        //console.log("use url")
        var pulled_html
        rest.get(urlfile).on('complete', function (data) {
            //console.log("hi");
            pulled_html = data;
            //console.log(pulled_html);
            $ = cheerio.load(pulled_html);
            console.log("got html")
            var checks = loadChecks(checksfile).sort();
            //console.log(checks);
            var out = {};
            for (var ii in checks) {
                var present = $(checks[ii]).length > 0;
                out[checks[ii]] = present;
                console.log(present);
            }
            var outJson = JSON.stringify(out, null, 4);
            console.log("outJson")
            console.log(outJson);
            return out;
        });

    }
    

};



var clone = function (fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if (require.main == module) {
    console.log(program)
    console.log("---------------")
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-f, --url <url_file>', 'Path to url', URLFILE_DEFAULT)
        .parse(process.argv);
    console.log(program);
    
    var checkJson = checkHtmlFile(program.file, program.checks, program.url);
    //var outJson = JSON.stringify(checkJson, null, 4);
    //console.log("outJson")
    //console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}