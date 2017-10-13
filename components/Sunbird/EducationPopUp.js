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
var FeatureButton = require("../../components/Sunbird/FeatureButton");
var PageOption = require("../../components/Sunbird/core/PageOption")
var SimplePopup = require("../../components/Sunbird/core/SimplePopup");
var Styles = require("../../res/Styles");
let IconStyle = Styles.Params.IconStyle;

var _this;

class EducationPopUp extends View {
  constructor(props, childern) {
    super(props,childern);
    this.setIds([
      "educationPopUpParent",
      "educationPopUpBody",
      "degreeText",
      "yearOfPassingText",
      "percentageText",
      "gradeText",
      "inititutionText",
      "boardOrUniversityText",
      "saveButton",
      "delButton",
      "saveButtonParent",
      "saveButtonContainer",
      "eduConf"
    ]);
    _this=this;
    this.isVisible=false;
    window.__EducationPopUp = this;
    this.props = props;
    this.responseCame=false;
    this.degree = "";
    this.yearOfPassing = "";
    this.percentage = "";
    this.grade = "";
    this.inititution = "";
    this.boardOrUniversity = "";
    this.prevData = {};
    this.delete = false;
    this.canSave = false;

    this.delBtnState = {
      text : window.__S.DELETE,
      id : this.idSet.delButton,
      isClickable : "true",
      onClick : this.handleDelClick,
      visibility : window.__EducationPopUp.data ? "visible" : "gone"
    };

    this.saveBtnState = {
      text : window.__S.SAVE,
      id : this.idSet.saveButton,
      isClickable : "false",
      onClick : this.handleSaveClick,
      alpha : "0.5"
    }
  }

  getUi = () => {
    return (
      <RelativeLayout
        width="match_parent"
        height="match_parent"
        gravity="center">
            {this.getBody()}
            {this.getButtons()}
      </RelativeLayout>);
  }

  show = () => {
    this.singleClick=true;
    this.canSave = false;
    this.isVisible=true;;
    window.__patchCallback = this.getPatchCallback ;
    this.responseCame=false;
    this.updateSaveButtonStatus(false);
    this.replaceChild(this.idSet.educationPopUpBody, this.getUi().render(),0);
    this.setVisibility("visible");
    this.initializeData();
    this.populateData();
    var cmd = this.set({
      id: this.idSet.delButton,
      visibility: window.__EducationPopUp.data ? "visible" : "gone"
    });
    Android.runInUI(cmd, 0)
  }

  hide = () => {
    this.canSave = false;
    this.isVisible=false;
    JBridge.hideKeyboard();
    this.setVisibility("gone");
    window.__EducationPopUp.data=undefined;
  }

  getVisibility = (data) => {
    return this.isVisible;
  }

  setVisibility = (data) => {
    var cmd = this.set({
      id: this.idSet.educationPopUpParent,
      visibility: data
    })
    Android.runInUI(cmd, 0)
  }

  initializeData = () => {
    this.prevData.degree = "";
    this.prevData.yearOfPassing = "";
    this.prevData.percentage = "";
    this.prevData.inititution = "";
    this.prevData.boardOrUniversity = "";
    this.prevData.grade = "";

    if (window.__EducationPopUp.data != undefined) {
      this.prevData.degree = window.__EducationPopUp.data.degree;
      this.prevData.yearOfPassing = window.__EducationPopUp.data.yearOfPassing ? window.__EducationPopUp.data.yearOfPassing : "";
      this.prevData.percentage = window.__EducationPopUp.data.percentage ? window.__EducationPopUp.data.percentage : "";
      this.prevData.inititution = window.__EducationPopUp.data.name;
      this.prevData.boardOrUniversity = window.__EducationPopUp.data.boardOrUniversity;
      this.prevData.grade = window.__EducationPopUp.data.grade;
    }
  }


  populateData = () => {
    this.degree = this.prevData.degree;
    this.yearOfPassing = this.prevData.yearOfPassing;
    this.percentage = this.prevData.percentage;
    this.inititution = this.prevData.inititution;
    this.boardOrUniversity = this.prevData.boardOrUniversity;
    this.grade = this.prevData.grade;

    var cmd = this.set({
      id: this.idSet.degreeText,
      text: this.prevData.degree
    })

    cmd += this.set({
      id: this.idSet.yearOfPassingText,
      text: this.prevData.yearOfPassing
    })

    cmd += this.set({
      id: this.idSet.percentageText,
      text: this.prevData.percentage
    })

    cmd += this.set({
      id: this.idSet.inititutionText,
      text: this.prevData.inititution
    })

    cmd += this.set({
      id: this.idSet.boardOrUniversityText,
      text: this.prevData.boardOrUniversity
    })

    cmd += this.set({
      id: this.idSet.gradeText,
      text: this.prevData.grade
    })

    Android.runInUI(cmd, 0);
  }

