

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