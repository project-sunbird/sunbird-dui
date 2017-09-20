var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var TextInputView = require("./core/TextInputView");
var Spinner = require("../Sunbird/core/Spinner");
var RadioButton = require("../Sunbird/core/RadioButton");
var CheckBox = require("@juspay/mystique-backend/src/android_views/CheckBox");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var Styles = require("../../res/Styles");
let IconStyle = Styles.Params.IconStyle;
var SimplePopup = require("../../components/Sunbird/core/SimplePopup");
var PageOption = require("../../components/Sunbird/core/PageOption")
var FeatureButton = require("../../components/Sunbird/FeatureButton");

var _this;

class AddressPopUp extends View {
  constructor(props, childern) {
    super(props,childern);
    this.ADDRESS_TYPE = [
      "permanent",
      "current"
    ];
    this.setIds([
      "addressPopUpParent",
      "addressPopUpBody",
      "addressTypeRadioContainer",
      "addressTypeRadio",
      "addressLine1Text",
      "addressLine2Text",
      "cityText",
      "stateText",
      "countryText",
      "pincodeText",
      "saveButton",
      "saveButtonParent",
      "saveButtonContainer",
      "delButton",
      "btnsHolder",
      "addressConf"
    ]);
    _this=this;
    this.isVisible=false;
    window.__AddressPopUp = this;
    this.props = props;
    this.responseCame=false;

    this.delete = false;
    this.canSave = false;

    this.prevData = {};

    this.delBtnState = {
      text : window.__S.DELETE,
      id : this.idSet.delButton,
      isClickable : "true",
      onClick : this.handleDelClick,
      visibility : window.__AddressPopUp.data ? "visible" : "gone"
    };

    this.saveBtnState = {
      text : window.__S.SAVE,
      id : this.idSet.saveButton,
      isClickable : "false",
      onClick : this.handleSaveClick,
      alpha : "0.5"
    }
  }


  show = () => {
    this.singleClick=true;
    this.canSave = false;
    this.isVisible=true;;
    window.__patchCallback = this.getPatchCallback ;
    this.responseCame=false;
    this.updateSaveButtonStatus(false);
    this.replaceChild(this.idSet.addressPopUpBody, this.getUi().render(),0);
    this.setVisibility("visible");
    this.initializeData();
    this.populateData();

    var cmd = this.set({
     id : this.idSet.saveButton,
     alpha : "0.5",
     clickable : "false"
    });
    cmd += this.set({
      id: this.idSet.delButton,
      visibility: window.__AddressPopUp.data ? "visible" : "gone"
    });
    Android.runInUI(cmd, 0)
  }

  hide = () => {
    this.canSave = false;
    this.isVisible=false;
    JBridge.hideKeyboard();
    this.setVisibility("gone");
    window.__AddressPopUp.data=undefined;
  }

  getVisibility = (data) => {
    return this.isVisible;
  }

  setVisibility = (data) => {
    var cmd = this.set({
      id: this.idSet.addressPopUpParent,
      visibility: data
    })
    Android.runInUI(cmd, 0)
  }


  initializeData = () => {
    if (window.__AddressPopUp.data != undefined) {
      this.prevData.addressLine1 = window.__AddressPopUp.data.addressLine1;
      this.prevData.addressLine2 = window.__AddressPopUp.data.addressLine2;
      this.prevData.city = window.__AddressPopUp.data.city;
      this.prevData.state = window.__AddressPopUp.data.state;
      this.prevData.country = window.__AddressPopUp.data.country;
      this.prevData.pincode = window.__AddressPopUp.data.zipcode ? window.__AddressPopUp.data.zipcode : "";
      this.prevData.addressType = window.__AddressPopUp.data.addType;
      return ;
    }
    this.prevData.addressLine1 = "";
    this.prevData.addressLine2 = "";
    this.prevData.city = "";
    this.prevData.state = "";
    this.prevData.country = "";
    this.prevData.pincode = "";
    this.prevData.addressType = "";
  }


