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
var MultiSelectSpinner = require('../components/Sunbird/MultiSelectSpinner');

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
      "saveButton",
			"gradeLayout",
			"subjectLayout",
			"mediumLayout"
    ]);
		this.state = state;
    this.shouldCacheScreen = false;
    console.log("state in GuestInformationActivity -> ", state);
		this.allQs = window.__questionStore.getAllQs();
		this.preAllQs = this.allQs;
		window.__GuestInformationActivity = this;
		this.visible = true;
    this.saveBtnState = {
      text : window.__S.SAVE,
      id : this.idSet.saveButton,
      isClickable : "true",
      onClick :  this.handleSaveClick
    }
    _this = this;
    //this.profileData = JSON.parse(this.state.data.value0.profile);
    // window.__profileData = this.profileData;//testing
    //this.handle = this.profileData.handle;
		this.profileData = JSON.parse(utils.decodeBase64(JBridge.getCurrentProfileData()));

		this.boardList = this.allQs[0].values.map(item => item.name);
		this.gradeList = this.allQs.length > 1 ? this.allQs[1].values.map(item => item.name) : [];
    this.subjectList = this.allQs.length > 2 ? this.allQs[2].values.map(item => item.name) : [];
		this.mediumList = this.allQs.length > 3 ? this.allQs[3].values.map(item => item.name) : [];

		this.boardList.unshift(window.__S.SELECT);
		this.gradeList.unshift(window.__S.SELECT);
		this.subjectList.unshift(window.__S.SELECT);
		this.mediumList.unshift(window.__S.SELECT);

		this.screenWidth = JBridge.getScreenWidth();

    //this.initData();
  }

  /*initData = () => {
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
*/
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
						{this.getMultiSelectSpinner(this.idSet.boardSpinner, window.__S.BOARD, this.boardList, this.handleBoardChange, this.profileData.board)}
						<LinearLayout
							width="match_parent"
		        	height="match_parent"
							id={this.idSet.gradeLayout}>
						{this.getMultiSelectSpinner(this.idSet.gradeSpinner, window.__S.GRADE, this.gradeList, this.handleGradeChange, this.profileData.grade)}
						</LinearLayout>
						<LinearLayout
							width="match_parent"
							height="match_parent"
						  id={this.idSet.subjectLayout}>
						{this.getMultiSelectSpinner(this.idSet.subjectSpinner, window.__S.SUBJECTS, this.subjectList, this.handleSubjectChange, this.profileData.subject)}
						</LinearLayout>
						<LinearLayout
							width="match_parent"
							height="match_parent"
						  id={this.idSet.mediumLayout}>
						{this.getMultiSelectSpinner(this.idSet.mediumOfInstructionSpinner, window.__S.MEDIUM_OF_INSTRUCTION, this.mediumList, this.handleMediumChange , this.profileData.medium)}
						</LinearLayout>
        </LinearLayout>
      </ScrollView>
  </LinearLayout>)
 }

 getSelectedItems = (params, index) => {
	 params = params.toString().split(",");
	 var selectedItems = [];
	 for(var i = 0; i<params.length; i++){
		 for(var j = 0;j<this.allQs[index].values.length; j++){
			 if(params[i]==this.allQs[index].values[j].name){
				 selectedItems.push(this.allQs[index].values[j]);
				 break;
			 }
		 }
	 }
	 return selectedItems;
 }

 populateMultiSpinner = (index) => {
	 if(index>2)
	 this.replaceChild(this.idSet.gradeLayout, this.getMultiSelectSpinner(this.idSet.gradeSpinner, window.__S.GRADE, this.gradeList, this.handleGradeChange , null).render(),0)

	 if(index>1)
	 this.replaceChild(this.idSet.subjectLayout, this.getMultiSelectSpinner(this.idSet.subjectSpinner, window.__S.SUBJECTS, this.subjectList, this.handleSubjectChange, null).render(),0)

	 if(index>0)
	 this.replaceChild(this.idSet.mediumLayout, this.getMultiSelectSpinner(this.idSet.mediumOfInstructionSpinner, window.__S.MEDIUM_OF_INSTRUCTION, this.mediumList, this.handleMediumChange, null).render(),0)

 }

  handleOnChange = (...params) => {
		this.profileData.handle = params[0];
 }

  handleMediumChange = (...params) => {
		this.allQs[3].selected = this.getSelectedItems(params, 3);
		var data = this.allQs[3];
		window.__questionStore.setAnswer(3, data);
		this.allQs = window.__questionStore.getAllQs();
		//this.gradeList = this.allQs[1].values.map(item => item.name);
  }



  handleBoardChange = (...params) => {

    //this.profileData.board = this.boardList[params[2]];
		this.allQs[0].selected = this.getSelectedItems(params, 0);
		var data = this.allQs[0];
		window.__questionStore.setAnswer(0, data);
		window.__questionStore.addNextQ();
		this.allQs = window.__questionStore.getAllQs();

		this.gradeList = this.allQs.length > 1 ? this.allQs[1].values.map(item => item.name) : [];
		this.gradeList.unshift(window.__S.SELECT);
		this.populateMultiSpinner(3);
  }

	handleGradeChange = (...params) => {

		this.allQs[1].selected = this.getSelectedItems(params, 1);
		var data = this.allQs[1];
		window.__questionStore.setAnswer(1, data);
		window.__questionStore.addNextQ();
		this.allQs = window.__questionStore.getAllQs();

		this.subjectList = this.allQs.length > 2 ? this.allQs[2].values.map(item => item.name) : [];
		this.subjectList.unshift(window.__S.SELECT);
		this.populateMultiSpinner(2);

	}
  handleSubjectChange = (...params) => {

			this.allQs[2].selected = this.getSelectedItems(params, 2);
			var data = this.allQs[2];
			window.__questionStore.setAnswer(2, data);
			window.__questionStore.addNextQ();
			this.allQs = window.__questionStore.getAllQs();

			this.mediumList = this.allQs.length > 3 ? this.allQs[3].values.map(item => item.name) : [];
			this.mediumList.unshift(window.__S.SELECT);
			this.populateMultiSpinner(1);

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

 getMultiSelectSpinner = (id, label, values, spinnerHandler, selectedData) => {
	 var width = this.screenWidth - 32;
   return(
     <LinearLayout
     width={width.toString()}
     height="wrap_content"
     orientation="vertical"
     margin="4,0,0,18">
        {this.getLabel(label)}
        <LinearLayout
          width={width.toString()}
          height="wrap_content"
          orientation="horizontal">
          <LinearLayout
          height="match_parent"
					width={width.toString()}
          padding="0,6,0,0"
          weight="1">
           <MultiSelectSpinner
             width={width.toString()}
             height="24"
             style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
             id={id}
						 selectedData={selectedData}
             onItemChange={spinnerHandler}
             data={values} />
         </LinearLayout>
        </LinearLayout>
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
   //console.log("values -> " + this.profileData.medium + " " + this.profileData.grade + " " + this.profileData.board + " " + this.profileData.subjects);
   //console.log("values -> " + selectedMedium + " " + selectedGrade + " " + selectedBoard + " " + selectedSyllabus);
	 var profile = JSON.parse(utils.decodeBase64(JBridge.getCurrentProfileData()));
	 profile.board = [];
	 profile.grade = [];
	 profile.subject = [];
	 profile.medium = [];
	 this.allQs = window.__questionStore.getAllQs();
	 this.allQs.map((item) => {
			 var selected = [];
			 item.selected.map((item) => { selected.push(item.name) });
			 console.log("current saved value -> ", item);
			 switch (item.code) {
					 case "board":
							 profile.board = selected;
							 break;
					 case "gradeLevel":
							 profile.grade = selected;
							 break;
					 case "subject":
							 profile.subject = selected
							 break;
					 case "medium":
							 profile.medium = selected;
							 break;
			 }
	 });
	 JBridge.updateProfile(this.profileData.handle, profile.medium, profile.grade, profile.board, profile.subject);
	 this.preAllQs = this.allQs;
   this.onBackPressed();
 }

 onBackPressed = () => {
	 window.__questionStore.resetArr(this.preAllQs);
   var whatToSend = []
   var event = { tag: "BACK_GuestInformationActivity", contents: whatToSend};
   window.__runDuiCallback(event);
 }

 setDefault = (object, prop, list) => {
   if (prop == "") object[prop] = list[0];
   return object;
 }

 afterRender = () => {
  // this.profileData = this.setDefault(this.profileData, "medium", this.mediumList);
  // this.profileData = this.setDefault(this.profileData, "grade", this.gradeList);
  //  this.profileData = this.setDefault(this.profileData, "board", this.boardList);
  //  this.profileData.subjects = JBridge.getFromSharedPrefs(window.__S.SUBJECTS);
  //
  //  if (this.profileData.subjects == "__failed" || this.profileData.subjects == "undefined")
  //    this.profileData.subjects = "";
  //
  //  JBridge.selectSpinnerItem(this.idSet.mediumOfInstructionSpinner, this.profileData.medium != "" ? this.mediumList.indexOf(this.profileData.medium) : 0);
  //  JBridge.selectSpinnerItem(this.idSet.gradeSpinner, this.profileData.grade != "" ? this.gradeList.indexOf(this.profileData.grade) : 0);
  //  JBridge.selectSpinnerItem(this.idSet.boardSpinner, this.profileData.board != "" ? this.boardList.indexOf(this.profileData.board) : 0);
  //  JBridge.selectSpinnerItem(this.idSet.subjectSpinner, this.profileData.subjects != "" ? this.subjectList.indexOf(this.profileData.subjects) : 0);
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
