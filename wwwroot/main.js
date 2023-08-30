const createHook = document.getElementById('posthook');
try {
  createHook.onclick = async() => {
    //Swal to specifi parameter to obtain and filter to generate the chart
    const { value: formValues } = await Swal.fire({
      title: 'Create a webhook',
      html:
        '<span>Event</span><input type="text" id="event" class="swal2-input" style="font-size: 0.8em; width: 300px; margin-left: 80px;" value="extraction.finished" placeholder="extraction.finished" list="querypropertiesList" disabled>' +
        `<span>Workflow</span><input type="text" id="workflow" class="swal2-input" style="font-size: 0.8em; width: 300px; margin-left: 80px;" placeholder="Type your workflow id here!">` +
        `<span>Token</span><input type="text" id="token" class="swal2-input" style="font-size: 0.8em; width: 300px; margin-left: 80px;" placeholder="Paste your token here!">`,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('event').value,
          document.getElementById('workflow').value,
          document.getElementById('token').value
        ]
      }
    });

    try {
      let creationStatus = await postWebhook(formValues[0], formValues[1], formValues[2], connection.connectionId);
      showToast(creationStatus);
    } catch (e) {
      showError(e);
    }
  }
} catch (err) {
  alert('Could not initialize the application. See console for more details.');
  console.error(err);
}

async function showToast(creationStatus) {
  Swal.fire({
    icon: creationStatus.success ? 'success' : 'error',
    title: creationStatus.message,
    showConfirmButton: false
  })
}

async function showError(error) {
  Swal.fire({
    icon: 'error',
    title: error,
    showConfirmButton: false
  })
}

async function postWebhook(event, workflow, token, connectionId) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "Callback": window.location.href +"api/hooks/notification","ConnectionId":connectionId,"HookEvent":event,"Workflow":workflow,"Token":token})
  };

  let resp = await fetch(`/api/hooks/createhook`, options);

  let respJSON = await resp.json();

  return respJSON;
}