var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");

exports.formatBytes = (bytes)=> {
	if(bytes < 1024) return (bytes/1).toFixed(0) + " Bytes";
	else if(bytes < 1048576) return(bytes / 1024).toFixed(0) + " KB";
	else if(bytes < 1073741824) return(bytes / 1048576).toFixed(0) + " MB";
	else return(bytes / 1073741824).toFixed(3) + " GB";
};


exports.firstLeterCapital = (data) =>{
  return data.charAt(0).toUpperCase() + data.substring(1,data.length);
}


exports.prettifyDate = (data) => {

  var date = new Date(data);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear();
}

exports.jsonifyData = (data) =>{
	data = data.replace(/\\n/g, "\\n")
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\t/g, ' ')
               .replace(/\n/g, ' ')
               .replace(/\\f/g, "\\f");
      data = data.replace(/[\u0000-\u0019]+/g,"");

     return data;
}
exports.formatDate = (d) =>{
	var temp = d.toString();
	var month = d.getMonth();
	if(month<10){
		month = "0" + d.getMonth();
	}
	var day = d.getDate();
	if(day<10){
		day = "0" + d.getDate();
	}
	var res = d.getFullYear() + "-" + month + "-" + day + " " + d.getHours () + ":" + d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds() + "+" + temp.substring(29,33);
	console.log("formateDate output -> ", res);
	return res;
}

exports.decodeBase64 = (data) =>{
if(data.length!=0)
		return decodeURIComponent(escape(atob(data)))
else {
	return "{}";
}
}

exports.encodeBase64 = (data) => {
	return btoa(unescape(encodeURIComponent(data)))
}

exports.setPermissions = (permission) => {

   var callback = callbackMapper.map(function(data) {

      if (data == permission) {
        if(data == "android.permission.WRITE_EXTERNAL_STORAGE"){
          JBridge.setKey("isPermissionSetWriteExternalStorage", "true");
        }
      }
      if(data == "DeniedPermanently"){
        window.__PermissionDeniedDialog.show("ic_flag_warning","Storage permission is required for this functionality");
      }

    });

    JBridge.setPermissions(callback,permission);

}


exports.clearDeeplinkPreferences = () =>{
	JBridge.setInSharedPrefs("intentLinkPath", "__failed");
	JBridge.setInSharedPrefs("intentFilePath", "__failed");
}


exports.checkEnrolledCourse = (identifier) =>{
	var enrolled = false;
	if (window.__enrolledCourses && window.__enrolledCourses != "") {
		window.__enrolledCourses.map(function (item) {
			if (item.courseId == identifier) {
				enrolled = true;
			}
		});
	}
	return enrolled;
}

exports.getEnrolledCourse = (identifier) =>{

    var enrolled = null;
    window.__enrolledCourses.map(function(item){
      if(item.courseId == identifier){
        enrolled = item;
      }
    })

     return enrolled;
  }

exports.cropText = (text, limit) => {
	if (!limit || limit == undefined) limit = 50;
	if(text && text!=undefined && text.length > limit) text = text.substring(0,limit) + "...";
	return text;
}

exports.addSwipeFunction = (id) => {
	console.log("addSwipeFunction");
	var callbackRefresh = callbackMapper.map(function (params) {
		window.__BNavFlowRestart();
	});
	JBridge.addSwipeRefreshScrollView(id, callbackRefresh);
}

