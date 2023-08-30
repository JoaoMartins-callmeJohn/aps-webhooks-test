using aps_viewer_db_properties.Hubs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.VisualBasic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http.Headers;
using System.Text.Json.Nodes;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class HooksController : ControllerBase
{
    public readonly IHubContext<HooksHub> _hooksHub;
    private readonly ILogger<HooksController> _logger;

    public HooksController(ILogger<HooksController> logger, IHubContext<HooksHub> hooksHub)
    {
        _hooksHub = hooksHub;
        GC.KeepAlive(_hooksHub);
        _logger = logger;
    }

    [HttpPost("notification")]
    public object ReceiveNotification([FromBody] dynamic hookNotification)
    {
        string connectionId = hookNotification.hook.hookAttribute.connectionId;
        var hookPayload = hookNotification;
        string hookPayloadString = JsonConvert.SerializeObject(hookPayload);
        HooksHub.SendData(_hooksHub, connectionId, hookPayloadString);

        return new { Success = true };
    }

    [HttpPost("createhook")]
    public async Task<WebhookResponse> CreateWebhook([FromBody] WebhookParams hookParams)
    {
        WebhookResponse apsresponse = new WebhookResponse();

        try
        {
            var clientHandler = new HttpClientHandler
            {
                UseCookies = false,
            };
            var client = new HttpClient(clientHandler);
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri($"https://developer.api.autodesk.com/webhooks/v1/systems/derivative/events/{hookParams.HookEvent}/hooks"),
                Headers =
                {
                    { "x-ads-region", "EMEA" },
                    { "Authorization", "Bearer " +hookParams.Token },
                },
                Content = new StringContent("{\n\t\t\t\"callbackUrl\": \"" + hookParams.Callback + "\",\n\t\t\t\"scope\": {\n\t\t\t\t\"workflow\": \"" + hookParams.Workflow + "\"\n\t\t\t},\n\t\"hookAttribute\":{\n\t\t\"connectionId\":\"" + hookParams.ConnectionId + "\"\n\t}\n}")
                {
                    Headers =
                    {
                        ContentType = new MediaTypeHeaderValue("application/json")
                    }
                }
            };
            using (var response = await client.SendAsync(request))
            {
                response.EnsureSuccessStatusCode();
                var body = await response.Content.ReadAsStringAsync();
                Console.WriteLine(body);
            }
            apsresponse.Success = true;
            apsresponse.Message = "Webhook created!";
        }
        catch (Exception ex)
        {
            apsresponse.Success = false;
            apsresponse.Message = ex.Message;
        }

        return apsresponse;
    }

    public class WebhookParams
    {
        public string ConnectionId { get; set; }
        public string HookEvent { get; set; }
        public string Workflow { get; set; }
        public string Token { get; set; }
        public string Callback { get; set; }
    }

    public class WebhookResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }


}