  populateData = () => {
    this.addressLine1 = this.prevData.addressLine1;
    this.addressLine2 = this.prevData.addressLine2;
    this.city = this.prevData.city;
    this.state = this.prevData.state;
    this.country = this.prevData.country;
    this.pincode = this.prevData.pincode;
    this.addressType = this.prevData.addressType;

    var cmd = this.set({
      id: this.idSet.addressLine1Text,
      text: this.prevData.addressLine1
    })

    cmd += this.set({
      id: this.idSet.addressLine2Text,
      text: this.prevData.addressLine2
    })

    cmd += this.set({
      id: this.idSet.cityText,
      text: this.prevData.city
    })

    cmd += this.set({
      id: this.idSet.stateText,
      text: this.prevData.state
    })

    cmd += this.set({
      id: this.idSet.countryText,
      text: this.prevData.country
    })

    cmd += this.set({
      id: this.idSet.pincodeText,
      text: this.prevData.pincode
    })

    var addressTypeValue = [
      {name:window.__S.PERMANENT,select:"0",icon:"ic_action_radio"},
      {name:window.__S.CURRENT,select:"0",icon:"ic_action_radio"}
    ];

    var index;

    if (this.prevData.addressType == "permanent") {
      addressTypeValue[0].select = "1";
      addressTypeValue[1].select = "0";
      index = 0;
    } else if (this.prevData.addressType == "current") {
      addressTypeValue[0].select = "0";
      addressTypeValue[1].select = "1";
      index = 1;
    }

    Android.runInUI(cmd, 0);

    this.replaceChild(this.idSet.addressTypeRadioContainer,
      this.getRadioButtionLayout(addressTypeValue, index).render(), 0);
  }

  setAddressLine1 = (data) => {
    this.addressLine1 = data;
    this.checkDataChanged();
  }

  setAddressLine2 = (data) => {
    this.addressLine2 = data;
    this.checkDataChanged();
  }

  setCity = (data) => {
    this.city = data;
    this.checkDataChanged();
  }

  setState = (data) => {
    this.state = data;
    this.checkDataChanged();
  }

  setCountry = (data) => {
    this.country = data;
    this.checkDataChanged();
  }

  setPincode = (data) => {
    this.pincode = data;
    this.checkDataChanged();
  }

  checkDataChanged = () => {
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
    this.updateSaveButtonStatus((this.isValid() && isChanged));
  }

  isValid = () => {
    if (this.addressLine1 == undefined
        || this.addressLine1.length == 0
        ||this.city == undefined
        || this.city.length == 0
        || this.addressType == undefined
        || this.addressType.length == 0 ) {
      return false;
    }
    return true;
  }

