// class

$.smcn = {
    currentMode: '',
    NavButtonState: 'off',
    hideNavButtonTimeout: 5000,
    showNavButton: function() {
        if ( $.smcn.NavButtonState == 'off'){
            $('#ms_page span').show();
            $.smcn.NavButtonState = 'on';
            setTimeout(function() {
                $.smcn.hideNavButton(); 
            }, $.smcn.hideNavButtonTimeout);
        }
    },
    hideNavButton: function() {
        $('#ms_page span').hide();
        $.smcn.NavButtonState = 'off';
    },
    showMainImage: function() {
        var str;
        str = '';
        str += '<img src="img/main.png" alt="Smart Screen" style="position:relative;top:50%;transform:translateY(-50%);">';
        $('#ms_body').html(str);
    }
}

$.drop = {
    mpath: '',
    vf: '',
    url: '',
    token: '',
    medialist: [],
    PutMainScreen: function(obj){
        var url;
        //alert('screen obj=' + JSON.stringify(obj));
        try {
            if ( obj.type == 'url' ){
                url = obj.src;
                $.drop.playMedia(url);
            }
        }
        catch(e){
            BootstrapDialog.alert('putMainScreen error');
        }
    },
    playMedia: function( url ){
        var id, url, ext, str, x;
        var swd, sht, wd, ht, tmp;
        //swd = $(document).width();
        //sht = $(document).height();
        swd = $(window).width();
        sht = $(window).height();
        //alert('width=' + swd + ',height=' + sht );
        if ( sht > swd ) {
            tmp = swd;
            swd = sht;
            sht = tmp;
        }
        id = $.drop.getyoutuid(url);
        if ( id != '' && id.length > 6 ){
            if ( swd >= 1900 ){
                wd = 1920;
                ht = 1080;
            }
            else if ( swd >= 1200 ){
                wd = 1280;
                ht = 720;
            }
            else {
                wd = 720;
                ht = 480;
            }
            $('#ms_body').empty();
            str = '<iframe width="'+wd+'" height="'+ht+'" src="https://www.youtube.com/embed/'+id+'?rel=0&amp&autoplay=1;controls=0&amp;showinfo=0?ecver=1" frameborder="0" allowfullscreen></iframe>';    
            $('#ms_body').append(str);
            $('#ms_body').fadeIn('slow');
        }
        else {
            ext = url.substr(url.lastIndexOf('.')+1);
            //alert('url=' + url + ',ext=' + ext);
            if ( ext != '' && (ext.length == 3 || ext.length == 4) ) {
                ext = ext.toLowerCase();
                $('#ms_body').empty();
                if ( ext == 'jpg' || ext == 'png' || ext == 'jpeg' ) { 
                    str = '<div id="mviewimg" style="width:'+swd+';height:'+sht+';overflow:hidden"></div>';
                    $('#ms_body').html( str );
                    $('#ms_body').fadeIn('slow'); 
                    x = document.createElement('IMG');
                    x.setAttribute('width', '100%');
                    x.setAttribute('src', url);
                    x.onerror = function(){
                        BootstrapDialog.alert('load image error: ' + url );
                    }
                    $('#mviewimg').append(x);
                }
                else if ( ext == 'mp4' ) {
                    str = '<div id="mviewvid" style="position:relative;width:'+swd+';height:'+sht+';padding:0;margin:0;top:50%;transform:translateY(-50%);overflow:hidden"></div>';
                    $('#ms_body').html( str );
                    $('#ms_body').fadeIn('slow');
                    x = document.createElement('video');
                    x.id = 'mviewvid';
                    x.src = url;
                    x.type = 'video/mp4';
                    x.autoplay = true;
                    x.controls = true;
                    x.onerror = function(){
                        BootstrapDialog.alert('play video error: ' + url );
                    }
                    $('#mviewvid').append(x);
                }
            }
        }
    },
    getyoutuid: function( url ){
        var id = '';
        if ( url.indexOf('https://www.youtube.com/watch?v=') == 0 ){
            id = url.replace('https://www.youtube.com/watch?v=','');
        }
        else if ( url.indexOf('https://youtu.be') >= 0 ) {
            id = url.replace('https://youtu.be/','');
        }
        return id;
    }
}

