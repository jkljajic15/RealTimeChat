$(function () {

    var chatHub = $.connection.chatHub;

    registerClientMethods(chatHub);
    $.connection.hub.start().done(function () {
        $.connection.hub.logging = true;
        registerEvents(chatHub);

    });

});

function registerEvents(chatHub) {

    let name = $("#username").attr('data-value');

    if (name != null) {
        if (name.length > 0) {
            chatHub.server.connect(name);
        }
    }


}

function registerClientMethods(chatHub) {

    chatHub.client.onConnected = function (sviKorisnici) {

        for (i = 0; i < sviKorisnici.length; i++) {
            AddUser(sviKorisnici[i].KonekcijaId, sviKorisnici[i].UserName);
        }
    }

    chatHub.client.onNewUserConnected = function (id, name) {
        AddUser(id, name);
    }


    chatHub.client.onUserDisconnected = function (id, name) {

        $('#Div' + id).remove();

        let disc = $('<div class="list-group-item">"' + name + '" logged off.</div>');

        $(disc).hide();
        $('#divusers').prepend(disc);
        $(disc).fadeIn(200).delay(2000).fadeOut(200);

    }
}

function AddUser(id, name) {

    let thisName = $("#username").attr('data-value');

    if (thisName != name) {

        code = $('<div class="box-comment" id="Div' + id + '">' +
            ' <div class="user">' +
            '<span class="username">' + '<a href="#"id="' + name + '" class="list-group-item list-group-item-action" >' + name + '<a>' +
            '</span></div></div>');
    } 

    $(code).click(function () {

        if (thisName != name) {
            alert(name);
            // funkcija koja ce otvoriti chat klikom na odabranog ulogovanog korisnika
        }
    });

    $("#divusers").append(code);
}