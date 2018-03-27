var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var TextInputView = require('../components/Sunbird/core/TextInputView');
var Spinner = require('../components/Sunbird/core/Spinner');
var MultiSelectSpinner = require('../components/Sunbird/MultiSelectSpinner');
var Styles = require("../res/Styles");
var PageOption = require('../components/Sunbird/core/PageOption')
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var utils = require('../utils/GenericFunctions');
var RadioButton = require("../components/Sunbird/core/RadioButton");
var SharePopup = require('../components/Sunbird/core/SharePopup');




window.R = require("ramda");
var _this;
class DataSyncScreenActivity extends View {

	constructor(props, children, state) {
		super(props, children, state);
    this.OPTION_TYPE = [
      window.__S.OFF,
      window.__S.OVER_WIFI,
      window.__S.ALWAYS_ON
    ]
		this.setIds([
			"parentId",
      "saveButton",
      "addressTypeRadio",
			"lastSyncTextView",
			"sharePopupContainer"
    ]);

		this.state = state;
    this.shouldCacheScreen = false;
    console.log("state in DataSyncScreenActivity -> ", state);

		window.__DataSyncScreenActivity = this;
		this.visible = true;
    this.saveBtnState = {
      text : window.__S.SAVE,
      id : this.idSet.saveButton,
      isClickable : "true",
      onClick :  this.handleSaveClick
    }
		this.lastSync = "";
		var longTime = JBridge.getLastTelemetrySyncTime();
		if(longTime != 0)
		this.lastSync = new Date(longTime).toLocaleString();

    this.lastSync = this.lastSync == "" ? "" : window.__S.LAST_SYNC + this.lastSync;
		_this = this;

		this.optionTypeValue = [];
		this.index = -1;
		this.optionType = JBridge.getFromSharedPrefs("data_sync");
		this.initializeData();
    // window.__profileData = this.profileData;//testing
  }

  initializeData = () => {

	  if(this.optionType == window.__S.OFF){
			this.index = 0;
			this.optionTypeValue = [
				{name:window.__S.OFF,select:"1",icon:"ic_action_radio"},
				{name:window.__S.OVER_WIFI,select:"0",icon:"ic_action_radio"},
				{name:window.__S.ALWAYS_ON,select:"0",icon:"ic_action_radio"}
			];
		}
		else if(this.optionType == window.__S.OVER_WIFI){
			this.index = 1;
			this.optionTypeValue = [
				{name:window.__S.OFF,select:"0",icon:"ic_action_radio"},
				{name:window.__S.OVER_WIFI,select:"1",icon:"ic_action_radio"},
				{name:window.__S.ALWAYS_ON,select:"0",icon:"ic_action_radio"}
			];
		}
		else if(this.optionType == window.__S.ALWAYS_ON){
			this.index = 2;
			this.optionTypeValue = [
				{name:window.__S.OFF,select:"0",icon:"ic_action_radio"},
				{name:window.__S.OVER_WIFI,select:"0",icon:"ic_action_radio"},
				{name:window.__S.ALWAYS_ON,select:"1",icon:"ic_action_radio"}
			];
		}
		else {
			this.index = -1;
			this.optionTypeValue = [
				{name:window.__S.OFF,select:"0",icon:"ic_action_radio"},
				{name:window.__S.OVER_WIFI,select:"0",icon:"ic_action_radio"},
				{name:window.__S.ALWAYS_ON,select:"0",icon:"ic_action_radio"}
			];
		}

    //this.index=-1;
  }

  handleRadioButtonClick=()=> {
    if (window.__RadioButton != undefined
      && window.__RadioButton.currentIndex > -1) {
        console.log("Radio Button click" + this.OPTION_TYPE[window.__RadioButton.currentIndex]);
      //_this.optionType = this.OPTION_TYPE[window.__RadioButton.currentIndex];
      this.optionType = this.OPTION_TYPE[window.__RadioButton.currentIndex];
      // _this.checkDataChanged();
      JBridge.setInSharedPrefs("data_sync",this.optionType);

    }
  }

  getBody = () =>{

 }


 getLineSeperator = () => {
   return (<LinearLayout
           width="match_parent"
           margin="4,0,0,0"
           height="1"
           background={window.__Colors.PRIMARY_BLACK}/>)
 }



 handleSaveClick =()=>{

 }

 onBackPressed = () => {
   var whatToSend = []
   var event = { tag: "BACK_DataSyncScreenActivity", contents: whatToSend};
   window.__runDuiCallback(event);
 }

 onSyncNowClick = () => {
	 window.__LoaderDialog.show();

	 var callback = callbackMapper.map(function (data) {
		 console.log("SYNC TELEMETRY data",data.toString());
		 if(data[0] == "SUCCESS"){
		 	window.__Snackbar.show(window.__S.DATA_SYNC + " : " + data[0]);
			_this.replaceChild(_this.idSet.lastSyncTextView, _this.getSyncNowTextView(data[1]).render(), 0);
		}

		else if (data[0] == "FAILURE") {
			window.__Snackbar.show(window.__S.DATA_SYNC + " : " + data[1]);
		}

		window.__LoaderDialog.hide();
	 });//end of callback
   JBridge.syncTelemetryNow(callback);

 }

