// login class

$.login = {
	islogin: false,
	auto_login: true,
	login_ok: false,
	uid: '',
	token: '',
	expire: false,
	ddn: '',
	username: '',
	nick_name: '',
	first_name: '',
	sex: '',
	device_name: '',
	checkit: function() { 
		upp_checkit(
			function( data ) {	// success
//				alert( "checkit: " + JSON.stringify( data ) );
				if ( data.ErrCode == 0 ) {
					if ( data.login_ok == true ) {
						$.login.islogin = true;
						$.login.auto_login = data.auto_login;
						$.login.login_ok = data.login_ok;
						$.login.uid = data.uid;
						$.login.token = data.token;
						$.login.expire = data.token_expire;
						$.login.ddn = data.ddn;
						$.login.username = data.username;
						$.login.nick_name = data.nick_name;
						$.login.first_name = data.first_name;
						$.login.last_name = data.last_name;
						$.login.sex = data.sex;
						$.login.device_name = data.device_name;
//						alert( "checkit success: " + JSON.stringify( data ) );
						$.wsock.connSocketServer(data);
					}
					else {
//						alert( "checkit fail: " + JSON.stringify( obj ) );
						$.login.showForm();								
					}
				}
				else {
					$.login.showForm();
				}
			},
			function( obj ) {	// fail
//				alert( "checkit ulogin fail: " + JSON.stringify( obj ) );
				$.login.showForm();				
			},
			null				// always
		);
	},
	login: function( acc, pwd, dname ) {
//		alert( 'Browser is ' + browser );
		upp_login( acc, pwd, "", dname, true,
			function( data ) {		// success
//				alert( "login: " + JSON.stringify( data ) );
				if ( data.ErrCode == 0 ) {
					if ( data.login_ok == true ) {
						$.login.islogin = true;
						$.login.login_ok = true;
						$.login.uid = data.uid;
						$.login.token = data.token;
						$.login.expire = data.token_expire;
						$.login.ddn = data.ddn;
						$.login.username = data.username;
						$.login.nick_name = data.nick_name;
						$.login.first_name = data.first_name;
						$.login.last_name = data.last_name;
						$.login.sex = data.sex;
						$.login.device_name = data.device_name;
						//alert( "login: " + JSON.stringify( data ) );
						$.wsock.connSocketServer(data);
						$.login.clearForm();
					}
					else {
						alert( "login fail: " + JSON.stringify( data ) );	
					}
				}
				else {
					alert( "login fail: " + JSON.stringify( data ) );									
				}
			},
			function( obj ) {	//fail
				alert( "login backend fail: " + JSON.stringify( obj ) );						
			},
			null				// always
		);
	},
	logout: function(){
		if ($.login.islogin == true && $.login.login_ok == true){
			$.sidenav.closeNav();
			upp_logout(
				function( obj ) {
	//				alert( "logout: " + JSON.stringify( obj ) );
					if ( obj.ErrCode == 0 ) {
						$.login.islogin = false;
						$.login.login_ok = false;
						$.login.uid = '';
						$.login.token = '';
						$.login.ddn = '';
						$.login.username = '';
						$.login.nick_name = '';
						$.login.first_name = '';
						$.login.sex = '';
						$.login.device_name = '';
						$.mdevice.cleardevice();
						$.sidenav.closePage();
						$.wsock.discSocketServer({"reason":"logout"});
						$.login.showForm();			
					}
				},
				function( obj ) {
					alert( "logout: " + JSON.stringify( obj ) );
				},
				null
			);
		}
	},
	showForm: function(){
		//alert('showFrom');
		$('#login_page').show();
		$('#btn_submit_login').on('click', function(e){
			e.preventDefault();
			var acc, pwd, dname;
			acc = $('#acc_login').val();
			if ( acc.indexOf('@') < 3 ) {
				alert('login account error!');
			}
			else {
				pwd = $('#pwd_login').val();
				dname = $('#dname_login').val();
				if ( dname == '' ) dname = 'mscreen-' + acc.substr(0, acc.indexOf('@'));
				if ( acc != '' && pwd != '' && dname != '')
					$.login.login(acc, pwd, dname);
				else
					alert('login error!');
			}
		});
	},
	clearForm: function(){
		$('#login_page').hide();
		$('#acc_login').val('');
		$('#pwd_login').val('');
		$('#dname_login').val('');
	}
}

