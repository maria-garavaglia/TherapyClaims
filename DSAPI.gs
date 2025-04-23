var DSAPI =
{

  newUser: function()
  {
    var userData =
    {
      "Email": "[REDACTED]",
      "FullName": "[REDACTED]",
      "Phone": "[REDACTED]",
      "Images": "1",
      "Information": "1",
      "Admin": "1",
      "Password": "[REDACTED]"
    }

    var response = DSAPI.sendRequest("User", "POST", userData);
    Logger.log(response);
  },

  sendRequest: function(target, reqType, data)
  {
    var url = Constants.HOST + target + ".php";

    // set content type (this is default value, but may change later)
    var contentType = "application/x-www-form-urlencoded";

    // standard header values: auth token, no caching
    var headers =
    {
      "Authorization": "Basic " + Utilities.base64Encode(Constants.USERNAME + ':' + Constants.PASSWORD),
      "Cache-Control": "no-cache"
    }

    // create payload (using DocuSend API examples for message formatting)
    var payload = {};

    // Add data as payload, unless it's a GET, then add as headers
    if (reqType == "GET")
    {

      if (!Utils.objectIsEmpty(data))
      {
        url += "?";

        var firstTime = true;
        for (const[key, value] of Object.entries(data))
        {
          if(!firstTime)
          {
            url += "&";
          }
          firstTime = false;

          url += key + "=" + value;
        }
      }
    }
    else
    {
      if (!Utils.objectIsEmpty(data))
      {
        contentType = "application/json";
        payload = JSON.stringify(data);
      }
      else
      {
        Logger.log("DATA EMPTY");
      }
    }

    // create the request
    var request =
    {
      //"muteHttpExceptions": true,
      "method": reqType,
      "contentType": contentType,
      "headers": headers,
      "payload": payload

    };

    // Logger.log(url);
    // Logger.log(JSON.stringify(request));

    // execute request
    var response = UrlFetchApp.fetch(url, request);

    return JSON.parse(response.getContentText());
  }
};
