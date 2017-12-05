var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var TextInputView = require("../components/Sunbird/core/TextInputView");
var Spinner = require("../components/Sunbird/core/Spinner");
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var RadioButton = require("../components/Sunbird/core/RadioButton");
var SimplePopup = require("../components/Sunbird/core/SimplePopup");
var PageOption = require("../components/Sunbird/core/PageOption")

var _this;

class AddressActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.ADDRESS_TYPE = [
      "permanent",
      "current"
    ];
    this.setIds([
      "addressTypeRadio",
      "addressLine1Text",
      "addressLine2Text",
      "cityText",
      "stateText",
      "countryText",
      "pincodeText",
      "saveButton",
      "delButton",
      "addressConf"
    ]);
    this.shouldCacheScreen = false;
    this.state=state;
    this.screenName="AddressActivity"
    try{
      this.data = JSON.parse(this.state.data.value0.profile);
      }catch(e){
        this.data=""
      }
    _this=this;
    this.singleClick=true;
    this.isVisible=false;
    this.props = props;
    this.responseCame=false;
    window.__patchCallback = this.getPatchCallback ;
    this.delete = false;
    this.canSave = false;

    this.prevData = {};

    this.delBtnState = {
      text : window.__S.DELETE,
      id : this.idSet.delButton,
      isClickable : "true",
      onClick : this.handleDelClick,
      visibility : this.data ? "visible" : "gone"
    };

    this.saveBtnState = {
      text : window.__S.SAVE,
      id : this.idSet.saveButton,
      isClickable : "false",
      onClick : this.handleSaveClickBody,
      alpha : "0.5"
    }
    this.initializeData();
  }


  initializeData = () => {
    this.addressTypeValue = [
          {name:window.__S.PERMANENT,select:"0",icon:"ic_action_radio"},
          {name:window.__S.CURRENT,select:"0",icon:"ic_action_radio"}
        ];

    this.index=-1;

    if (this.data != undefined&&this.data!="") {          //If user is editing a current Address
      this.prevData.addressLine1 = this.data.addressLine1;
      this.prevData.addressLine2 = this.data.addressLine2;
      this.prevData.city = this.data.city;
      this.prevData.state = this.data.state;
      this.prevData.country = this.data.country;
      this.prevData.pincode = this.data.zipcode ? this.data.zipcode : "";
      this.prevData.addressType = this.data.addType;


          if (this.prevData.addressType == "permanent") {
            this.addressTypeValue[0].select = "1";
            this.addressTypeValue[1].select = "0";
            this.index = 0;
          } else if (this.prevData.addressType == "current") {
            this.addressTypeValue[0].select = "0";
            this.addressTypeValue[1].select = "1";
            this.index = 1;
          }

    }
    else{                 //if user is adding a new address
        this.prevData.addressLine1 = "";
        this.prevData.addressLine2 = "";
        this.prevData.city = "";
        this.prevData.state = "";
        this.prevData.country = "";
        this.prevData.pincode = "";
        this.prevData.addressType = "";

    }
    this.addressLine1 = this.prevData.addressLine1;
    this.addressLine2 = this.prevData.addressLine2;
    this.city = this.prevData.city;
    this.state = this.prevData.state;
    this.country = this.prevData.country;
    this.pincode = this.prevData.pincode;
    this.addressType = this.prevData.addressType;
  }

  setAddressLine1 = (data) => {         //onChange for addressline1 editText field
    this.addressLine1 = data;
    this.checkDataChanged();            
  }

  setAddressLine2 = (data) => {        //onChange for addressline editText field
    this.addressLine2 = data;
    this.checkDataChanged();
  }

  setCity = (data) => {                //onChange for City editText field
    this.city = data;
    this.checkDataChanged();
  }

  setState = (data) => {              //onChange for State editText field
    this.state = data;
    this.checkDataChanged();
  }

  setCountry = (data) => {             //onChange for country editText field
    this.country = data;
    this.checkDataChanged();
  }

  setPincode = (data) => {             //onChange for pincode editText field
    this.pincode = data;
    this.checkDataChanged();
  }

  checkDataChanged = () => {           //Check if any field was changed
    var isChanged = true;

    if (this.addressLine1 == this.prevData.addressLine1
      && this.addressLine2 == this.prevData.addressLine2
      && this.city == this.prevData.city
      && this.state == this.prevData.state
      && this.country == this.prevData.country
      && this.pincode == this.prevData.pincode
      && this.addressType == this.prevData.addressType) {
         isChanged = false;
      }
    this.updateSaveButtonStatus(isChanged&&this.isValid());   //Updating save button status
  }

  isValid = () => {                            //Function to check if mandatory fields are entered
    if (this.addressLine1 == undefined
        || this.addressLine1.length == 0
        || this.city == undefined
        || this.city.length == 0
        || this.addressType == undefined
        || this.addressType.length == 0 ) {
      return false;
    }
    return true;
  }

  updateSaveButtonStatus = (enabled) => {       //Change save button status
    var cmd;

    this.canSave = enabled;

    if (enabled) {
      cmd = this.set({
        id: this.idSet.saveButton,
        clickable: "true",
        alpha: "1"});
    } else {
      cmd = this.set({
        id: this.idSet.saveButton,
        clickable: "false",
        alpha: "0.5"});
    }
    Android.runInUI(cmd, 0);
  }

  getButtons = () => {
      var buttonList = [this.delBtnState, this.saveBtnState];

    return (
      <LinearLayout
        width = "match_parent"
        height = "wrap_content"
        orientation = "vertical"
        background = {window.__S.PRIMARY_LIGHT}
        alignParentBottom = "true, -1">
        <PageOption
            width="match_parent"
            buttonItems={buttonList}
            hideDivider={false}
            onButtonClick={this.handlePageOption}/>
      </LinearLayout>);
  }

  handleDelClick = () => {
    if(!JBridge.isNetworkAvailable()){
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
      return ;
    }
    window.__SimplePopup.show(this.idSet.addressConf);
  }

  checkPincode = (data) =>{
    if(data==undefined || data.length != 6 || !(/^\d+$/.test(data))){
       return false;
      }
    return true;
  }

  handleSaveClickBody = () => {
    if(!JBridge.isNetworkAvailable()){                //check for internet connection
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);   
      this.delete = false;     
    }else if (this.singleClick && !this.canSave && !this.delete) {    //condition to check if the previous click response is handled and if user is allowed to save the data
      if (this.data){
       window.__Snackbar.show(window.__S.WARNING_PLEASE_MAKE_SOME_CHANGES);
      }
      else{
        window.__Snackbar.show(window.__S.WARNING_PLEASE_ADD_MANDATORY_DETAILS );
      }
    }else if(this.pincode!="" && (!this.checkPincode(this.pincode)) && !this.delete){     //Validating  pincode if it is entered
      window.__Snackbar.show(window.__S.INVALID_PINCODE);
    }else{
      this.address = [];
        var json;
        this.addressType = this.ADDRESS_TYPE[window.__RadioButton.currentIndex];

        if (this.data == undefined || this.data=="") {
          json = {
            "addressLine1": this.addressLine1,
            "addressLine2": this.addressLine2,
            "city": this.city,
            "state": this.state,
            "country": this.country,
            "zipcode" : this.pincode,
            "addType": this.addressType
          }
        } else {
          json = this.data;
          json.addressLine1 = this.addressLine1;
          json.addressLine2 = this.addressLine2;
          json.city = this.city;
          json.state = this.state;
          json.country = this.country;
          json.zipcode = this.pincode;
          json.addType = this.addressType;
          json.isDeleted = this.delete ? this.delete : null;
          this.delete = false;
        }

        this.address.push(json);

        var url = window.__apiUrl + "/api/user/v1/update";
        var body = {
          "id" : "unique API ID",
          "ts" : "response timestamp YYYY-MM-DDThh:mm:ss+/-nn:nn (timezone defaulted to +5.30)",
          "params" : {},
          "request" : {
            "userId" : window.__userToken,
            "address" : this.address
          }
        }

        console.log(JSON.stringify(body));
      if(this.singleClick){
        this.singleClick=false;
        _this.responseCame=false;
        JBridge.patchApi(url, JSON.stringify(body), window.__user_accessToken, window.__apiToken);
        window.__LoaderDialog.show();
        setTimeout(() => {
            if(_this.responseCame){
              console.log("Response Already Came")
              return;
            }
            console.log("TIMEOUT")
            window.__Snackbar.show(window.__S.ERROR_SERVER_CONNECTION);
            window.__LoaderDialog.hide();
            _this.responseCame=false;
        },window.__API_TIMEOUT);
      }
    }
  }

  getRadioButtionLayout = (item, index) => {
    return (
      <LinearLayout
      height="wrap_content"
      width="match_parent"
      orientation="vertical">
        <TextView
         height="wrap_content"
         width="wrap_content"
         text={window.__S.SELECT_ADDRESS_TYPE}
         textStyle={window.__TextStyle.textStyle.HINT.SEMI}
         margin="0,0,0,3"/>
         <RadioButton
           id={this.idSet.addressTypeRadio}
          height="wrap_content"
          width="wrap_content"
          gravity="center_vertical"
          margin="0, 10, 0, 0"
          items={item}
          defaultIndex={index}
          onClick={this.handleRadioButtonClick}/>
      </LinearLayout>);
  }

  handleRadioButtonClick=()=> {
    if (window.__RadioButton != undefined
      && window.__RadioButton.currentIndex > -1) {
        console.log("Radio Button click" + this.ADDRESS_TYPE[window.__RadioButton.currentIndex]);
      _this.addressType = this.ADDRESS_TYPE[window.__RadioButton.currentIndex];
      this.addressType = this.ADDRESS_TYPE[window.__RadioButton.currentIndex];
      _this.checkDataChanged();
    }
  }

  getPatchCallback = (data) =>{
    console.log("Patch_api call back  -------");
    data=JSON.parse(data);
    if(this.responseCame){
      console.log("TIMEOUT")
      return;
    }

   window.__LoaderDialog.hide();
   this.responseCame=true;
   console.log(data)
   if(data.result.response=="SUCCESS"){
     window.__LoaderDialog.show();
    window.__BNavFlowRestart();
  }
   else{
     this.singleClick =true;
     window.__Snackbar.show(data.params.errmsg);
   }
 }

  onBackPressed = () =>{
    var whatToSend = []
    var event = { tag: "BACK_AddressActivity", contents: whatToSend};
    window.__runDuiCallback(event);
  }

  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="2"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  getScrollView(){
    return(
      <LinearLayout
      height = "match_parent"
      width = "match_parent"
      orientation="vertical"
      id={this.idSet.scrollView}
      padding="15,15,15,15">
          <LinearLayout
            height="wrap_content"
            width="match_parent"
            orientation="horizontal"
            padding = "4,0,0,10">
            <TextView
               height="wrap_content"
               width="wrap_content"
               text={window.__S.SELECT_ADDRESS_TYPE}
               textStyle={window.__TextStyle.textStyle.HINT.SEMI}/>
            <TextView
                height="wrap_content"
                width="wrap_content"
                text=" *"
                color="#FF0000"/>
          </LinearLayout>
           <RadioButton
             id={this.idSet.addressTypeRadio}
            height="wrap_content"
            width="wrap_content"
            gravity="center_vertical"
            padding = "4,0,0,0"
            items={this.addressTypeValue}
            defaultIndex={this.index}
            onClick={this.handleRadioButtonClick}/>
        {this.getEditTextView(this.idSet.addressLine1Text,this.addressLine1, window.__S.ADDRESS_LINE1, false, this.setAddressLine1)}
        {this.getEditTextView(this.idSet.addressLine2Text,this.addressLine2, window.__S.ADDRESS_LINE2, true, this.setAddressLine2)}
        {this.getEditTextView(this.idSet.cityText,this.city, window.__S.CITY, false, this.setCity)}
        {this.getEditTextView(this.idSet.stateText,this.state, window.__S.STATE, true, this.setState)}
        {this.getEditTextView(this.idSet.countryText,this.country, window.__S.COUNTRY, true, this.setCountry)}
        {this.getEditTextView(this.idSet.pincodeText,this.pincode, window.__S.PINCODE, true, this.setPincode, "numeric")}
       </LinearLayout>);
  }

  getEditTextView = (id, text,label, optional,onChange, inputType) => {
    return (
      <TextInputView
        id = {id}
        height="wrap_content"
        width="match_parent"
        hintText={optional ?window.__S.OPTIONAL : label}
        labelText={label.toUpperCase(label)}
        mandatory = {optional ? "false" : "true"}
        margin = "0,0,0,16"
        _onChange={onChange}
        text = {text}
        textStyle = {window.__TextStyle.textStyle.HINT.SEMI}
        editTextStyle = {window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
        inputType = {inputType ? inputType : "text"}/>
    );
  }

  handleConfirmDialog = (type) => {
    if (type == "positive") {
      this.delete = true;
      this.handleSaveClickBody();
    }
    window.__SimplePopup.hide(this.idSet.addressConf);
  }

  render() {
    var popUpdata = {
      title : window.__S.CONFIRM_DEL,
      content : "",
      negButtonText : window.__S.CANCEL,
      posButtonText : window.__S.DELETE
    }
    this.layout = (
      <RelativeLayout
       width="match_parent"
       height="match_parent">
      <LinearLayout
        orientation="vertical"
        width="match_parent"
        height="match_parent"
        gravity="center"
        background = {window.__Colors.PRIMARY_LIGHT}>
            <SimpleToolbar
              title={window.__S.TITLE_ADDRESS}
              onBackPress={this.onBackPressed}
              invert="true"
              width="match_parent"/>
            <ScrollView
            height="match_parent"
            width="match_parent"
            padding="0,0,0,60">
                 {this.getScrollView()}
            </ScrollView>
            </LinearLayout>
            {this.getButtons()}
        <LinearLayout
          width = "match_parent"
          height = "match_parent">
          <SimplePopup
            id = {this.idSet.addressConf}
            data = {popUpdata}
            buttonClick = {this.handleConfirmDialog} />
        </LinearLayout>
      </RelativeLayout>);
    return this.layout.render();
  }
}

module.exports = Connector(AddressActivity);
