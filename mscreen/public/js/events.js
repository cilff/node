
// event

$(function(){
    $('#ms_page').on('mousedown', function(e){
        e.preventDefault();
        /*
        if ( $.sidenav.currentView == 'ms_page'){
            if ($.sidenav.navState == 'off')
                $.smcn.showNavButton();
        }
        */
        $.sidenav.openNav();
    });
    /*
    $('#ms_page').on('vclick mousedown', function(e){
        e.preventDefault();
        alert('clicked');
        if ( $.smcn.NavButtonState == 'on'){
            $.sidenav.openNav();
        }
    });
    */
    $('#btn_save_setting').on('click',function(e){
        e.preventDefault();
        $.mdevice.saveinfo();
    });
    $('#btn-new-play').on('click', function(e){
        e.preventDefault();
        $.play.setPlayInput('-1','','','','');
        $('#playModal').modal('show');
    });
    $('#btn-save-play').on('click', function(e){
        var id, name, target, url, delay;
        e.preventDefault();
        id = $('#play_id').val();
        name = $('#play_name').val();
        target = $('#play_target').val();
        url = $('#play_url').val();
        delay = $('#play_delay').val();
        if ( name != '' || url != '' ) {
            $('#playModal').modal('hide');
            $.play.savePlaylist( id, name, target, url, delay, 
                function(obj){
                    BootstrapDialog.alert('savePlaylist: ' + data.ErrMsg);
                },
                function(obj){

                }
            );
        }
    });
    $('#btn-drop-play').on('click', function(e){
        var pblock = {"name":"","target":"","url":"","delay":""};
        var cblock = {"cmd":"","type":"","src":"","delay":""};
        e.preventDefault();
        /*
        var id = $('#play_id').val();
        alert('drop id='+id);
        $.play.dropPlaylist(id);
        */
        $.play.getPlayInput(pblock);
        if ( typeof pblock.target == 'string' && typeof pblock.target == 'string'){
            $('#playModal').modal('hide');
            cblock.cmd = 'drop';
            cblock.target = pblock.target;
            cblock.type = 'url';
            cblock.src = pblock.url;
            cblock.delay = pblock.delay;
            $.wsock.sendSocketMsg(cblock);
        }
    });
    $('#btn-remove-play').on('click', function(e){
        var id, name;
        e.preventDefault();
        id = $('#play_id').val();
        name = $('#play_name').val();
        if ( id != ''){
            BootstrapDialog.confirm({
                title: 'WARNING',
                message: 'Warning! Remove the play item: ' + name + '?',
                type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                closable: true,                     // <-- Default value is false
                draggable: true,                    // <-- Default value is false
                btnCancelLabel: 'Cancel',           // <-- Default value is 'Cancel',
                btnOKLabel: 'Confirm',              // <-- Default value is 'OK',
                btnOKClass: 'btn-warning',          // <-- If you didn't specify it, dialog type will be used,
                callback: function(result) {
                    // result will be true if button was click, while it will be false if users close the dialog directly.
                    if(result) {
                        $('#playModal').modal('hide');
                        $.play.removePlaylist(id);
                    }
                }
            });
        }
        //$.play.removePlaylist(id);
    });
    $('#btn-dropall-play').on('click', function(e){
        e.preventDefault();
        $.play.dropAllPlaylist();
    });
    $('#btn-nearby-play').on('click', function(e){
        $.wsock.sendSocketMsgReply({"cmd":"getusers"}, 
            function(data){
                //alert('nearby='+JSON.stringify(data));
                var str, i, len, dev;
                if ( data.err == 'none'){
                    len = data.body.length;
                    if ( len > 0 ){
                        $.play.devlist = [];
                        str = '<h4>Devicelist:</h4><ol>';
                        for ( i = 0; i < len; i++ ){
                            dev = data.body[i].devicename;
                            str += '<li>' + dev +'</li>';
                            $.play.devlist.push(dev);
                        }
                        str += '</ol>';
                        BootstrapDialog.alert(str);
                    }
                }
            }
        );
    });
    $('#play_dev').on('change', function(e){
        e.preventDefault();
        var sel, str;
        str =  $('#play_target').val();
        sel = this.value;
        //alert('sel='+sel);
        if ( sel != '' ){
            if ( str != '')
                $('#play.target').val(','+sel);
            else
                $('#play_target').val(sel);
        }
    });
    $('#play_sample_url').on('change', function(e){
        e.preventDefault();
        var sel, str;
        str =  $('#play_url').val();
        sel = this.value;
        //alert('sel='+sel);
        $('#play_url').val(sel);
    }); 
});