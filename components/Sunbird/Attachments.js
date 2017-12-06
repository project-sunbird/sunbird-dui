var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var HorizontalProgressBar = require('../../components/Sunbird/HorizontalProgressBar');
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var utils = require('../../utils/GenericFunctions');

class Attachments extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([
      "attachmentCard",
      "viewButton",
      "cancelButton"
    ]);
  }

  openAttachment= ()=>{
    var url=this.props.data.link||"";
    var path="/storage/emulated/0/announcements/"+this.props.id+"/"+this.props.data.name;
    var _this = this;
    var callback = callbackMapper.map(function(data) {
      if(!isNaN(data[0])){
        var progressBar= 
        (
        <HorizontalProgressBar
        width="match_parent"
        height="4"
        cornerRadius={"12,12,0,0"}
        currentProgress={parseFloat(data[0])}
        totalProgress={100.0}/>
        );
        _this.replaceChild(_this.idSet.attachmentCard, progressBar.render(), 0);
      }else if(data[0]=="start"){
        JBridge.showToast(window.__S.DOWNLOADING_ATTACHMENT,"short");
        var cmd = _this.set({
          id: _this.idSet.cancelButton,
          visibility:"visible"
        });
        cmd += _this.set({
          id: _this.idSet.viewButton,
          visibility:"gone"
        });
        Android.runInUI(cmd, 0);  
      }else if(data[0]=="failure"){
        JBridge.showToast(window.__S.ERROR_FAILED_TO_DOWNLOAD_ATTACHMENT,"short");
      }else if(data[0]=="finished"){
        JBridge.showToast(window.__S.ATTACHMENT_DOWNLOADED,"short");        
        var progressBar= (<LinearLayout/>);
        _this.replaceChild(_this.idSet.attachmentCard, progressBar.render(), 0);
        var cmd = _this.set({
          id: _this.idSet.viewButton,
          visibility : "visible"
        });
        cmd += _this.set({
          id: _this.idSet.cancelButton,
          visibility:"gone"
        });
        Android.runInUI(cmd, 0);
      }
    });
    JBridge.downloadAndOpen(url,path,callback,this.props.index);
  }

  cancelDownload = () => {
    var _this= this;
    var callback1 = callbackMapper.map(function() {
      JBridge.showToast(window.__S.DOWNLOAD_CANCELED);
      var progressBar =(<LinearLayout/>);
      _this.replaceChild(_this.idSet.attachmentCard, progressBar.render(), 0);
      var cmd = _this.set({
        id: _this.idSet.viewButton,
        text: window.__S.View,
        visibility : "visible"
      });
      cmd += _this.set({
        id: _this.idSet.cancelButton,
        visibility:"gone"
      });
      Android.runInUI(cmd, 0);

    });
    JBridge.cancelDownload(this.props.index,callback1);
  }

  afterRender = ()=>{
    if(this.props.open==true){
      this.openAttachment();
    }
  }

render(){
    var item=this.props.data;
    var layout="";
    if(item==undefined||""){
        layout =(
        <LinearLayout
        height="wrap_content"
        width="wrap_content">
        </LinearLayout>
        );
    }else{
        layout = (
        <LinearLayout
        height="wrap_content"
        width="match_parent"
        cornerRadius="4"
        afterRender={this.afterRender}
        margin="0,10,0,0"
        stroke = {"2," + window.__Colors.PRIMARY_BLACK_44}
        orientation="vertical">
          <LinearLayout
           width="match_parent"
           height="wrap_content"
           root="true"
           id={this.idSet.attachmentCard}/>
        <LinearLayout
        height="wrap_content"
        width="match_parent"
        padding="8,8,16,8"
        orientation="horizontal"
        gravity="center_vertical">
            <LinearLayout
            height="56"
            width="60"
            margin="0,0,5,0"
            cornerRadius="4,4,4,4"
            background={window.__Colors.PRIMARY_BLACK_44}/>
            <LinearLayout
            height="match_parent"
            width="wrap_content"
            orientation="vertical"
            gravity="center_vertical">
            <TextView
            height="wrap_content"
            width="wrap_content"
            padding="0,0,0,5"
            text={utils.cropText(item.name,10)}
            style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>
            <TextView
            height="wrap_content"
            width="wrap_content"
            text={item.size}
            style={window.__TextStyle.textStyle.CARD.BODY.FADED}/>
            </LinearLayout>
            <LinearLayout
            height="0"
            weight="1"/>
            <RelativeLayout
            height="30"
            width="wrap_content"
            stroke = {"4," + window.__Colors.PRIMARY_DARK}
            cornerRadius="4,4,4,4"
            padding="16,0,16,0"
            gravity="center_vertical">
            <TextView
                width="wrap_content"
                height="wrap_content"
                onClick={this.openAttachment}
                id={this.idSet.viewButton}
                style={window.__TextStyle.textStyle.CARD.ACTION.DARK}
                text={window.__S.VIEW}/>
            <TextView
                width="wrap_content"
                height="wrap_content"
                visibility="gone"
                id={this.idSet.cancelButton}
                onClick={this.cancelDownload}
                style={window.__TextStyle.textStyle.CARD.ACTION.DARK}
                text={window.__S.DISMISS}/>
            </RelativeLayout>
        </LinearLayout>
        </LinearLayout>
        );
    }
    return layout.render();
  }
}

module.exports = Attachments;
