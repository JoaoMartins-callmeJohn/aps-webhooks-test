using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace aps_viewer_db_properties.Hubs
{
    public class HooksHub : Microsoft.AspNetCore.SignalR.Hub
    {
        public async static Task SendData(IHubContext<HooksHub> hub, string connectionId, string hookPayload)
        {
            await hub.Clients.Client(connectionId).SendAsync("ReceiveHook", hookPayload);
        }
    }
}