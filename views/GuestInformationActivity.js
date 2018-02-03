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

window.R = require("ramda");
var _this;
class GuestInformationActivity extends View {

	constructor(props, children, state) {
		super(props, children, state);
		this.setIds([
			"nameText",
      "state",
      "mediumOfInstruction",
      "grade",
      "syllabus",
			"parentId",
      "stateSpinner",
      "mediumOfInstructionSpinner",
      "syllabusSpinner",
      "gradeSpinner",
      "languageLI",
      "saveButton"
    ]);
		this.state = state;
    this.shouldCacheScreen = false;
		window.__GuestInformationActivity = this;
		this.visible = true;
    this.saveBtnState = {
      text : window.__S.SAVE,
      id : this.idSet.saveButton,
      isClickable : "true",
      onClick :  this.handleSaveClick
    }
		_this = this;
	}

	show = () => {
    this.setVisibility("visible");
    this.isVisible=true;
    //this.afterRender();
  }

  hide = () => {
    this.setVisibility("gone");
    this.isVisible=false;
  }

	setVisibility = (data) => {
    var cmd = this.set({
      id: this.idSet.parentId,
      visibility: data
    })
    Android.runInUI(cmd, 0)
  }

	onPop = () => {}

  getBody = () =>{
    return (
    <LinearLayout
    height="match_parent"
    width="match_parent"
    orientation="vertical"
    padding="0,0,0,70">
      <ScrollView
       width="match_parent"
       height="match_parent"
       weight="1">
        <LinearLayout
        width="match_parent"
        height="match_parent"
        padding="11,15,15,15"
        orientation="vertical">
                  {this.getEditTextView(this.idSet.nameText,window.__S.FULL_NAME,"",window.__S.FIRST_NAME_HINT,true,"",undefined,false,this.idSet.nameLI,"firstName","8,8,8,8")}
                  {this.getSingleSelectSpinner(this.idSet.state,window.__S.STATE,true,this.loadStateSpinner,true,this.idSet.languageLI,"language")}
                  {this.getSingleSelectSpinner(this.idSet.mediumOfInstruction,window.__S.MEDIUM_OF_INSTRUCTION,true,this.loadMediumOfInstructionSpinner,true,this.idSet.languageLI,"language")}
                  {this.getSingleSelectSpinner(this.idSet.grade,window.__S.GRADE,true,this.loadGradeSpinner,true,this.idSet.languageLI,"language")}
                  {this.getSingleSelectSpinner(this.idSet.syllabus,window.__S.SYLLABUS,true,this.loadSyllabusSpinner,true,this.idSet.languageLI,"language")}

        </LinearLayout>
      </ScrollView>
  </LinearLayout>)
 }

 setName = (data) =>{
   this.currentData.firstName= data;
   //this.updateSaveButtonStatus(this.checkCompleteStatus());
 }

