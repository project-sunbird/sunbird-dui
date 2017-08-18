var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;

exports.formatBytes = (bytes)=> {
	    if(bytes < 1024) return (bytes/1).toFixed(0) + " Bytes";
	    else if(bytes < 1048576) return(bytes / 1024).toFixed(0) + " KB";
	    else if(bytes < 1073741824) return(bytes / 1048576).toFixed(0) + " MB";
	    else return(bytes / 1073741824).toFixed(3) + " GB";
};


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
  var res = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDay() + " " + d.getHours () + ":" + d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds() + "+" + temp.substring(29,33);
  console.log("result",res)
  return res;
}

exports.decodeBase64 = (data) =>{
  return decodeURIComponent(escape(atob(data)))
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
    JBridge.setInSharedPrefs("deeplinkMode","__failed");
    JBridge.setInSharedPrefs("whereFromInUserActivity","__failed");
}


exports.checkEnrolledCourse = (identifier) =>{
    
    var enrolled = false;
    window.__enrolledCourses.map(function(item){
      if(item.courseId == identifier){
        enrolled = true;
      }
    })

     return enrolled;

  }







