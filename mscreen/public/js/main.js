var socket = io();

// class

$.app = {
    name: 'mscreen',
    version: '0.98',
    date: '2017/7/13',
    websample: ['http://cdn.ypcall.com/miki/YP/吉而好/Poodehii.mp4','http://cdn.ypcall.com/miki/YP/心和萬事興/心和-01.mp4','https://www.youtube.com/watch?v=uBG2LJfWxFE','http://cdn.ypcall.com/Miki/YP/YPCloud/About/IMG_4772.PNG']
}

$.sidenav = {
    currentView: '',
    navWidth: '250px',
    navState: 'off',
    openNav: function(){
        var view;
        $('#mySideNav').css('width',$.sidenav.navWidth);
        view = $.sidenav.currentView;
        $('#'+view+' span').hide();
        $('#'+view).css('margin-left',$.sidenav.navWidth);
        $.sidenav.navState = 'on';
    },
    changePage: function(scnid){
        var view, pageid;
        $('#mySideNav').css('width',$.sidenav.navWidth);
        if ( scnid == 'lo_scn' ){
            //alert('logout clicked');
            $.login.logout();    
        }
        else {
            if ( scnid == '' ) pageid = '';
            else pageid = scnid.replace('scn','page');
            if ( pageid != $.sidenav.currentView ){
                view = $.sidenav.currentView;
                $('#'+view).hide();
                view = pageid;
                $.sidenav.pageShown( pageid );
                $.sidenav.currentView = pageid;
                $('#'+view).css('margin-left',$.sidenav.navWidth);
            }
        }
    },
    startPage: function(pageid){
        if ( pageid != '' ){
            $.sidenav.currentView = pageid;
            $.smcn.showMainImage();
            $.sidenav.pageShown( pageid );
        }
    },
    closePage: function(){
        var pageid = $.sidenav.currentView;
        if ( pageid != ''){
            $.sidenav.currentView = '';
            $.sidenav.pageHidden( pageid );
        }
    },
    closeNav: function(){
        var view;
        $('#mySideNav').css('width','0');
        //alert('scnid='+scnid);
        view = $.sidenav.currentView;
        if ( view != 'ms_page' )
            $('#'+view+' span').show();
        $('#'+view).css('margin-left','0');
        $.sidenav.navState = 'off';
    },
    pageShown: function(pageid){
        $('#'+pageid).show();
        $('#'+pageid+' span').hide();
        switch(pageid){
            case 'play_page':
                //alert('play_page shown!');
                $.play.getAppSetting();
                break;
            default:
                break;
        }
    },
    pageHidden: function(pageid){
        $('#'+pageid).hide();
        $('#'+pageid+' span').hide();
    }
};

$.wsock = {
    socketState: 'idle',
    connSocketServer: function(data) {
        var usrinfo = {"username":"","token":"","devicename":""};
        if (data.username) {
            usrinfo.username = data.username;
            usrinfo.token = data.uid;
            usrinfo.devicename = data.device_name;
            // Tell the server your username
            //alert('usrinfo='+JSON.stringify(usrinfo));
            socket.emit('add user', usrinfo);
        }
    },
    discSocketServer: function(data){
        socket.emit('remove user',data);
    },
    sendSocketMsg: function(data) {
        if ( typeof data == 'object' ){
            socket.emit('request', data);
        }
    },
    sendSocketMsgReply: function(data, callback) {
        if ( typeof data == 'object' ){
            socket.emit('request', data, callback);
        }
    }
};

// event

$(function(){
    $.login.checkit();
    $.sidenav.currentView = 'ms_page';
    $('.sidenav a').on('click', function(e){
        e.preventDefault();
        var id = this.id;
        //alert('id='+id);
        if ( id != '')
            $.sidenav.changePage(id); 
    });
    
    // socket handler

    socket.on('conn', function (data) {
        //alert('login=' + JSON.stringify(data));
        $.wsock.socketState = 'conn';
        //alert('socket connected');
        $.mdevice.getinfo();
		$.sidenav.startPage('ms_page');
    });

    socket.on('disconn', function (data) {
        //alert('logout=' + JSON.stringify(data));
        $.wsock.socketState = 'idle';
    });

    socket.on('cmd', function (data) {
        //recevive cmd from server
        var cmd, src;
        if ( typeof data == 'object'){
            //alert('recv cmd data='+ JSON.stringify(data));
            cmd = data.cmd;
            switch( cmd ){
                case 'drop':
                    //alert('cmd='+JSON.stringify(data));
                    if ( data.type == 'url') {
                        src = data.src;
                        $.drop.PutMainScreen(data);
                    }
                    break;
                default:
                    break;
            }
        }
    });
});



