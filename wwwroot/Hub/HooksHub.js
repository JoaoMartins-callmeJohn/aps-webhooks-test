/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by APS Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

var connection = new signalR.HubConnectionBuilder().withUrl("/hookshub").build();

connection.on("ReceiveHook", function (hookPayload) {
  let container = document.getElementById("log");
  addLog(container, hookPayload)
});

connection.start().then(function () {
  //No function for now
}).catch(function (err) {
  return console.error(err.toString());
});

async function addLog(container, message) {
  const newHookLogDetails = document.createElement('details');
  newHookLogDetails.classList = 'log-details';

  const newHookLogSummary = document.createElement('summary');
  const event = new Date('August 19, 1975 23:15:30')
  newHookLogSummary.innerHTML = event.toTimeString();
  newHookLogDetails.appendChild(newHookLogSummary);

  const newParagraph = document.createElement('p');
  newParagraph.innerHTML = message;
  newHookLogDetails.appendChild(newParagraph);

  container.appendChild(newHookLogDetails);
}