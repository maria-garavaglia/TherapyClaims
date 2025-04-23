
// TODO: Don't keep any of this info here. A proper service would keep all of this in a separate database and have proper information security in place.
var Constants =
{
  // TODO this isn't how to handle test/prod environments...
  HOST: "https://sandbox.docusend.biz/api/", //test
  //HOST: "https://docusend.biz/api/", //prod

  USERNAME: "[REDACTED]", // test
  //USERNAME: "[REDACTED]", // prod
  PASSWORD: "[REDACTED]", //test
  //PASSWORD: "[REDACTED]", //prod
};

var CCInfo =
{
  Name: "[REDACTED]",
  Number: "[REDACTED]",
  ExpirationMonth: "[REDACTED]",
  ExpirationYear: "[REDACTED]",
  CCV: "[REDACTED]"
}

var CCAddress =
{
  Address1: "[REDACTED]",
  Address2: "",
  City: "[REDACTED]",
  State: "[REDACTED]",
  Zipcode: "[REDACTED]",
  Email: "[REDACTED]"
}

var Labels =
[
  {
    name: "docusend_providerA",
    form: "uhc_claim_form_providerA.pdf"
  },
  {
    name: "docusend_providerB",
    form: "uhc_claim_form_providerB.pdf"
  }
]