$.play = {
    appsetting: { "playlist":[] },
    devlist: [],
    getPlayInput: function(data){
        data.id = $('#play_id').val();
        data.name = $('#play_name').val();
        data.target = $('#play_target').val();
        data.url = $('#play_url').val();
        data.delay = $('#play_delay').val();
    },
    setPlayInput: function( id, name, target, url, delay){
        var i, len, dev, web;
        $('#play_id').val(id);
        $('#play_name').val(name);
        $('#play_target').val(target);
        $('#play_url').val(url);
        $('#play_delay').val(delay);
        $('#play_dev').empty();
        $('#play_sample_url').empty();
        len = $.play.devlist.length;
        if ( len > 0 ){
            $('#play_dev')
                .append($('<option></option>')
                .attr('value','')
                .text('Select device to target'));
            for ( i = 0; i < len; i++ ){
                dev = $.play.devlist[i];
                $('#play_dev')
                    .append($('<option></option>')
                    .attr('value',dev)
                    .text(dev));
            }
        }
        len = $.app.websample.length;
        if ( len > 0 ){
            $('#play_sample_url')
                .append($('<option></option>')
                .attr('value','')
                .text('Select website to URL'));
            for ( i = 0; i < len; i++ ){
                web = $.app.websample[i];
                $('#play_sample_url')
                    .append($('<option></option>')
                    .attr('value',web)
                    .text(web));
            }    
        }
    },
    getAppSetting: function(){
        var mode, ddn, app;
        mode = 'load';
        ddn = $.mdevice.ddn;
        app = $.app.name;
        upp_settings( mode, ddn, app, '',
            function(data){
                var str_settings, app_settings;
                //BootstrapDialog.alert('getAppSetting: ' + JSON.stringify(data));
                if ( typeof data.app_settings == 'string'){
                    str_settings = data.app_settings;
                    if ( str_settings != ''){
                        app_settings = JSON.parse( str_settings );
                        $.play.appsetting = jQuery.extend({}, app_settings);
                        //alert('getAppSetting: playlist=' + typeof appsetting.playlist);
                        if ( typeof app_settings.playlist == 'object')
                            $.play.showPlaylist(app_settings.playlist);
                        $.play.getDevice();
                    }
                }
            }, 
            function(data){
                BootstrapDialog.alert('getAppSetting: error: ' + data.ErrMsg);
            },
            null 
        );
    },
    getDevice: function(){
        $.wsock.sendSocketMsgReply({"cmd":"getusers"}, 
            function(data){
                //alert('nearby='+JSON.stringify(data));
                var i, len, dev;
                if ( data.err == 'none'){
                    len = data.body.length;
                    if ( len > 0 ){
                        $.play.devlist = [];
                        for ( i = 0; i < len; i++ ){
                            dev = data.body[i].devicename;
                            $.play.devlist.push(dev);
                        }
                    }
                }
            }
        );
    },
    removeAllPlaylist: function( cbok, cbfail ){
        var mode, ddn, app, str;
        mode = 'save';
        ddn = $.mdevice.ddn;
        app = $.app.name;
        str = JSON.stringify({ "playlist":[] });
        upp_settings( mode, ddn, app, str, 
            function(data){
                BootstrapDialog.alert('removeAllPlaylist: ' + data.ErrMsg);    
            }, 
            function(data){
                BootstrapDialog.alert('removeAllPlaylist: error: ' + data.ErrMsg);
            },
            null 
        );
    },
    dropAllPlaylist: function(){
        var pl, i, len, sdelay, idelay;
        var cblock = {"cmd":"","target":"","type":"","src":"","delay":""};
        pl = $.play.appsetting.playlist;
        len = pl.length;
        if ( len > 0 ){
            idelay = 0;
            for ( i = 0; i < len; i++ ){
                sdelay = pl[i].delay;
                if ( sdelay != '') {
                    idelay += parseInt(sdelay);
                }
                if ( idelay == 0 ){
                    cblock.cmd = 'drop';
                    cblock.target = pl[i].target;
                    cblock.src = pl[i].url;
                    cblock.type = 'url';
                    cblock.delay = pl[i].delay;
                    $.wsock.sendSocketMsg(cblock);     
                }
                else {
                    $.play.dropDelayPlaylist(i, idelay);
                }
            }
        } 
    },
    dropDelayPlaylist: function(iid, delay){
        setTimeout( function() {
            var id;
            id = iid.toString();
            //alert('dropDelayPlaylist id=' + iid.toString());
            $.play.dropPlaylist(id);
        }, delay*1000 );
    },
    savePlaylist: function( id, name, target, url, delay, cbok, cbfail ){
        var mode, ddn, app; 
        var playitem = {"name":"","target":"","url":"","delay":""};
        var pl, iid;
        iid = parseInt(id);
        mode = 'save';
        ddn = $.mdevice.ddn;
        app = $.app.name;
        playitem.name = name;
        playitem.target = target;
        playitem.url = url;
        playitem.delay = delay;
        pl = $.play.appsetting.playlist;
        if ( iid < 0 )
            pl.push(playitem);
        else 
            pl.splice( iid, 1, playitem);
        //alert ('appsetting='+JSON.stringify($.play.appsetting));
        upp_settings( mode, ddn, app, JSON.stringify($.play.appsetting), 
            function(data){
                BootstrapDialog.alert('savePlaylist: ' + data.ErrMsg);    
            }, 
            function(data){
                BootstrapDialog.alert('savePlaylist: ' + data.ErrMsg);
            },
            function(){
                $.play.getAppSetting();
            }
        );
    },
    removePlaylist: function(id){
        var iid, pl, mode, ddn, app;
        iid = parseInt(id);
        if ( iid >= 0 ) {
            pl = $.play.appsetting.playlist;
            pl.splice( iid, 1 );
            mode = 'save';
            ddn = $.mdevice.ddn;
            app = $.app.name;
            alert ('appsetting='+JSON.stringify($.play.appsetting));
            upp_settings( mode, ddn, app, JSON.stringify($.play.appsetting), 
                function(data){
                    BootstrapDialog.alert('clearPlaylist: ' + data.ErrMsg);   
                }, 
                function(data){
                    BootstrapDialog.alert('clearPlaylist: ' + data.ErrMsg);
                },
                function(){
                    $.play.getAppSetting();
                }
            );
        }
    },
    dropPlaylist: function(id){
        var iid, pl;
        var cblock = {"cmd":"","target":"","type":"","src":"","delay":""};
        iid = parseInt(id);
        pl = $.play.appsetting.playlist;
        //alert('dropPlaylist pl=' + JSON.stringify(pl));
        if ( iid >= 0 && pl.length > 0){
            cblock.cmd = 'drop';
            cblock.target = pl[iid].target;
            cblock.type = 'url';
            cblock.src = pl[iid].url;
            cblock.delay = pl[iid].delay;
            $.wsock.sendSocketMsg(cblock);   
        }
    },    
    showPlaylist: function(pl){
        var str, i, len, m, strbtn;
        len = pl.length;
        //alert('pl='+JSON.stringify(pl));
        $('#select_playlist').empty();
        if ( len > 0 ){
            str = '<table class="table table-striped" style="font-size:1.2em">';
            str += '<thead><tr><th></th><th>#</th><th>Name</th><th>Target</th><th>Source</th></tr></thead>';
            str += '<tbody>';
            for ( i = 0; i < len; i++ ){
                m = i + 1;
                strbtn = '<a href="#" id="'+i.toString()+'"><span class="glyphicon glyphicon-edit" style="font-size:1.2em"></span></a>';
                str += '<tr><td>'+strbtn+'</td><td>'+m.toString()+'</td><td>'+pl[i].name+'</td><td>'+pl[i].target+'</td><td>'+pl[i].url+'</td></tr>'
            }
            str += '</tbody>';
            str += '</table>';
            $('#select_playlist').html(str);
            $('#select_playlist tbody tr td a').on('click', 
                function(e){
                    var id, iid;
                    e.preventDefault();
                    //alert('id='+this.id);
                    id = this.id;
                    iid = parseInt(id);
                    $.play.setPlayInput(id,pl[iid].name,pl[iid].target,pl[iid].url,pl[iid].delay);
                    $('#playModal').modal('show');
                }
            );
        }
        else {
            str = '<table class="table" style="font-size:1.2em">';
            str += '<tbody>';
            str += '<tr><td>No play item</td></tr>';
            str += '</tbody>';
            str += '</table>';
            $('#select_playlist').html(str);
        }
    }
}