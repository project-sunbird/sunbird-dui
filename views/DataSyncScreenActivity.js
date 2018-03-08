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
      "Off",
      "Over Wifi",
      "Always On"
    ]
		this.setIds([
			"parentId",
      "saveButton",
      "addressTypeRadio",
			"lastSyncTextView",
			"sharePopupContainer"
    ]);
    JBridge.getLastTelemetrySyncTime();

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
    this.lastSync = JBridge.getFromSharedPrefs("sync_time");
    this.lastSync = this.lastSync == "__failed" ? "" : window.__S.LAST_SYNC + this.lastSync;
    _this = this;
    this.initializeData();


    // window.__profileData = this.profileData;//testing
  }

  initializeData = () => {
    this.optionTypeValue = [
          {name:window.__S.OFF,select:"0",icon:"ic_action_radio"},
          {name:window.__S.OVER_WIFI,select:"0",icon:"ic_action_radio"},
          {name:window.__S.ALWAYS_ON,select:"0",icon:"ic_action_radio"}
        ];

    this.index=-1;
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
		 var postSyncMessage = JBridge.getFromSharedPrefs("sync_time_error");

		 if(postSyncMessage != "__failed")
		 	window.__Snackbar.show(window.__S.DATA_SYNC + ": " + postSyncMessage);

		 _this.replaceChild(_this.idSet.lastSyncTextView, _this.getSyncNowTextView().render(), 0);
		 window.__LoaderDialog.hide();
	 });//end of callback
   JBridge.syncTelemetryNow(callback);

 }

 getSyncNowTextView = () => {

	 this.lastSync = window.__S.LAST_SYNC + JBridge.getFromSharedPrefs("sync_time");
	 return (
		 <LinearLayout
		 	height="match_parent"
			width="match_parent"
			>
		 <TextView
			 id={this.idSet.lastSyncTextView}
			 height="17"
			 width="208"
			 margin="18,26,134,0"
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
				padding="0,11,0,0"
				background={"#FFFFFFFF"}
				cornerRadius="0"
				clickable="true">
				<SimpleToolbar
        title={window.__S.DATA_SYNC}
        afterRender={this.afterRender}
        width="match_parent"
        onBackPress={this.onBackPressed}/>
				<TextView
					height="20"
					width="136"
					margin="16,29,208,0"
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
					height="17"
					width="208"
					margin="18,26,134,0"
					text={this.lastSync}
					textSize={"12"}
					color={"#FF969696"}
					gravity="left"/>
					</LinearLayout>
				<LinearLayout
					height="38"
					width="match_parent"
					orientation="horizontal"
					gravity="center"
					margin="16,10,16,0">
					<LinearLayout
						height="38"
						width="match_parent"
						orientation="horizontal"
						gravity="center"
						background={"#FF007AFF"}
						cornerRadius="4"
            >
						<TextView
							height="19"
							width="68"
							text={window.__S.SYNC_NOW}
							textSize={"14"}
              onClick={this.onSyncNowClick}
							color={"#FFFFFFFF"}
							gravity="left"/>
					</LinearLayout>
				</LinearLayout>
				<LinearLayout
					height="2"
					width="match_parent"
					background={"#FFD7D7D7"}
					margin="16,16,16,0"
					cornerRadius="0"/>
				<TextView
					height="17"
					width="108"
					margin="16,16,236,0"
					onClick={this.shareTelemetry}
					text={window.__S.SHARE_TELEMETRY}
					textSize={"12"}
					color={"#FF0079FF"}
					gravity="left"/>
				<LinearLayout
						height="match_parent"
					width="match_parent"
					background={"#FFF2F2F2"}
					margin="0,16,0,0"
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