 getEditTextView = (id, label, text, hint , optional , onChange, inputType,lockIconVisibility,lockIconId,lockName,padding) =>{
   console.log("getedittextview :",label,"   ",lockIconVisibility);
   return(
     <RelativeLayout
      height="match_parent"
      width="match_parent">
      <TextInputView
       id={id}
       height="wrap_content"
       width="match_parent"
       hintText={hint + (optional ? " (Optional)" : "")}
       labelText={label.toUpperCase(label)}
       mandatory = {optional ? "false" : "true"}
       margin = "0,0,0,18"
       editTextPadding="4,4,41,10"
       _onChange={onChange}
       text = {text}
       textStyle = {window.__TextStyle.textStyle.HINT.SEMI}
       editTextStyle = {window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
       inputType = {inputType ? inputType : "text"}/>
       <LinearLayout
        width="wrap_content"
        height="wrap_content"
        alignParentRight="true,-1"
        padding="0,0,0,0">
       </LinearLayout>
       </RelativeLayout>)
 }

 getSingleSelectSpinner = (id,label,optional,callSpinner,lockIconVisibility,lockIconId,lockName) => {
   return(
     <LinearLayout
     width="match_parent"
     height="wrap_content"
     orientation="vertical"
     margin="4,0,0,18">
        {this.getLabel(label,optional)}
        <LinearLayout
          width="match_parent"
          height="wrap_content"
          orientation="horizontal"
          id={id}>
          <LinearLayout
          height="match_parent"
          padding="0,6,0,0"
          weight="1">
           {callSpinner()}
         </LinearLayout>
        </LinearLayout>
        {this.getLineSeperator()}
      </LinearLayout>
   )
 }
 getLineSeperator = () => {
   return (<LinearLayout
           width="match_parent"
           margin="4,0,0,0"
           height="1"
           background={window.__Colors.PRIMARY_BLACK}/>)
 }

 getLabel = (label,optional) =>{
    if(optional)
        return(
          <TextView
         width="match_parent"
         height="wrap_content"
         style={window.__TextStyle.textStyle.HINT.SEMI}
         text={label.toUpperCase(label)}/>);

    return (
      <LinearLayout
      height="wrap_content"
      width="wrap_content"
      orientation="horizontal">
      <TextView
       width="match_parent"
       height="wrap_content"
       style={window.__TextStyle.textStyle.HINT.SEMI}
       text={label.toUpperCase(label)}/>
      <TextView
      height="wrap_content"
      width="wrap_content"
      text=" *"
      color="#FF0000"/>
      </LinearLayout>);
 }
 loadStateSpinner = () => {
   return(<Spinner
           width="match_parent"
           height="24"
           style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
           id={this.idSet.stateSpinner}
           onItemClick = {this.handleLanguageSpinnerItemClick}
           values={"Karnataka"}/>)
 }

 loadMediumOfInstructionSpinner = () => {
   return(<Spinner
           width="match_parent"
           height="24"
           style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
           id={this.idSet.mediumOfInstructionSpinner}
           onItemClick = {this.handleLanguageSpinnerItemClick}
           values={"English"}/>)
 }

 loadGradeSpinner = () => {
   return(<Spinner
           width="match_parent"
           height="24"
           style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
           id={this.idSet.gradeSpinner}
           onItemClick = {this.handleLanguageSpinnerItemClick}
           values={"Grade 1"}/>)
 }

 loadSyllabusSpinner = () => {
   return(<Spinner
           width="match_parent"
           height="24"
           style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
           id={this.idSet.syllabusSpinner}
           onItemClick = {this.handleLanguageSpinnerItemClick}
           values={"English"}/>)
 }

 handleLanguageSpinnerItemClick = (...params) => {
      console.log(params[2]," loadLanguageSpinner");

      if(params[2]>0)
      {this.currentData.language=[this.LanguageArray[params[2]]]
      }
      else{
        this.currentData.language=[];
      }

      this.updateSaveButtonStatus(this.checkCompleteStatus());
 }
 getButtons = () => {
     var buttonList = [this.saveBtnState];
   return (
     <LinearLayout
       width = "match_parent"
       height = "wrap_content"
       alignParentBottom = "true, -1"
       orientation = "vertical"
       background = "#ffffff">
       <PageOption
           width="match_parent"
           buttonItems={buttonList}
           hideDivider={false}/>
     </LinearLayout>
   );
 }
 handleSaveClick =()=>{
   if(!JBridge.isNetworkAvailable()){
     window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
   }
   var whatToSend = []
   var event ={ tag: "BACK_GuestInformationActivity", contents: whatToSend }
   window.__runDuiCallback(event);
 }
 onBackPressed = () => {
   var whatToSend = []
   var event = { tag: "BACK_GuestInformationActivity", contents: whatToSend};
   window.__runDuiCallback(event);
 }
  render(){
      console.log("render");
      this.layout=(
        <LinearLayout
          id  = {this.idSet.parentId}
          orientation="vertical"
          root="true"
          background={window.__Colors.WHITE}
          width="match_parent"
          height="match_parent">
          <SimpleToolbar
            title={window.__S.EDIT_PROFILE}
            onBackPress={this.onBackPressed}
            invert="true"
            width="match_parent"/>
          <RelativeLayout
           width="match_parent"
           height="match_parent">
               {this.getBody()}
               {this.getButtons()}
          </RelativeLayout>
       </LinearLayout>
      );
    return this.layout.render();
  }

};

module.exports = Connector(GuestInformationActivity);
