# TherapyClaims

This Google Apps script collects labeled insurance superbills from emails and mails them to insurance via DocuSend. Ideally you'd set this up to auto-label emails and run the script automatically every so often (ie. weekly), so claims can be sent as they come in.

**Note:** so far this has been for my own use only, so I've been a bit fast and loose with my own info and its use. Don't do what I did! Eventually I want to turn this into a proper public web service, with proper information security (and HIPAA compliance) at every step. Until then, all personal info in this copy has been redacted. 

## Usage

1. Copy/Paste code into Drive as a Google Apps Script
2. Upload the relevant claim form to Drive under `Forms/`
3. Label relevant emails with a unique name (manually or via mail rules)
4. Open `Constants.gs`. Add the label and associated claim filename to `Labels`, and ensure all other info is correct. (see note above)
5. Add a trigger to run the script periodically (I chose weekly). If there's no new emails to process, it should return early, otherwise the script will send all documents to DocuSend and send you an email when it's complete.

## Source Guide
* `appsscript.json`: contains standard info for GAS, including services used (Gmail, Drive)
* `Constants.gs`: Misc. info used to either collate files or required by DocuSend. Includes API credentials, credit card info, addresses, etc. (see note above)
* `DSAPI.gs`: Abstraction of code to send DocuSend REST requests.
* `Main.gs`: Main body of the script. Handles finding emails, pulling attachments from said emails, pairing with the right claim form, and sending/receiving DocuSend requests.
* `Utils.gs`: Misc. functions helpful throughout script
