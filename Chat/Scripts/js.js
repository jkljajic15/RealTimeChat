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

        let disc = $('<div class="list-group-item">"' + name + '" je offline.</div>');

        $(disc).hide();
        $('#divusers').prepend(disc);
        $(disc).fadeIn(200).delay(2000).fadeOut(200);

    }
}

function AddUser(id, name) {

    let thisName = $("#username").attr('data-value');

    if (thisName != name) {

        code = $('<div id="Div' + id + '">' +
            ' <div >' +
            '<span >' + '<a id="' + name + '" class="list-group-item list-group-item-action" >' + name + '<a>' +
            '</span></div></div>');
    } 
    
    $(code).click(function () {

        if (thisName != name) {

            openChatBox(name);
        }
    });

    $("#divusers").append(code);
    
}

function openChatBox(name) {

    let div =
        '<div class="col-md-4 " id ="chat-'+name+'">'+
            
                '<h3> '+name+' </h3>'+
            
                '<div id="divMessage" style="border:1px solid black;height:100px;width:300px;"></div>'+
            
            '<div >'+
                '<input type="text" id="txtPrivateMessage'+name+'" name="message" placeholder="Type Message ..."  />'+
                '<span><input type="button" id="btnSendMessage'+name+'" value="send"/></span>'+
            '</div>' +
        '</div >';


    let chatBox = $(div);
    $('#glavniRed').append(chatBox);

    $('#btnSendMessage'+name).click(function () {
        
        let msg = $('#txtPrivateMessage'+name).val();

        if (msg.length > 0) {
            $.connection.chatHub.server.sendMessage(name, msg);
        }
        
        
        
    });

}

$.connection.chatHub.client.displayMessage = function (userName, message,chatIme) {

    let chatDiv = '#chat-' + chatIme;
    let nadjiChatBox = $(chatDiv).length;
    
    if (nadjiChatBox == 0) {
        openChatBox(chatIme);
        
    }

    $(chatDiv).find("#divMessage").append(userName + ': ' + message + '<br>');
   
}