$.mdevice = {
	address: '',
	face: '',
	ddn: '',
	owner: '',
	dname: '',
	dtype: '',
	dtag: '',
	location: '',
	mirror: '',
	moteweb: '',
	appweb: '',
	appdata: '',
	cleardevice: function(){
		$.mdevice.address = '';
		$.mdevice.face = '';
		$.mdevice.ddn = '';
		$.mdevice.owner = '';
		$.mdevice.dname = '';
		$.mdevice.dtype = '';
		$.mdevice.dtag = '';
		$.mdevice.location = '';
		$.mdevice.mirror = '';
		$.mdevice.moteweb = '';
		$.mdevice.appweb = '';
		$.mdevice.appdata = '';
	},
	getinfo: function(){
		var ddn = $.login.ddn;
		if ( ddn != '' ){
			upp_settings( 'load', ddn, 'smartscreen', {}, 
				function(obj){
					var app_settings;
					//alert('mdevice.getinfo='+JSON.stringify(obj));
					if ( obj.ErrCode == 0 ){
						if ( obj.app_settings != ''){
							app_settings = JSON.parse(obj.app_settings);
							$.mdevice.address = app_settings.address;
							$.mdevice.face = app_settings.face;
							$.mdevice.ddn = app_settings.ddn;
							$.mdevice.owner = app_settings.owner;
							$.mdevice.dname = app_settings.dname;
							$.mdevice.dtype = app_settings.dtype;
							$.mdevice.dtag = app_settings.dtag;
							$.mdevice.location = app_settings.location;
							$.mdevice.mirror = app_settings.mirror;
							$.mdevice.moteweb = app_settings.moteweb;
							$.mdevice.appweb = app_settings.appweb;
							$.mdevice.appdata = app_settings.appdata;	
						}
						else {
							$.mdevice.ddn = $.login.ddn;
							$.mdevice.owner = $.login.username;
							$.mdevice.dname = $.login.device_name;
							$.mdevice.dtype = '.tv';
						}
						$('#set_address').val($.mdevice.address);
						$('#set_face').val($.mdevice.face);
						$('#set_ddn').val($.mdevice.ddn);
						$('#set_owner').val($.mdevice.owner);
						$('#set_name').val($.mdevice.dname);
						$('#set_type').val($.mdevice.dtype);
						$('#set_tag').val($.mdevice.dtag);
						$('#set_location').val($.mdevice.location);
						$('#set_mirror').val($.mdevice.mirror);
						$('#set_moteweb').val($.mdevice.moteweb);
						$('#set_appweb').val($.mdevice.appweb);
						$('#set_appdata').val($.mdevice.appdata);
					}
				}, 
				function(obj){

				}, 
				function(obj){}
			);	
		}
		else alert('No ddn');
	},
	saveinfo: function(){
		var ddn = $.mdevice.ddn;
		var appsettings = {"address":"","face":"","ddn":"","owner":"","dname":"","dtype":"","dtag":"","location":"","mirror":"","moteweb":"","appweb":"","appdata":""};
		if ( ddn != '' ){
			appsettings.ddn = ddn;
			appsettings.owner = $.mdevice.owner;
			appsettings.dname = $.mdevice.dname;
			appsettings.dtype = $.mdevice.dtype;
			appsettings.address = $('#set_address').val();
			appsettings.face = $('#set_face').val();
			appsettings.dtag = $('#set_tag').val();
			appsettings.location = $('#set_location').val();
			appsettings.mirror = $('#set_mirror').val();
			appsettings.moteweb = $('#set_moteweb').val();
			appsettings.appweb = $('#set_appweb').val();
			appsettings.appdata = $('#set_appdata').val();
			//alert('appsettings='　+　JSON.stringify(appsettings));
			upp_settings( 'save', ddn, 'smartscreen', JSON.stringify(appsettings),
				function(obj){
					alert('saveinfo: ' + obj.ErrMsg);
				},
				function(obj){
					alert('saveinfo: ' + obj.ErrMsg);
				},
				function(obj){}
			);
		}	
	}
}

