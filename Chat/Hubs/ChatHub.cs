using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace Chat.Hubs
{
    public class ChatHub : Hub
    {
        public class Korisnici
        {
            public string KonekcijaId { get; set; }
            public string UserName { get; set; }
            public string LoginTime { get; set; }
        }

        static List<Korisnici> KonektovaniKorisnici = new List<Korisnici>();

        public void Connect(string userName)
        {
            var id = Context.ConnectionId;

            if (KonektovaniKorisnici.Count(x => x.KonekcijaId == id) == 0)
            {
                string logintime = DateTime.Now.ToString();
                KonektovaniKorisnici.Add(new Korisnici { KonekcijaId = id, UserName = userName, LoginTime = logintime });

                Clients.Caller.onConnected(id, userName, KonektovaniKorisnici, logintime);

                Clients.AllExcept(id).onNewUserConnected(id, userName, logintime);
            }
        }

        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            var item = KonektovaniKorisnici.FirstOrDefault(x => x.KonekcijaId == Context.ConnectionId);
            if (item != null)
            {
                KonektovaniKorisnici.Remove(item);

                var id = Context.ConnectionId;
                Clients.All.onUserDisconnected(id, item.UserName);

            }
            return base.OnDisconnected(stopCalled);
        }
    }
}