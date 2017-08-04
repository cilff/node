var exports = module.exports = {};
var vfconfpath = 'mplay\\vf.json';
// var vfconfpath = 'mplay/vf.json';
var vflist;
exports.loadvr = function() {
// get virtual folder
    var fs = require('fs');
    var resp;
    try {
      fs.readFile(vfconfpath, 'utf8', function (err, data) {
        if (err) {
          console.log('readFile vf.json error!');
        }
        else {
          vflist = JSON.parse(data);
          console.log('vf=%s', JSON.stringify(vflist));
          //resp = JSON.stringify(vflist);
          //console.log('vf=%s', resp);
        }
      });
    }
    catch(err){
      resp = 'err.message';
      console.log('vf=%s', resp);
    }
}

exports.vr = function(cb){
  var resp;
  if ( typeof vflist == 'object')
    resp = JSON.stringify(vflist);
  else
    resp = '';
  cb(resp);
}

exports.ls = function( name, mpath, id, cbok, cbfail ){
  var fs = require('fs');
  var path = require('path');
  var dir;
  var fslist = [];
  try {
    dir = _getpath(name, id);
    dir += '\\' + mpath.replace(/\//g,"\\");
    // dir += '/' + mpath;
    console.log('ls dir=%s', dir);
    fs.readdir( dir, function(err, list){
      if ( err ){
        cbfail({"ErrCode":-254,"ErrMsg":err.message});
      }
      else {
        console.log('ls=%s', JSON.stringify(list));
        var len = list.length;
        var file, filePath, stat;
        for ( var i = 0; i < len; i++){
          var fsitem = {"name":"","type":"","size":"","mode":""};
          file = list[i];
          filePath = dir + '\\' + file;
          //filePath = dir + '/' + file;
          fsitem.name = file;
          fslist.push(fsitem);
          //console.log('ls path=%s', filePath);
          stat = fs.statSync( filePath );
          fslist[i].mode = stat['mode'];
          if ( stat.isDirectory()) {
            fslist[i].type = 'folder';
          }
          else {
            fslist[i].type = 'file';
            fslist[i].size = stat['size'];
          }
        }
        cbok(fslist);
      }
    });  
  }
  catch(error){
    console.log('ls exception=%s', error.message);
    cbfail({"ErrCode":-254,"ErrMsg":error.message});
  }
}

exports.getvpath = function( name, uid, cbok, cbfail ){
  var dir;
  var obj = {"ErrCode":0,"ErrMsg":"OK","name":name,"dir":""};
  try {
    console.log('getvpath name=%s', name);
    if ( name != '' ){
      dir = _getpathbyuid( name, uid );
      console.log('getvpath dir=%s', dir);
      if ( dir != '' ){
        obj.dir = dir;
      }
      cbok(obj);
    } 
  }
  catch(err){
    console.log('getvpath exception=%s', error.message);
    cbfail({"ErrCode":-254,"ErrMsg":error.message});  
  }
}

var _getpath = function(name, id){
  var i, len, uid;
  var ret = '';
  var usvr = require('./usvr');
  len = vflist.VirtualFolder.length;
  for ( i = 0; i < len; i++ ){
    if ( vflist.VirtualFolder[i].NickName == name){
      ret = vflist.VirtualFolder[i].Path;
      if ( ret.indexOf('(uid)') > 0 ){
        uid = usvr.getuser( id, 'token' );
        //console.log('getpath uid=%s', uid);
        ret = ret.replace( '(uid)', uid );
      }
      break;
    }  
  }
  return ret;
}

var _getpathbyuid = function(name, uid){
  var i, len;
  var ret = '';
  len = vflist.VirtualFolder.length;
  for ( i = 0; i < len; i++ ){
    if ( vflist.VirtualFolder[i].NickName == name){
      ret = vflist.VirtualFolder[i].Path;
      if ( ret.indexOf('(uid)') > 0 ){
        ret = ret.replace( '(uid)', uid );
      }
      break;
    }  
  }
  return ret;
}
