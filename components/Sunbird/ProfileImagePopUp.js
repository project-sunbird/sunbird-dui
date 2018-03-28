var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var Styles = require("../../res/Styles");
let IconStyle = Styles.Params.IconStyle;
var utils = require('../../utils/GenericFunctions');
var _this;

class ProfileImagePopUp extends View {
  constructor(props, childern) {
    super(props,childern);

    this.setIds([
     "popUpParent",
     "profileImage",
     "profileImageContainer"
    ]);
    _this=this;

    window.__ProfileImagePopUp = this;
    window.onGetImageFromGallery = this.uploadImage;
    this.props = props;

  }

  uploadImage = (imagPath) => {
    console.log("imagPath, ", imagPath);
    var callback = callbackMapper.map((data) => {
        if (this.uploadImageResponseCame) return;
        this.uploadImageResponseCame = true;
        if (data == "__failed") {
          window.__Snackbar.show(window.__S.ERROR_UPLOADING_IMG);
          window.__LoaderDialog.hide();
          return;
        }
        var res = utils.jsonifyData(utils.decodeBase64(data[0]));
        res = JSON.parse(res);
        if (res.responseCode && res.responseCode != 200){
          console.log("error occured while uploading");
          window.__Snackbar.show(window.__S.ERROR_UPLOADING_IMG);
          window.__LoaderDialog.hide();
          return;
        }
        console.log("res data: ", res.responseBody);
        _this.updateProfileAvatar(res.responseBody.result.url)
      })
    this.hide();
    window.__LoaderDialog.show();
    this.uploadImageResponseCame = false;
    if (JBridge.isNetworkAvailable()){
      JBridge.fileUpload(imagPath, window.__apiToken, window.__user_accessToken, window.__userToken, callback);
      setTimeout(() => {
        if (this.uploadImageResponseCame) return;
        this.uploadImageResponseCame = true;
        window.__LoaderDialog.hide();
        window.__Snackbar.show(window.__S.ERROR_UPLOADING_IMG);
      }, window.__API_TIMEOUT);
    }else {
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
      window.__LoaderDialog.hide();
    }
  }

  updateProfileAvatar = (imgUrl) => {
    var url=window.__apiUrl + "/api/user/v1/update";
    var body = {
      "id":"unique API ID",
      "ts":"response timestamp YYYY-MM-DDThh:mm:ss+/-nn:nn (timezone defaulted to +5.30)",
      "params": {},
      "request":{
        "userId" : window.__userToken,
        "avatar" : imgUrl
      }
    }
    console.log(JSON.stringify(body),"updateProfileAvatar json");
    this.responseCame=false;
    if(JBridge.isNetworkAvailable()){
      window.__patchCallback = this.updateProfileAvatarCallback;
      JBridge.patchApi(url,JSON.stringify(body),window.__user_accessToken,window.__apiToken);
      window.__LoaderDialog.show();

      setTimeout(() => {
        if(this.responseCame){
          return;
        }
        window.__Snackbar.show(window.__S.ERROR_SERVER_CONNECTION);
        window.__LoaderDialog.hide();
        this.responseCame=true;
      },window.__API_TIMEOUT);
    }else {
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
      window.__LoaderDialog.hide();
    }
  }

  updateProfileAvatarCallback = (data) => {
    console.log("updateProfileAvatarCallback, ", data);
    console.log("this.responseCame, ", this.responseCame);
    if (this.responseCame) return;
    this.responseCame = true;
    setTimeout(() => {
      window.__BNavFlowRestart();
    }, 500);
  }

  show = (image) => {
    image = image ||"ic_anonymous";
    var layout = (
        <ImageView
          height="match_parent"
          width="match_parent"
          scaleType="fixXY"
          gravity="center"
          circularImageUrl={"50," + image}
          adjustViewBounds="true"/>
    );
    this.replaceChild(this.idSet.profileImageContainer, layout.render(), 0);
    this.setVisibility("visible");
  }

  hide = () => {
       this.setVisibility("gone");
  }

  getVisibility = (data) => {
    return this.isVisible;
  }

  setVisibility = (data) => {
    var cmd = this.set({
      id: this.idSet.popUpParent,
      visibility: data
    })
    Android.runInUI(cmd, 0)
  }

  loadImage = () => {
    JBridge.loadImageForProfileAvatar();
  }

  removeImage = () => {
    window.__LoaderDialog.show();
    this.hide();
    this.updateProfileAvatar(null);
  }

  changeLayout = () =>{
    return (
    	 <LinearLayout
    	 height="wrap_content"
    	 width="match_parent"
    	 orientation="horizontal"
       gravity="center"
    	 weight="2"
       onClick={this.loadImage}>
    	  <ImageView
    	  height="18"
    	  width="18"
        imageUrl="ic_action_edit_blue"
        margin="0,0,10,0"/>
    	  <TextView
    	  height="wrap_content"
    	  width="wrap_content"
    	  text={window.__S.CHANGE}
        style={window.__TextStyle.textStyle.CLICKABLE.BLUE_SEMI}
        textSize="16"
        textAllCaps="true"/>
    	 </LinearLayout>
    	)
  }


  removeLayout = () =>{
    return (
    	 <LinearLayout
    	 height="wrap_content"
    	 width="match_parent"
    	 orientation="horizontal"
       gravity="center"
    	 weight="2"
       onClick={this.removeImage}>
    	  <ImageView
    	  height="18"
    	  width="18"
        margin="0,0,10,0"
        imageUrl="ic_remove"/>
    	  <TextView
    	  height="wrap_content"
    	  width="wrap_content"
    	  text={window.__S.REMOVE}
        textAllCaps="true"

        style={window.__TextStyle.textStyle.CLICKABLE.BLUE_SEMI}
        textSize="16"/>
    	 </LinearLayout>
    	)
  }


  getUi = () =>{
  	return(

         <LinearLayout
          height="match_parent"
          width="match_parent"
          weight="1"
          margin="30,0,30,0"
          background={window.__Colors.WHITE}
          orientation="vertical">
          <LinearLayout
            background={window.__Colors.PRIMARY_BLACK_11}
            height="match_parent"
            width="match_parent"
            orientation="vertical"
            weight="1"
            id={this.idSet.profileImageContainer}>
            </LinearLayout>
            <LinearLayout

            height="match_parent"
            width="match_parent"
            weight="5"
            orientation="horizontal"
            gravity="center"
            padding="12,6,12,6">

             {this.changeLayout()}
             <LinearLayout
             height="match_parent"
             width="1"
             padding="0,6,0,6"
             background="#FF979797"/>
             {this.removeLayout()}

            </LinearLayout>
          </LinearLayout>
  	)
  }

  render() {

    this.layout = (
      <LinearLayout
        orientation="vertical"
        width="match_parent"
        height="match_parent"
        id={this.idSet.popUpParent}
        visibility="gone"
        gravity="center"
        background = "#CC9E9E9E"
        orientation="vertical">
          <LinearLayout
          height="match_parent"
          width="match_parent"
          weight="2"
          background="#879686"
          onClick={this.hide}/>

            {this.getUi()}

         <LinearLayout
          height="match_parent"
          width="match_parent"
          weight="2"
          background="#785959"
          onClick={this.hide}/>

      </LinearLayout>);
    return this.layout.render();
  }

}

module.exports = ProfileImagePopUp;