  setDegree = (data) => {
    this.degree = data;
    this.checkDataChanged();
  }

  setYearOfPassingText = (data) => {
    this.yearOfPassing = data;
    this.checkDataChanged();
  }

  setPercentage = (data) => {
    this.percentage = data;
    this.checkDataChanged();
  }

  setGrade = (data) => {
    this.grade = data;
    this.checkDataChanged();
  }

  setInitution = (data) => {
    this.inititution = data;
    this.checkDataChanged();
  }

  setBoardOrUniversity = (data) => {
    this.boardOrUniversity = data;
    this.checkDataChanged();
  }

  checkDataChanged = () => {
    var isChanged = true;
    console.log("this.prevData", this.prevData);
    console.log("this", this);
    if (this.degree == this.prevData.degree
      && this.yearOfPassing == this.prevData.yearOfPassing
      && this.percentage == this.prevData.percentage
      && this.grade == this.prevData.grade
      && this.inititution == this.prevData.inititution
      && this.boardOrUniversity == this.prevData.boardOrUniversity) {
        console.log("isChanged is false");
         isChanged = false;
      }

    this.updateSaveButtonStatus((this.isValid() && isChanged));
  }

  isValid = () => {
    if (this.degree == undefined
        || this.degree.length == 0
        ||this.inititution == undefined
        || this.inititution.length == 0 ) {
      return false;
    }
    return true;
  }

  updateSaveButtonStatus = (enabled) => {
    var alpha;
    var isClickable;

    if (enabled) {
      alpha = "1";
      isClickable = "true";
      this.canSave = true;
    } else {
      alpha = "0.5";
      isClickable = "false";
      this.canSave = false;
    }

    var cmd = this.set({
      id: this.idSet.saveButton,
      alpha: alpha,
      clickable: isClickable
    })

    Android.runInUI(cmd, 0);
  }

  checkPassingYear = (data) => {
    if(data.length == 4 && /^\d+$/.test(data)){
       return true;
    }
    return false;
  }

  checkPercentage = (data) => {
    var flag =true;
    try {
      if( isNaN(data) || parseFloat(data) > 100.0 || parseFloat(data) < 0.0){
       flag=false;
      }
    } catch (e) {
       flag=false;
    } finally {
      return flag;
    }
  }

  checkGrade = (data) => {
    if( data.length == 1 && /[A-F]/.test(data)){
       return true;
    }
    return false;
  }
 handleSaveClick= ()=>{
   window.__LoaderDialog.show();
   this.handleSaveClickBody();
   window.__LoaderDialog.hide();   
 }

