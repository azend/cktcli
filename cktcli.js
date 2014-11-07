#!/usr/bin/env node

var clickatell = require('clickatell-api');

// Start setting up parser

var argv = require('yargs')
	.usage('$0 version argv.version\nSend SMS message via Clickatell.\nUsage: $0 --username <user> --password <password> --apiid <API ID> --secure --dest <number with country code> --msgtest "sometext"')
	.version('1.0')
	.alias('u', 'username')
	.alias('p', 'password')
	.alias('a', 'apiid')
	.alias('s', 'secure')
	.alias('d', 'dest')
	.alias('m', 'msgtxt')
	.alias('h', 'help')
	.describe('u', 'Clickatell Username')
	.describe('p', 'Clickatell Password')
	.describe('a', 'Clickatell API ID (typically a 7-digit number)')
	.describe('s', 'Secure (HTTPS) connection')
	.describe('d', 'Number to send the message to (Incl. Country Code)')
	.describe('m', 'Actual message text')
	.describe('h', 'Display this help message')
	.argv;

// Set up arg vars

var username = argv.username	// Clickatell Username
var password = argv.password	// Clickatell Password
var apiID = argv.apiid			// Clickatell API ID (typically a 7-digit number)
var secured = argv.secure		// Are we connecting over HTTPS?
var destnum = argv.dest			// Number we are sending the message to
var messagetext = argv.msgtxt	// Actual message text
var help = argv.help				// Display command options (Also not implemented yet, obviously.)


// Auth to Clickatell
var cktClient = clickatell(username, password);

// Decide whether or not we connect over HTTPS

if (argv.secure) {
	var cktHttp = cktClient.http(apiID, {secured: true});
}
else {
	var cktHttp = cktClient.http(apiID, {secured: false});
}

// Print help message (Not yet working)

//if (argv.help || argv.$0) {
//	console.log(argv.usage());
//}

// Assemble message
var promise = cktHttp.sendMessage(destnum, messagetext);

promise.then(
		function (respObj) {
			console.info('message sent successfully!');
			console.info('The message ID for this message is: ' + respObj.ID);
		},

		function (err) {
			console.error('uh-oh...something derped.');

			if (err.code) {
				console.error('Clickatell report an error with code: ' + err.code);
			}

			console.error('Error message: ' + err.message);
		}
	);
