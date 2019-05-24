﻿using System;
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

        static List<Korisnici> KonektovaniKorisnici = new List<Korisnici>();

        public void Connect(string userName)
        {
            var id = Context.ConnectionId;

            if (KonektovaniKorisnici.Count(x => x.KonekcijaId == id) == 0)
            {
                KonektovaniKorisnici.Add(new Korisnici { KonekcijaId = id, UserName = userName });

                Clients.Caller.onConnected(KonektovaniKorisnici);

                Clients.AllExcept(id).onNewUserConnected(id, userName);
            }
        }

        public void sendMessage(string name,string message)
        {
            var posiljalacId = Context.ConnectionId;
            var posiljalac = KonektovaniKorisnici.Find(k => k.KonekcijaId == posiljalacId);
            var posiljalacIme = posiljalac.UserName;

            var primalac = KonektovaniKorisnici.Find(k => k.UserName == name);
            var primalacId = primalac.KonekcijaId;
            var primalacIme = primalac.UserName;

            if(posiljalacId != null && primalacId != null)
            {
                Clients.Client(primalacId).displayMessage(posiljalacIme,message, posiljalacIme);
                Clients.Caller.displayMessage(posiljalacIme, message,primalacIme);
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

            Clients.Group(grpName).addMessage(name, msg, grpName);
        }

    }
}