exports.processResponse = (state) => {
	console.log("processing response, state:", state);
	var response = {};
	response.responseFor = state.responseFor;
	if (state.response.status instanceof Object){
		response.status = state.response.status[0];
		response.data = state.response.status[1];
		response.code = state.response.status[2];
		response.url = state.response.status[3];
	} else if (state.response.hasOwnProperty("status")){
		response.status = state.response.status;
		response.data = "";
		response.code = state.response.statusCode;
		response.url = "";
	}
	var decoded = exports.decodeBase64(response.data);
	try {
		response.data = JSON.parse(decoded);
	} catch (e) {
		console.log("processing response, error parsing:", e);
		response.data = decoded;
		response.err = "Parsing error";
	}
	if (response.code == "401" && window.__loggedInState != "GUEST"){
		console.log("401 response data ", response.data);
		if (response.data.hasOwnProperty("message")){
			//api token expired
			window.__apiTokenExpireCount++;
			if (window.__apiTokenExpireCount < 2){
				var callback  = callbackMapper.map(function(token){
					window.__apiToken = token;
					JBridge.setInSharedPrefs("api_token", token);
					window.__apiTokenExpireCount--;
					var whatToSend = {"user_token":window.__userToken,"api_token": window.__apiToken}
					var event = { "tag": state.responseFor, contents: whatToSend };
					window.__runDuiCallback(event);
				});
				JBridge.getApiToken(callback);
			} else {
				//force the user to upgrade app
				window.__ForceUpgradePopup.show();
			}
			return;
		} else {
			//refresh user access token
			console.log("refresh user_access_token");
			var callback = callbackMapper.map(function(params){
				console.log("refreshed user_access_token, data: ", params);
				console.log(arguments);
				var status = arguments[0];
				var response = JSON.parse(exports.decodeBase64(arguments[1]));
				var statusCode = arguments[2];
				// console.log("statusCode: " + statusCode + "-- response: " + response);
				if (status == "failure") {
					window.__Logout();
				} else {
					console.log("response ", response);
					window.__refreshToken = response.refresh_token;
					window.__user_accessToken = response.access_token;
					JBridge.setInSharedPrefs("user_access_token", response.access_token);
					JBridge.setInSharedPrefs("refresh_token", response.refresh_token);
					var whatToSend = {"user_token":window.__user_accessToken,"api_token": window.__apiToken}
					var event = { "tag": state.responseFor, contents: whatToSend };
					window.__runDuiCallback(event);
				}
			})
			JBridge.refreshAccessToken(callback);
			return;
		}
	} else if (response.code == 501 || response.status === "failure" || response.status=="f" || response.code == 504 || response.status == "failed"){
		if (response.data.params && response.data.err)
			response.err = response.data.err;
		else
			response.err = "Unkown error"
		console.log("Error : ", response.err);
	} else if (response.code != 200 && response.code != 201) {
		response.status = "failure";
		response.err = "Unkown error";
	}
	console.log("processing response, response:", response);

	return response;
}

exports.getCallbacks = (downloadProgressCb, contentImportProgressCb, contentImportResponseCb) => {
	var cb1 = callbackMapper.map((data)=>{
		console.log("downloadProgressCb -> ", data);
		downloadProgressCb(data);
	});
	/* downloadProgressCb data format:
	[
		"onDownloadProgress",
		"do_212371599518752768174",
		"{\"downloadId\":7010,\"downloadProgress\":-1,\"identifier\":\"do_212371599518752768174\",\"status\":1}"
	]
	*/

	var cb2 = callbackMapper.map((data) => {
		console.log("contentImportProgressCb -> ", data);
		contentImportProgressCb(data);
	});
	/* contentImportProgressCb data format:
	[
		"onContentImportProgress",
		"do_212371599518752768174",
		"{\"currentCount\":0,\"totalCount\":5}"
	]
	*/

	var cb3 = callbackMapper.map((data) => {
		console.log("contentImportResponseCb -> ", data);
		contentImportResponseCb(data);
	});
	return [cb1, cb2, cb3];
	/* contentImportResponseCb data format:
	[
		"onContentImportResponse",
		"do_212371599518752768174",
		"{\"identifier\":\"do_212371599518752768174\",\"status\":\"DOWNLOAD_COMPLETED\"}"
	]
	*/
}

exports.getFuncMapped = (func) => {
	return callbackMapper.map((data) => {
		func(data);
	});
}