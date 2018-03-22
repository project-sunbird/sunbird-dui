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
      "subjectSpinner",
      "mediumOfInstructionSpinner",
      "boardSpinner",
      "gradeSpinner",
      "languageLI",
      "saveButton"
    ]);
		this.state = state;
    this.shouldCacheScreen = false;
    console.log("state in GuestInformationActivity -> ", state);
    
		window.__GuestInformationActivity = this;
		this.visible = true;
    this.saveBtnState = {
      text : window.__S.SAVE,
      id : this.idSet.saveButton,
      isClickable : "true",
      onClick :  this.handleSaveClick
    }
    _this = this;
    
    this.profileData = JSON.parse(this.state.data.value0.profile);
    // window.__profileData = this.profileData;//testing
    this.handle = this.profileData.handle;
    this.mediumList = [];
    this.gradeList = [];
    this.boardList = [];
    this.subjectList = [];
    this.initData();
  }
  
  initData = () => {
    this.profileData = JSON.parse(utils.decodeBase64(JBridge.getCurrentProfileData()));
    this.mediumListData = JSON.parse(utils.decodeBase64(JBridge.getMediums()));
    this.gradeListData = JSON.parse(utils.decodeBase64(JBridge.getGrades()));
    this.boardListData = JSON.parse(utils.decodeBase64(JBridge.getBoards()));
    this.subjectListData = JSON.parse(utils.decodeBase64(JBridge.getSubjects()));

    this.mediumList = this.extractLabels(this.mediumListData);
    this.gradeList = this.extractLabels(this.gradeListData);
    this.boardList = this.extractLabels(this.boardListData);
    this.subjectList = this.extractLabels(this.subjectListData);
    this.profileData.grade = this.profileData.grade == -1 ? "" : this.gradeList[this.profileData.grade];
  }

  extractLabels = (list) => {
    var labels = [];
    list.map((item, i) => {
      labels[i] = item.label;
    });
    return labels;
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
            {this.getEditTextView(this.idSet.nameText, window.__S.FULL_NAME, this.profileData.handle, this.handleOnChange)}
            {this.getSingleSelectSpinner(this.idSet.mediumOfInstructionSpinner, window.__S.MEDIUM_OF_INSTRUCTION, this.mediumList, this.handleMediumChange)}
            {this.getSingleSelectSpinner(this.idSet.gradeSpinner, window.__S.GRADE, this.gradeList, this.handleGradeChange)}
            {this.getSingleSelectSpinner(this.idSet.boardSpinner, window.__S.BOARD, this.boardList, this.handleBoardChange)}
            {this.getSingleSelectSpinner(this.idSet.subjectSpinner, window.__S.SUBJECTS, this.subjectList, this.handleSubjectChange)}       
        </LinearLayout>
      </ScrollView>
  </LinearLayout>)
 }

  handleOnChange = (...params) => {
   this.profileData.handle = params[0];
 }

  handleMediumChange = (...params) => {
    this.profileData.medium = this.mediumList[params[2]];
  }
  
  handleGradeChange = (...params) => {
    this.profileData.grade = this.gradeList[params[2]];
  }

  handleBoardChange = (...params) => {
    this.profileData.board = this.boardList[params[2]]; 
  }

  handleSubjectChange = (...params) => {
      this.profileData.subjects = this.subjectList[params[2]];
  }

 getEditTextView = (id, label, text, onChange) =>{
   return(
     <RelativeLayout
       height="match_parent"
       width="match_parent">
       <TextInputView
         id={id}
         height="wrap_content"
         width="match_parent"
         labelText={label.toUpperCase(label)}
         margin="0,0,0,18"
         editTextPadding="4,4,41,10"
         _onChange={onChange}
         text={text}
         textStyle={window.__TextStyle.textStyle.HINT.SEMI}
         editTextStyle={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
         inputType={"text"} />
       <LinearLayout
         width="wrap_content"
         height="wrap_content"
         alignParentRight="true,-1"
         padding="0,0,0,0">
       </LinearLayout>
     </RelativeLayout>)
 }

 getSingleSelectSpinner = (id, label, values, spinnerHandler) => {
   return(
     <LinearLayout
     width="match_parent"
     height="wrap_content"
     orientation="vertical"
     margin="4,0,0,18">
        {this.getLabel(label)}
        <LinearLayout
          width="match_parent"
          height="wrap_content"
          orientation="horizontal">
          <LinearLayout
          height="match_parent"
          padding="0,6,0,0"
          weight="1">
           <Spinner
             width="match_parent"
             height="24"
             style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
             id={id}
             onItemClick={spinnerHandler}
             values={values.toString()} />
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

 getLabel = (label) =>{
   return (
     <LinearLayout
       height="wrap_content"
       width="wrap_content"
       orientation="horizontal">
       <TextView
         width="match_parent"
         height="wrap_content"
         style={window.__TextStyle.textStyle.HINT.SEMI}
         text={label.toUpperCase(label)} />
     </LinearLayout>);
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

 extractValue = (masterList, key) => {
   console.log("masterList -> ", masterList);
   
   var ret;
   masterList.map((item, i) => {
     if (item.label == key) {
       console.log("item -> " + key, item);
       ret = item.value;
     }
   });
   console.log("final value -> ", ret);
   return ret;
 }

 handleSaveClick =()=>{
   console.log("values -> " + this.profileData.medium + " " + this.profileData.grade + " " + this.profileData.board + " " + this.profileData.subjects);
   
   var selectedMedium = this.extractValue(this.mediumListData, this.profileData.medium);
   var selectedGrade = this.extractValue(this.gradeListData, this.profileData.grade);
   var selectedBoard = this.extractValue(this.boardListData, this.profileData.board);
   var selectedSyllabus = this.extractValue(this.subjectListData, this.profileData.subjects);

   console.log("values -> " + selectedMedium + " " + selectedGrade + " " + selectedBoard + " " + selectedSyllabus);

   JBridge.updateProfile(this.profileData.handle, [selectedMedium], [selectedGrade], [selectedBoard], [selectedSyllabus]);
   this.onBackPressed();
 }

 onBackPressed = () => {
   var whatToSend = []
   var event = { tag: "BACK_GuestInformationActivity", contents: whatToSend};
   window.__runDuiCallback(event);
 }

 setDefault = (object, prop, list) => {
   if (prop == "") object[prop] = list[0];
   return object;
 }

 afterRender = () => {
   this.profileData = this.setDefault(this.profileData, "medium", this.mediumList);
   this.profileData = this.setDefault(this.profileData, "grade", this.gradeList);
   this.profileData = this.setDefault(this.profileData, "board", this.boardList);
   this.profileData.subjects = JBridge.getFromSharedPrefs(window.__S.SUBJECTS);

   if (this.profileData.subjects == "__failed" || this.profileData.subjects == "undefined")
     this.profileData.subjects = "";
   
   JBridge.selectSpinnerItem(this.idSet.mediumOfInstructionSpinner, this.profileData.medium != "" ? this.mediumList.indexOf(this.profileData.medium) : 0);
   JBridge.selectSpinnerItem(this.idSet.gradeSpinner, this.profileData.grade != "" ? this.gradeList.indexOf(this.profileData.grade) : 0);
   JBridge.selectSpinnerItem(this.idSet.boardSpinner, this.profileData.board != "" ? this.boardList.indexOf(this.profileData.board) : 0);
   JBridge.selectSpinnerItem(this.idSet.subjectSpinner, this.profileData.subjects != "" ? this.subjectList.indexOf(this.profileData.subjects) : 0);
 }

  render() {
    this.layout = (
      <LinearLayout
        id={this.idSet.parentId}
        orientation="vertical"
        root="true"
        afterRender={this.afterRender}
        background={window.__Colors.WHITE}
        width="match_parent"
        height="match_parent">
        <SimpleToolbar
          title={window.__S.EDIT_PROFILE}
          onBackPress={this.onBackPressed}
          invert="true"
          width="match_parent" />
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