 getSyncNowTextView = (longTime) => {
	 this.lastSync = window.__S.LAST_SYNC + (new Date(parseFloat(longTime)).toLocaleString());
	 return (
		 <LinearLayout
		 	height="match_parent"
			width="match_parent"
			>
		 <TextView
			 id={this.idSet.lastSyncTextView}
			 height="wrap_content"
			 width="wrap_content"
			 margin="4,26,0,0"
			 text={this.lastSync}
			 textSize={"12"}
			 color={"#FF969696"}
			 gravity="left"/>
			 </LinearLayout>
	 )
 }

shareTelemetry = () => {
	var shareCallback = callbackMapper.map(function (data) {
		console.log(data);
		if (data[0] != "failure") {
			var input;
			console.log("SHARE CALLBACK DATA", data[0]);

				input = [{
					type: "file",
					data: "file://" + data[0]
				}];
		} else {
			window.__Snackbar.show("ERROR!");
			return;
		}
		var sharePopUp = (
			<SharePopup
				data={input}
				type="TELEMETRY" />
		);
		_this.replaceChild(_this.idSet.sharePopupContainer, sharePopUp.render(), 0);
		window.__SharePopup.show();
	});
	JBridge.shareTelemetry(shareCallback);
}

 afterRender = () => {
	 JBridge.logSettingsScreenEvent("SETTINGS_DATASYNC");

   }

  render() {
    this.layout = (
			<RelativeLayout
				width="match_parent"
				height="match_parent"
				clickable="true"
				root="true">
      <LinearLayout
				height="match_parent"
				width="match_parent"
				orientation="vertical"
				padding="0,0,0,0"
				background={"#FFFFFFFF"}
				cornerRadius="0"
				clickable="true">
				<SimpleToolbar
        title={window.__S.DATA_SYNC}
        afterRender={this.afterRender}
        width="match_parent"
        onBackPress={this.onBackPressed}/>
				<TextView
					height="wrap_content"
					width="wrap_content"
					margin="16,16,0,8"
					text={window.__S.AUTOMATIC_SYNC}
					textSize={"12"}
					color={"#FF969696"}
					lineHeight="20px"
					gravity="left"/>
          <LinearLayout
            height="wrap_content"
            width="wrap_content"
            padding="16,0,0,0">
          <RadioButton
           id={this.idSet.addressTypeRadio}
           height="wrap_content"
           width="wrap_content"
           textSize="14"
           orientation="vertical"
           items={this.optionTypeValue}
           defaultIndex={this.index}
           onClick={this.handleRadioButtonClick}/>
           </LinearLayout>
					 <LinearLayout
					  id={this.idSet.lastSyncTextView}
					 	height="wrap_content"
						width="wrap_content"
						orientation="vertical"
						padding="16,0,0,0">
				<TextView
					height="wrap_content"
					width="wrap_content"
					margin="0,26,0,0"
					text={this.lastSync}
					textSize={"12"}
					color={"#FF969696"}
					gravity="left"/>
					</LinearLayout>
				<LinearLayout
					height="wrap_content"
					width="match_parent"
					orientation="horizontal"
					gravity="center"
					margin="16,10,16,0">
					<LinearLayout
						height="wrap_content"
						width="match_parent"
						orientation="horizontal"
						gravity="center"
						background={"#FF007AFF"}
						clickable="true"
						cornerRadius="4"
            >
						<TextView
							height="match_parent"
							width="match_parent"
							text={window.__S.SYNC_NOW}
							textSize={"14"}
							padding = "0,10,0,10"
							color={"#FFFFFFFF"}
							onClick={this.onSyncNowClick}
							gravity="center"/>
					</LinearLayout>
				</LinearLayout>
				<LinearLayout
					height="2"
					width="match_parent"
					background={"#FFD7D7D7"}
					margin="16,16,16,0"
					cornerRadius="0"/>
					<LinearLayout
						width="wrap_content"
						onClick={this.shareTelemetry}
						height="wrap_content">
				<TextView
					height="match_parent"
					width="match_parent"
					margin="16,16,16,16"
					text={window.__S.SHARE_TELEMETRY}
					textSize={"12"}
					color={"#FF0079FF"}
					gravity="left"/>
					</LinearLayout>
				<LinearLayout
						height="match_parent"
					width="match_parent"
					background={"#FFF2F2F2"}
					margin="0,0,0,0"
					cornerRadius="0"/>

			</LinearLayout>
			<LinearLayout
				width="match_parent"
				height="match_parent"
				id={this.idSet.sharePopupContainer} />
			</RelativeLayout>
    );
    return this.layout.render();
  }

};

module.exports = Connector(DataSyncScreenActivity);
