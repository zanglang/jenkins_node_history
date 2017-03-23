// Replace these!
var jenkinsRoot = 'https://ci.jenkins-ci.org/computer/';
var username = 'johndoe';
var password = 'replaceme';

var casper = require('casper').create({
    verbose: false, // set to true for debugging
    logLevel: 'debug',
    pageSettings: {
        loadImages: false
    }
});

// check arguments
if (casper.cli.args.length === 0) {
    casper.die('Usage: casperjs main.js <nodeName>');
}

var nodeName = casper.cli.get(0);

// BEGIN
casper.start();
casper.thenOpen(jenkinsRoot + nodeName + '/builds', function () {
    // log in to jenkins
    this.fill('form[name="login"]', {
        j_username: username,
        j_password: password
    }, true);
});
// wait for build history page to finish loading
casper.waitForUrl(/builds/);
casper.waitWhileVisible('table[title="Computation in progress."]');

var jobs = [];
casper.then(function () {
    jobs = this.evaluate(function () {
        try {
            // return each job and 'time since' row as a tuple
            return $$('table#projectStatus tr:not(:has(th))').map(function(row) {
                return [
                    row.select('td:nth-child(2) a:first-child')[0].innerHTML.replace(/<wbr>/g, '').replace(/ » .*/, ''),
                    row.select('td:nth-child(3)')[0].getAttribute('data')
                ];
            });
        } catch (err) {
            casper.log(err, 'debug');
        }
    });
    this.log('Done parsing table. Got ' + jobs.length + ' jobs.');
    //this.capture('page.png');
});
casper.run(function () {
    this.echo(JSON.stringify({ jobs: jobs }, null, 4)).exit();
});
