var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
 
var Styles = require("../../res/Styles");
var TextStyle = require("../../res/TextStyle");
var Colors = require('../../res/Colors');

class Qr extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "Qr";
    this.setIds(["imageQr"]);
    this.setSize(this.props.type);
  }

  setSize = (type) =>{
    if(type === "static"){
      this.width = "260";
      this.height = "260";
    } else if(type === "dynamic"){
      this.width = "200";
      this.height = "200";
    } else if(type == "custom") {
      this.width = this.props.width;
      this.height = this.props.height;
    }
  }

  setImage = (uri,vpa) => {
    console.log(this.idSet.imageQr);
    JBridge.showQrCode(this.idSet.imageQr,uri,vpa,false);
  }

  qr = () =>{
     this.setImage(this.createQRData(this.props.values),this.props.values.pa)
  }
  
  createQRData = (profile) => {
    let queryString = "";
    for(var key in profile) {
      queryString += key + "=" + profile[key] + "&";
    }
    queryString = queryString.substr(0, queryString.length - 1);
    let data = "upi://pay?" + queryString;
    data=data.replace(/%/g,"%20");
    return data;
  }

  afterRender = () =>{
    setTimeout(() => {this.qr();},10 );
     
    var callback = callbackMapper.map((params) => {
      console.log("download done");
    });
     
    this.downloadCount = 0;
    // var id = setInterval(() => {
    //   if (this.downloadCount > 10) {
    //     clearInterval(id);
    //     return;
    //   }

    //   this.downloadCount ++;

    //   JBridge.saveQrToInternalStorage(this.idSet.imageQr, "hpcl@axisgo" + this.downloadCount, callback);
    // },5000 );
  }
  
  render() {
    this.layout = (
      <ImageView
        id={this.idSet.imageQr}
        width={this.width}
        afterRender = {this.afterRender}
        height= {this.height}/>
    )

    return this.layout.render();
  }
}

module.exports = Qr;
