
var exports = module.exports = {};
var usrlist = [];

exports.adduser = function( data ) {
    var i, len;
    var found = false;
    len = usrlist.length;
    try {
        if ( typeof data == 'object'){
            if ( len > 0){
                for ( i = 0; i < len; i++ ){
                    if ( usrlist[i].id == data.id ){
                        found = true;
                        break;
                    }
                }
                if ( found == false ) usrlist.push( data ); 
            }
            else usrlist.push( data );
            console.log('adduser usrlist=%s', JSON.stringify(usrlist));
        }
    }
    catch(err){
        console.log('adduser error: %s', err.message);
    }
}

exports.rmuser = function( data ) {
    var i, len;
    
    len = usrlist.length;
    if ( typeof data == 'object'){
        if ( len > 0){
            for ( i = 0; i < len; i++ ){
                if ( usrlist[i].id == data.id ){
                    usrlist.splice(i, 1);
                    console.log('rmuser usrlist=%s', JSON.stringify(usrlist));
                    break;
                }
            }
        }
    }
}

// get all user info
exports.getalluser = function() {
    return usrlist;
}

// get user info from socket id
exports.getuser = function( id, mode ) {
    var i, len;
    console.log('getuser id=%s', id);
    len = usrlist.length;
    if ( len > 0){
        for ( i = 0; i < len; i++ ){
            if ( usrlist[i].id == id ){
                console.log('getuser info=%s', JSON.stringify(usrlist[i]));
                if ( mode == 'all')
                    return usrlist[i];
                else if ( mode == 'token' )
                    return usrlist[i].token;
                else if ( mode == 'username' )
                    return usrlist[i].username;
            }
        }
    }
    return '';
}

// get socketid info property
exports.getsocketid = function( str, mode ) {
    var i, len;
    console.log('getsocketid=%s', str);
    len = usrlist.length;
    if ( len > 0){
        for ( i = 0; i < len; i++ ){
            if ( mode == 'username'){
                if ( str == usrlist[i].username ) return usrlist[i].id;
            }
            else if ( mode == 'devicename'){
                if ( str == usrlist[i].devicename ) return usrlist[i].id;
            }
            else if ( mode == 'token'){
                if ( str == usrlist[i].token ) return usrlist[i].id;
            }
            else if ( mode == 'nickname'){
                if ( str == usrlist[i].nick_name ) return usrlist[i].id;
            }
        }
    }
    return '';
}