  handleSaveClickBody = () => {
    
    if (this.singleClick && !this.canSave && !this.delete){
      if (window.__EducationPopUp.data){
        window.__Snackbar.show(window.__S.WARNING_PLEASE_MAKE_SOME_CHANGES);
      }
      else{
        window.__Snackbar.show(window.__S.WARNING_PLEASE_ADD_MANDATORY_DETAILS );
      }
      return;
    }

    if(!JBridge.isNetworkAvailable()) {
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
      return;
    }

    this.education = [];
    var json;

    if(this.yearOfPassing!=null && this.yearOfPassing!="" && !this.delete)
        if(!this.checkPassingYear(this.yearOfPassing))
            {
              window.__Snackbar.show(window.__S.WARNING_INVALID_YEAR_OF_PASSING);
              return;
            }

    if(this.percentage!=null && this.percentage!="" && !this.delete){
        if(!this.checkPercentage(this.percentage))
            {
              window.__Snackbar.show(window.__S.WARNING_INVALID_PERCENTAGE);
              return;
            }
          }

    if(this.grade!=null && this.grade!="" && !this.delete){
          if(!this.checkGrade(this.grade))
              {
                window.__Snackbar.show(window.__S.WARNING_INVALID_GRADE);
                return;
              }
            }
    if (window.__EducationPopUp.data == undefined) {
      json = {
        "degree": this.degree,
        "yearOfPassing": parseInt(this.yearOfPassing),
        "name": this.inititution,
        "percentage": parseFloat(this.percentage),
        "grade": this.grade,
        "boardOrUniversity" : this.boardOrUniversity
      }
    } else {
      json = window.__EducationPopUp.data;
      json.degree = this.degree;
      json.yearOfPassing = parseInt(this.yearOfPassing);
      json.name = this.inititution;
      json.percentage = parseFloat(this.percentage);
      json.grade = this.grade;
      json.boardOrUniversity = this.boardOrUniversity;
      json.isDeleted = this.delete ? this.delete : null;
      this.delete = false;
    }

    this.education.push(json);

    var url = window.__apiUrl + "/api/user/v1/update";
    var body = {
      "id" : "unique API ID",
      "ts" : "response timestamp YYYY-MM-DDThh:mm:ss+/-nn:nn (timezone defaulted to +5.30)",
      "params" : {},
      "request" : {
        "userId" : window.__userToken,
        "education" : this.education
      }
    }

    if(this.singleClick){
        this.singleClick = false;
        _this.responseCame=false;
        JBridge.patchApi(url, JSON.stringify(body), window.__user_accessToken, window.__apiToken);
         setTimeout(() => {
             if(_this.responseCame){
               console.log("Response Already Came")
               return;
             }
             console.log("TIMEOUT");
             window.__LoaderDialog.hide();             
             window.__Snackbar.show(window.__S.ERROR_SERVER_CONNECTION);
             _this.responseCame=false;
         },window.__API_TIMEOUT);
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
   }else{
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
            </LinearLayout>
      );
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
                  text={window.__S.TITLE_EDUCATION}
                  style={window.__TextStyle.textStyle.TOOLBAR.HEADING}/>
          </LinearLayout>);
  }

  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="2"
            margin="0,0,0,0"
            background={window.__Colors.PRIMARY_BLACK_22}/>);
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

        {this.getEditTextView(this.idSet.degreeText, window.__S.DEGREE , false, this.setDegree)}
        {this.getEditTextView(this.idSet.inititutionText, window.__S.INSTITUTION_NAME, false, this.setInitution)}
        {this.getEditTextView(this.idSet.yearOfPassingText, window.__S.YEAR_OF_PASSING, true, this.setYearOfPassingText, "numeric")}
        {this.getEditTextView(this.idSet.percentageText, window.__S.PERCENTAGE, true, this.setPercentage, "floating")}
        {this.getEditTextView(this.idSet.gradeText, window.__S.GRADE, true, this.setGrade)}
        {this.getEditTextView(this.idSet.boardOrUniversityText,window.__S.BOARD_UNIVERSITY, true, this.setBoardOrUniversity)}

      </LinearLayout>
    );
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
        margin = "0,0,0,18"
        _onChange={onChange}
        text = ""
        textStyle = {window.__TextStyle.textStyle.HINT.SEMI}
        editTextStyle = {window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
        inputType = {inputType ? inputType : "text"}/>
    );
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
      </LinearLayout>
    );
  }
  getButtons = () => {
      var buttonList = [this.delBtnState, this.saveBtnState];

    return (
      <LinearLayout
        width = "match_parent"
        height = "wrap_content"
        orientation = "vertical"
        alignParentBottom = "true, -1">
        <PageOption
            width="match_parent"
            buttonItems={buttonList}
            hideDivider={false}/>
      </LinearLayout>
    );
  }
  handleDelClick = () => {
    window.__SimplePopup.show(this.idSet.eduConf);
  }

  handleConfirmDialog = (type) => {
    if (type == "positive") {
      this.delete = true;
      this.handleSaveClick();
    }
    window.__SimplePopup.hide(this.idSet.eduConf);
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
        width = "match_parent"
        height = "match_parent"
        root = "true"
        id={this.idSet.educationPopUpParent}
        background = "#ffffff"
        visibility="gone">
        <RelativeLayout
          width="match_parent"
          height="match_parent"
          id={this.idSet.educationPopUpBody}
          gravity="center">
              {this.getBody()}
              {this.getButtons()}
        </RelativeLayout>
        <LinearLayout
          width = "match_parent"
          height = "match_parent">
          <SimplePopup
            id = {this.idSet.eduConf}
            data = {popUpdata}
            buttonClick = {this.handleConfirmDialog} />
        </LinearLayout>
      </RelativeLayout>
    );

    return this.layout.render();
  }
}

module.exports = EducationPopUp;
