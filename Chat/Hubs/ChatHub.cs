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
        }

        public class Poruke
        {
            public string UserName { get; set; }
            public string SadrzajPoruke { get; set; }
            public string Primalac { get; set; }
        }

        static List<Korisnici> KonektovaniKorisnici = new List<Korisnici>();
        static List<Poruke> ListaPoruka = new List<Poruke>();

        public void SendMessageToAll(string name, string message)
        {

            Clients.All.messageReceived(name, message);
        }
        public void Connect(string userName)
        {
            var id = Context.ConnectionId;

            if (KonektovaniKorisnici.Count(x => x.KonekcijaId == id) == 0)
            {
                KonektovaniKorisnici.Add(new Korisnici { KonekcijaId = id, UserName = userName });

                // Remote Procedure Calls, server-push
                Clients.Caller.onConnected(KonektovaniKorisnici);

                Clients.AllExcept(id).onNewUserConnected(id, userName);
            }
        }

        public void sendMessage(string name, string message)
        {
            var posiljalacId = Context.ConnectionId;
            var posiljalac = KonektovaniKorisnici.Find(k => k.KonekcijaId == posiljalacId);
            var posiljalacIme = posiljalac.UserName;

            var primalac = KonektovaniKorisnici.Find(k => k.UserName == name);
            var primalacId = primalac.KonekcijaId;
            var primalacIme = primalac.UserName;

            if (posiljalacId != null && primalacId != null)
            {
                Clients.Client(primalacId).displayMessage(posiljalacIme, message, posiljalacIme);
                Clients.Caller.displayMessage(posiljalacIme, message, primalacIme);

                DodajPorukeUKes(posiljalacIme, message, primalacIme);
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

        public void AddToGroup(string grpName)
        {
            Groups.Add(Context.ConnectionId, grpName);


        }

        public void SendMessageToGroup(string msg, string grpName)
        {
            var name = Context.User.Identity.Name;

            Clients.Group(grpName).addMessageToGroup(name, msg, grpName);
        }



        private void DodajPorukeUKes(string usr, string msg, string primalac)
        {
            ListaPoruka.Add(new Poruke { UserName = usr, SadrzajPoruke = msg, Primalac = primalac });
        }

        public void PorukeIzKesa(string name)
        {
            var posiljalacId = Context.ConnectionId;
            var posiljalac = KonektovaniKorisnici.Find(k => k.KonekcijaId == posiljalacId);
            var posiljalacIme = posiljalac.UserName;

            var primalac = KonektovaniKorisnici.Find(k => k.UserName == name);
            var primalacId = primalac.KonekcijaId;

            var lista = from x in ListaPoruka
                        where x.UserName == posiljalacIme && x.Primalac == name || x.UserName == name && x.Primalac == posiljalacIme
                        select x;

            Clients.Caller.UcitajPorukeIzKesa(lista);
            
        }
    }
    
}