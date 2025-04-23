function main()
{
  //var test = DSAPI.sendRequest("Company", "GET", "");
  //Logger.log(test);
  //return;

  // Find emails and get pdf attachments
  var pdfs = [];
  Labels.forEach(function(label)
  {
    Logger.log("Looking for label '" + label.name + "'");
    var attachments = getAttachments(label.name);

    Logger.log("Found " + attachments.length + " documents");
    if(attachments.length == 0)
    {
      return;
    }

    var fileList = DriveApp.getFilesByName(label.form);
    // var fileList = DriveApp.getFilesByName("THIS IS NOT A TEST PAGE");
    while(fileList.hasNext())
    {
      pdfs.push(fileList.next().getBlob());
    }

    pdfs = pdfs.concat(attachments);
  });

  if (pdfs.length == 0)
  {
    Logger.log("Nothing to send.");
    return;
  }

  Logger.log("Sending " + pdfs.length + " PDFs:")
  for(var i = 0; i < pdfs.length; i++)
  {
    Logger.log(pdfs[i].getName());
  }

  var job = createJob(pdfs);
  Logger.log("Job created. ID: " + job["ID"]);

  //Get the review document to email later
  var reqData =
  {
    "ID": job["ID"].toString()
  }
  var review = DSAPI.sendRequest("Review", "GET", reqData);
  var reviewPdf = Utilities.newBlob(Utilities.base64Decode(review["content"]), "application/pdf");

  var total = pay();

  Labels.forEach(function(label)
  {
    removeLabels(label.name);
  });

  report(job["ID"], pdfs.length, total, reviewPdf);
}

function getAttachments(labelName)
{
  //var rootFolder = DriveApp.getRootFolder();

  var blobs = [];

  //Find messages with label
  var label = GmailApp.getUserLabelByName(labelName);
  if (label == null)
  {
    Logger.log("Label '" + labelName + "' doesn't exist in the user's GMail account.");
    return blobs;
  }
  var threads = label.getThreads();

  //get attachments from all emails
  for(var i = 0; i < threads.length; i++)
  {
    var messages = threads[i].getMessages();

    for(var j = 0; j < messages.length; j++)
    {
      var attachments = messages[j].getAttachments();

      for(var k = 0; k < attachments.length; k++)
      {
        blobs.push(attachments[k].copyBlob());
      }
    }
  }

  return blobs;
}

function createJob(pdfs)
{
  var jobData =
  {
    "Color": "0",
    "Perforated": "0",
    "ReturnEnvelope": "0",
    "PrintOnBack": "1",
    "Retention": "0",
    "Address": "[REDACTED]",
    "ReturnAddress": "[REDACTED]",
    "DATAFILES": {}
  }

  for(var index = 0; index < pdfs.length; index++)
  {
    var bytes = pdfs[index].getBytes();
    var file =
    {
      "filetype": "letters",
      "content": Utilities.base64Encode(bytes),
      "size": bytes.length.toString()
    }

    jobData["DATAFILES"][pdfs[index].getName()] = file;

  }

  return DSAPI.sendRequest("Job", "POST", jobData);
}

function pay()
{
  var invoice = DSAPI.sendRequest("Pay", "GET", "");
  var amtDue = invoice["AmountDue"];

  Logger.log("Amount due: $" + amtDue);

  var payData =
  {
    "Type": "Credit Card",
    "Amount": amtDue,
    "CreditCardNumber": CCInfo.Number,
    "ExpirationMonth": CCInfo.ExpirationMonth,
    "ExpirationYear": CCInfo.ExpirationYear,
    "CCV": CCInfo.CCV,
    "CompanyName": CCInfo.Name,
    "FullName": CCInfo.Name,
    "Address1": CCAddress.Address1,
    "Address2": CCAddress.Address2,
    "City": CCAddress.City,
    "State": CCAddress.State,
    "Zipcode": CCAddress.Zipcode,
    "Country": "US",
    "Phone": "[REDACTED]",
    "Email": CCAddress.Email,
    "QuickPay": "0"
  };

  Logger.log(payData);

  var payment = DSAPI.sendRequest("Pay", "PUT", payData);

  if(payment["Code"] == 0)
  {
    Logger.log("Payment successful");
  }
  else
  {
    throw new Error("Payment error. Response: " + payment["Code"] + " " + payment["Result"]);
  }

  return amtDue;
}

function removeLabels(labelName)
{
  //Find messages with label
  var label = GmailApp.getUserLabelByName(labelName);
  if (label == null)
  {
    Logger.log("Label '" + labelName + "' doesn't exist in the user's GMail account.");
    return;
  }

  var threads = label.getThreads();
  for(var index = 0; index < threads.length; index++)
  {
    threads[index].removeLabel(label);
  }
  GmailApp.refreshThreads(threads);
}

function report(jobID, numDocs, price, reviewBlob)
{
  var today = Utilities.formatDate(new Date(), "GMT-5", "yyyy-MM-dd");

  var recipient = Session.getActiveUser().getEmail();
  var subject = "Therapy Claim Sent";
  var body =
    "One or more claims have been sent to GEHA via DocuSend. Attached is the full document.\n" +
    "\n" +
    "Date: " + today + "\n" +
    "Job ID: " + jobID + "\n" +
    "Documents Sent: " + numDocs + "\n" +
    "Total: $" + price
  ;

  reviewBlob.setName("DocuSend Review " + today);

  var options =
  {
    attachments: [reviewBlob]
  };
  MailApp.sendEmail(recipient, subject, body, options);

}
