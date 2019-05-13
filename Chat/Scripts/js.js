$(function () {

    var chatHub = $.connection.chatHub;

    registerClientMethods(chatHub);
    $.connection.hub.start().done(function () {
        $.connection.hub.logging = true;
        //console.log("test");
        registerEvents(chatHub);

    });

});

function registerEvents(chatHub) {

    let name = $("#username").attr('data-value');
    //console.log(name);

    if (name != null) {
        if (name.length > 0) {
            chatHub.server.connect(name);
        }
    }


}

function registerClientMethods(chatHub) {

    chatHub.client.onConnected = function (id, userName, sviKorisnici, vreme) {

        //console.log(userName, sviKorisnici, vreme);

        for (i = 0; i < sviKorisnici.length; i++) {
            //console.log(sviKorisnici[i].UserName);
            AddUser(sviKorisnici[i].KonekcijaId, sviKorisnici[i].UserName, sviKorisnici[i].LoginTime);
        }
    }

    // On New User Connected
    chatHub.client.onNewUserConnected = function (id, name, loginDate) {
        //console.log("onNewUserConnected", name, loginDate);
        AddUser(id, name, loginDate);
    }

    // On User Disconnected
    chatHub.client.onUserDisconnected = function (id, userName) {

        $('#Div' + id).remove();

        //var ctrId = 'private_' + id;
        //$('#' + ctrId).remove();


        var disc = $('<div class="disconnect">"' + userName + '" logged off.</div>');

        $(disc).hide();
        $('#divusers').prepend(disc);
        $(disc).fadeIn(200).delay(1000).fadeOut(200);

    }
}

function AddUser(id, name, date) {

    //console.log("AddUser");

    let thisName = $("#username").attr('data-value');

    if (thisName == name) {

        code = $('<div class="box-comment" id="Div' + id + '">' +
            ' <div class="list-group-item">' +
            '<span class="username">' + name + '</span >'+
            '<span class="text-muted pull-right">' + date + '</span></div></div>');
    } else {
        code = $('<div class="box-comment" id="Div' + id + '">' +
            ' <div class="list-group-item list-group-item-action">' +
            '<span class="username">' + '<a href="#"id="' + name + '" class="user" >' + name + '<a>' +
            '<span class="text-muted pull-right">' + date + '</span>  </span></div></div>');
    }

    $("#divusers").append(code);
}