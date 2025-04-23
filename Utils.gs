var Utils =
{
  objectIsEmpty: function(obj)
  {
    return Object.keys(obj).length === 0;
  },

  logError: function()
  {
    var recipient = Session.getActiveUser().getEmail();
    var subject = "DocuSend Script Failure";
    var body = Logger.getLog();
    MailApp.sendEmail(recipient, subject, body);

    throw new Error("Failed, user emailed");
  }
};
