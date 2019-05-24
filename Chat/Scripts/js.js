﻿$(function () {

    let chatHub = $.connection.chatHub;

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
        $('#divusers').append(disc);
        $(disc).fadeIn(200).delay(2000).fadeOut(200);

    }
}

function AddUser(id, name) {

    

    let thisName = $("#username").attr('data-value');

    if (thisName != name) {

        code = $('<div id="Div' + id + '">' +
            '<a id="' + name + '" class="list-group-item list-group-item-action" >' + name + '<a>' +
            '</div>');
    } 
    
    $(code).click(function () {

        var x = $("#chat-" + name);

        if (thisName != name && (isEmpty(x)|| x == null)) {
            $.connection.chatHub.server.porukeIzKesa(name);
            openChatBox(name);
        }
    });

    $("#divusers").append(code);
    
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
function openChatBox(name) {

   
    let div =
        '<div class="col-md-4 " id ="chat-' + name + '">' +

        '<h3> ' + name + ' </h3>'

        + '<button id="show" style="background-color:#d6d3d3;border-radius:5px;">Show</button>'
        + '<div class= "to-hide" >' + '<button id="hide" style="background-color:#d6d3d3;border-radius:5px;">Hide</button>'

        + '<button class="close-div" style="float:right;background-color:#d6d3d3;border-radius:30px;display:inline-block;cursor:pointer;color:black;padding:2px 7px;">X</button>' +
            
                '<div id="divMessage" style="border:2px solid lightblue;height:300px;width:100%;overflow: scroll;border-radius: 4px;"></div>'+
            
                '<div >'+
                '<input style="border:2px solid lightblue;height:80px;width:100%;overflow: auto;border-radius: 4px;" type="text" id="txtPrivateMessage'+name+'" name="message" placeholder="Type Message ..."  />'+
        '<span><input style="height:80px; width:60px; background-color: lightblue; color: black;border: 2px solid lightblue;border-radius: 4px;" type="button" id="btnSendMessage'+name+'" value="send"/></span>'+
        '</div>' +
           '</div >' +
                '</div>';

    
    //$(".close-div").on("click", function (event) {
    //    $("#chat -"+name).remove();
    //    event.preventDefault();
    //});

    let chatBox = $(div);
    $('#glavniRed').append(chatBox);


    $('.close-div').click(function () {
        $(this).parent().parent().remove();
    });

  
    $(document).ready(function () {
        $("#hide").click(function () {
            $(this).parent().hide();
        });
        $("#show").click(function () {
            $(this).next().show();
        });
    });


    $('#btnSendMessage'+name).click(function () {
        
        let msg = $('#txtPrivateMessage'+name).val();

        if (msg.length > 0) {
            $.connection.chatHub.server.sendMessage(name, msg);
            $('#txtPrivateMessage' + name).val(null);
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

$('#btnGrupa').click(function () {

    let grp = '<div class="col-md-4"  id="divGrp">'+
                    '<h3> Grupa 1</h3 >' +
                    '<ul id="ulGrupa" ></ul>'+
                    '<input type="text" id="txtGroupMessage" />'+
                    '<span><input type="button" id="btnSendGroupMessage" value="send"/></span>' +
            '</div > ';
    let divGrp = $(grp);
    $("#glavniRed").append(divGrp);

    $.connection.chatHub.server.addToGroup('Grupa 1');
    $('#btnSendGroupMessage').click(function () {

        let msg = $(divGrp).find("#txtGroupMessage").val();
        $.connection.chatHub.server.sendMessageToGroup(msg,'Grupa 1');
        
    });


    
});

$.connection.chatHub.client.addMessageToGroup = function (name, msg, grp) {
    $("#ulGrupa").append('<li>' + grp + '-' + name + ': ' + msg + '</li>');
};


$.connection.chatHub.client.UcitajPorukeIzKesa = function (lista) {
    for (var i = 0; i < lista.length; i++) {
        DodajPorukeIzListe(lista[i].UserName, lista[i].SadrzajPoruke, lista[i].Primalac);
    }
}

function DodajPorukeIzListe(usr,msg,prim) {

    let chatDiv = '#chat-' + prim;
    let chatDiv2 = '#chat-' + usr;
    $(chatDiv).find("#divMessage").append(usr + ': ' + msg + '<br>');
    $(chatDiv2).find("#divMessage").append(usr + ': ' + msg + '<br>');
}