  updateSaveButtonStatus = (enabled) => {
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
        background = "#ffffff"
        alignParentBottom = "true, -1">
        <PageOption
            width="match_parent"
            buttonItems={buttonList}
            hideDivider={false}
            onButtonClick={this.handlePageOption}/>
      </LinearLayout>);
  }

  handleDelClick = () => {
    window.__SimplePopup.show(this.idSet.addressConf);
  }

  checkPincode = (data) =>{
    if(data.length == 6 && /^\d+$/.test(data)){
       return true;
      }
    return false;
  }

  handleSaveClick = () => {

    if (this.singleClick && !this.canSave && !this.delete) {
      if (window.__AddressPopUp.data){
       window.__Snackbar.show(window.__S.WARNING_PLEASE_MAKE_SOME_CHANGES);
      }
      else{
        window.__Snackbar.show(window.__S.WARNING_PLEASE_ADD_MANDATORY_DETAILS );
      }
      return;
    }

    if(!JBridge.isNetworkAvailable()) {
      window.__Snackbar.show(window.__S.ERROR_NO_INTERNET_MESSAGE);
      this.delete = false;
      return;
    }

    if(this.pincode!=null && this.pincode!="" && (!this.checkPincode(this.pincode)) && !this.delete){
      window.__Snackbar.show("Invalid Pincode");
      return;
    }

    this.address = [];
    var json;
    this.addressType = this.ADDRESS_TYPE[window.__RadioButton.currentIndex];

    if (window.__AddressPopUp.data == undefined) {
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
      json = window.__AddressPopUp.data;
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
    JBridge.patchApi(url, JSON.stringify(body), window.__userToken, window.__apiToken);
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
         textAllCaps="true"
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
         <LinearLayout
         height="34"
         width="1"/>
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
    data=JSON.parse(data);
    if(this.responseCame){
      console.log("TIMEOUT")
      return;
    }

   window.__LoaderDialog.hide();
   this.responseCame=true;
   console.log(data)
   if(data.result.response=="SUCCESS"){
     this.hide();
     window.__BNavFlowRestart();
   }
   else{
     this.singleClick =true;
     window.__Snackbar.show(data.params.errmsg);
   }
 }

  getToolbar  = () =>{
    return( <LinearLayout
            height="56"
            padding="0,0,0,2"
            gravity="center_vertical"
            background={window.__Colors.PRIMARY_BLACK_22}
            width="match_parent" >
                <LinearLayout
                  height="56"
                  padding="0,0,0,0"
                  gravity="center_vertical"
                  background={window.__Colors.WHITE}
                  width="match_parent" >

                    {this.getBack()}
                    {this.getTitle()}

                </LinearLayout>
            </LinearLayout>);
  }

  getBack = () => {
    return (
      <ImageView
      margin="0,0,10,0"
      style={IconStyle}
      height="48"
      width="48"
      onClick={this.hide}
      imageUrl = {"ic_action_arrow_left"}/>);
  }

  getTitle = () => {
    return (<LinearLayout
            height="match_parent"
            width="wrap_content"
            gravity="center_vertical">
              <TextView
                  height="match_parent"
                  width="match_parent"
                  gravity="center_vertical"
                  background="#ffffff"
                  text={window.__S.TITLE_ADDRESS}
                  style={window.__TextStyle.textStyle.TOOLBAR.HEADING}/>
          </LinearLayout>);
  }

  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="2"
            margin="0,0,0,0"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  getBody = () => {
    return (
      <LinearLayout
        width = "match_parent"
        height = "match_parent"
        orientation = "vertical"
        backgroundColor = "#ffffff"
        margin = "0,0,0,24">

        {this.getToolbar()}
        <LinearLayout
          width="match_parent"
          height="match_parent"
          orientation="vertical"
          padding = "0,0,0,60">
            <ScrollView
            height="match_parent"
            width="match_parent"
            weight="1">
                 {this.getScrollView()}
            </ScrollView>
          </LinearLayout>
      </LinearLayout>);
  }
  getScrollView(){
    return(
      <LinearLayout
      height = "match_parent"
      width = "match_parent"
      orientation="vertical"
      background="#ffffff"
      id={this.idSet.scrollView}
      padding="15,15,15,15">
        <LinearLayout
        id={this.setIds.addressTypeRadioContainer}
        height="wrap_content"
        width="match_parent"
        orientation="vertical"
        padding = "4,0,0,0"
        margin = "0,0,0,2">
          <LinearLayout
            height="wrap_content"
            width="match_parent"
            orientation="horizontal"
            margin = "0,0,0,10">
            <TextView
               height="wrap_content"
               width="wrap_content"
               text={window.__S.SELECT_ADDRESS_TYPE}
               textAllCaps="true"
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
            items={[{name:window.__S.PERMANENT,select:"0",icon:"ic_action_radio"},{name:window.__S.CURRENT,select:"0",icon:"ic_action_radio"}]}
            onClick={this.handleRadioButtonClick}/>
        </LinearLayout>
        {this.getEditTextView(this.idSet.addressLine1Text, window.__S.ADDRESS_LINE1, false, this.setAddressLine1)}
        {this.getEditTextView(this.idSet.addressLine2Text, window.__S.ADDRESS_LINE2, true, this.setAddressLine2)}
        {this.getEditTextView(this.idSet.cityText, window.__S.CITY, false, this.setCity)}
        {this.getEditTextView(this.idSet.stateText, window.__S.STATE, true, this.setState)}
        {this.getEditTextView(this.idSet.countryText, window.__S.COUNTRY, true, this.setCountry)}
        {this.getEditTextView(this.idSet.pincodeText, window.__S.PINCODE, true, this.setPincode, "numeric")}
       </LinearLayout>);
  }

  getEditTextView = (id, label, optional,onChange, inputType) => {
    return (
      <TextInputView
        id = {id}
        height="wrap_content"
        width="match_parent"
        hintText={optional ? window.__S.OPTIONAL : ""}
        labelText={label}
        mandatory = {optional ? "false" : "true"}
        margin = "0,0,0,16"
        _onChange={onChange}
        text = ""
        textStyle = {window.__TextStyle.textStyle.HINT.SEMI}
        editTextStyle = {window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
        inputType = {inputType ? inputType : "text"}/>
    );
  }

  getUi = () => {
    return (
      <RelativeLayout
        width="match_parent"
        height="match_parent"
        id = {this.idSet.addressPopUpBody}
        gravity="center">
            {this.getBody()}
            {this.getButtons()}
      </RelativeLayout>);
  }

  handleConfirmDialog = (type) => {
    if (type == "positive") {
      this.delete = true;
      this.handleSaveClick();
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
        orientation="vertical"
        width="match_parent"
        height="match_parent"
        id={this.idSet.addressPopUpParent}
        visibility="gone"
        gravity="center"
        background = "#ffffff">
            {this.getUi()}

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

module.exports = AddressPopUp;
