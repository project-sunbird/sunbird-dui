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

let IconStyle = Styles.Params.IconStyle;

class AdditionalInformationActivity extends View{

  constructor(props, children,state) {
    super(props, children,state);
    this.setIds([
      "predictionLanguageLayout",
      "LanguageLayout",
      "HobbiesLayout",
      "predictionHobbiesLayout",
      "languageSpinner",
      "subjectSpinnerContainer",
      "genderSpinner",
      "saveButton",
      "saveButtonContainer",
      "emailText",
      "phoneText",
      "locationText",
      "dobText",
      "gradeSpinnerContainer",
      "gradeContainer",
      "nameText",
      "lastNameText",
      "adharText",
      "descriptionText",
      "fbText",
      "twitterText",
      "linkedinText",
      "blogText",
      "languageLI",
      "emailLI",
      "phoneLI",
      "locationLI",
      "dobLI",
      "gradeLI",
      "genderLI",
      "subjectsLI",
      "descriptionLI",
      "fbLI",
      "twitterLI",
      "linkedinLI",
      "blogLI",
      "nameLI",
      "lastNameLI",
      "webLinksLI"
    ]);
    this.shouldCacheScreen = false;
    this.state=state;
    this.lockStatus=true;
    this.prevData={};
    this.currentData={};
    this.screenName="AdditionalInformationActivity"

    let frameworkSub = window.__questionStore.getSubjectsFromFramework();
    if (window.__questionStore && frameworkSub.length != 0) {
      this.subjectDictionary = ["Select"];
      this.subjectDictionary = this.subjectDictionary.concat(frameworkSub);
    } else {
      this.subjectDictionary = ["Select", "Mathematics", "English", "Tamil", "Telugu", "Geography", "Urdu", "Kannada", "Assamese", "Physics", "Chemistry", "Hindi", "Marathi", "Environmental Studies", "Political Science", "Bengali", "History", "Gujarati", "Biology", "Oriya", "Punjabi", "Nepali", "Malayalam"];
    }
    this.currentData.selectedSubjects=[];
    this.currentData.email = "";
    this.currentData.mobile = "";
    this.currentData.location = "";
    this.currentData.grade="";
    this.currentData.firstName= "";
    this.currentData.lastName="";
    this.currentData.language="";
    this.currentData.adhar="";
    this.currentData.gender="";
    this.currentData.dob="";
    this.currentData.description="";
    this.currentData.fb="";
    this.currentData.twitter="";
    this.currentData.linkedin="";
    this.currentData.blog="";
    this.responseCame=false;
    this.beforeRender=true;

    this.prevData.description=null;
    this.prevData.lockStatus={
      "email" : "public",
      "location" :  "public",
      "phone" : "public",
      "language" : "public",
      "dob" : "public",
      "gender" : "public",
      "profileSummary" : "public",
      "grade" : "public",
      "subject" : "public",
      "webPages" : "public"
    }
    this.currentData.lockStatus= Object.assign({}, this.prevData.lockStatus);
    this.GenderArray=["Select","Male","Female","Transgender"];
    this.LanguageArray=["Select","Assamese","Bengali","English","Gujarati","Hindi","Kannada","Marathi","Punjabi","Tamil","Telugu"];

    let frameworkGrade = window.__questionStore.getGradesFromFramework();
    if (window.__questionStore && frameworkGrade.length != 0) {
      this.GradeArray = ["Select"];
      this.GradeArray = this.GradeArray.concat(frameworkGrade);
      
    } else {
      this.GradeArray = ["Select", "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "Other"];
    }

    this.data = JSON.parse(this.state.data.value0.profile);
    console.log("Info State  ----->", this.state);

    if(this.data.profileVisibility!=undefined )
    {
      Object.keys(this.data.profileVisibility).map((item)=>{
        if(this.data.profileVisibility[item]=="private")
        this.prevData.lockStatus[item]="private";
      })
    }
    this.currentData.lockStatus= Object.assign({},this.prevData.lockStatus);
    console.log("lockStatus",this.currentData.lockStatus);

    this.saveBtnState = {
      text : window.__S.SAVE,
      id : this.idSet.saveButton,
      isClickable : "false",
      onClick :  this.handleSaveClick,
      alpha : "0.5"
    }
    // initializing current and previous data
    window.__patchCallback = this.getPatchCallback ;
    this.currentData.email = this.data.email;
    this.currentData.mobile = this.data.phone;
    this.currentData.firstName = this.data.firstName;
    this.currentData.lastName = this.data.lastName;
    this.currentData.adhar = this.data.aadhaarNo;
    this.currentData.location = this.data.location;
    this.currentData.language = this.data.language;
    this.currentData.dob = this.data.dob;
    this.currentData.gender = this.data.gender;
    this.currentData.description=this.data.profileSummary;
    var _this=this;
    if(this.data.webPages!=undefined)
    {
      this.data.webPages.map((data)=>{
        if(data.type=="fb"){
           _this.currentData.fb=data.url;
        }
        else if(data.type=="twitter")
        {
          _this.currentData.twitter=data.url;
        }
        else if(data.type=="in")
        {
          _this.currentData.linkedin=data.url;
        }
        else if (data.type=="blog") {
          _this.currentData.blog=data.url;
        }
      })
    }
    this.currentData.grade=this.data.grade!=null ? this.data.grade.slice():null;
    this.currentData.selectedSubjects = this.data.subject!=null ? this.data.subject.slice():null;
    this.prevData.email = this.data.email;
    this.prevData.mobile = this.data.phone;
    this.prevData.firstName = this.data.firstName;
    this.prevData.lastName = this.data.lastName;
    this.prevData.adhar = this.data.aadhaarNo;
    this.prevData.location = this.data.location;
    this.prevData.language = this.data.language;
    this.prevData.dob = this.data.dob;
    this.prevData.gender = this.data.gender;
    this.prevData.description=this.data.profileSummary;
    this.prevData.fb=this.currentData.fb;
    this.prevData.linkedin=this.currentData.linkedin;
    this.prevData.blog=this.currentData.blog;
    this.prevData.twitter=this.currentData.twitter;
    this.prevData.grade = this.data.grade!=null ? this.data.grade.slice():null;
    this.prevData.selectedSubjects = this.data.subject!=null ? this.data.subject.slice():null;

    if (this.prevData.dob == "") {
      this.prevData.dob = window.__S.SELECT_DATE;
    }
  }

  initData = () => {

    JBridge.selectSpinnerItem(this.idSet.languageSpinner,this.LanguageArray.indexOf(this.currentData.language[0]));
    var gender = this.currentData.gender != null ? (this.currentData.gender.substr(0,1).toUpperCase()+this.currentData.gender.substr(1)) : null;
    JBridge.selectSpinnerItem(this.idSet.genderSpinner,this.GenderArray.indexOf(gender));
  }

  populateGrade = (items) => {
    console.log("populateGrade", items);
    var itemsListView = (
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        orientation="vertical"
        id={this.idSet.gradeSpinnerContainer}
        margin="0,0,0,17">
          <TextView
           width="match_parent"
           height="wrap_content"
           textAllCaps="true"
           style={window.__TextStyle.textStyle.HINT.SEMI}
           text={window.__S.GRADE}
           padding="4,0,0,0"/>
          <MultiSelectSpinner
            width="match_parent"
            height="wrap_content"
            addLayout={this.getLockIcon(this.idSet.gradeLI,true,"grade",window.__S.GRADE,"8,10,8,6")}
            data={this.GradeArray}
            selectedData={items}
            onItemChange={this.onMultiSelectGradeItemChange}/>
      </LinearLayout>
    );

    this.replaceChild(this.idSet.gradeSpinnerContainer, itemsListView.render(), 0);
  }

  populateSubjects = (items) => {
    console.log("populateGrade", items);

    var itemsListView = (
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        orientation="vertical"
        id={this.idSet.subjectSpinnerContainer}
        margin="0,0,0,17">
          <TextView
           width="match_parent"
           height="20"
           textAllCaps="true"
           style={window.__TextStyle.textStyle.HINT.SEMI}
           text={window.__S.SUBJECTS}
           padding="4,0,0,0"/>
          <MultiSelectSpinner
            width="match_parent"
            height="wrap_content"
            addLayout={this.getLockIcon(this.idSet.subjectsLI,true,"subject",window.__S.SUBJECTS,"8,10,8,6")}
            data={this.subjectDictionary}
            selectedData={items}
            onItemChange={this.onMultiSelectSubjectItemChange}/>
      </LinearLayout>
    );
    this.replaceChild(this.idSet.subjectSpinnerContainer, itemsListView.render(), 0);
  }

  afterRender = () => {
    this.initData();
    this.beforeRender=false;
  }

  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            margin="4,0,0,0"
            height="1"
            background={window.__Colors.PRIMARY_BLACK}/>)
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
            {this.getLockIcon(lockIconId,lockIconVisibility,lockName,label,"8,10,8,6")}
         </LinearLayout>
         {this.getLineSeperator()}
       </LinearLayout>
    )
  }
  getLockIcon =(id,visibility,lockName,label,padding)=>{
    return (<LinearLayout
    height="36"
    width="36"
    id={id}
    visibility={visibility?"visible":"gone"}
    padding={padding||"8,8,8,8"}
    onClick={()=>this.privacyChange(id,lockName,label)}
    alignParentRight="true,-1"
    gravity="right">
      <ImageView
      height="16"
      width="16"
      imageUrl={this.currentData.lockStatus[lockName]=="private"?"ic_action_lock":"ic_action_unlock"}/>
  </LinearLayout>);
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
        {this.getLockIcon(lockIconId,lockIconVisibility,lockName,label,padding)}
        </LinearLayout>
        </RelativeLayout>)
  }

  privacyChange = (id,lockName,label)=>{
    this.currentData.lockStatus[lockName]=this.currentData.lockStatus[lockName]=="public"?"private":"public";
    this.updateSaveButtonStatus(this.checkCompleteStatus());
    console.log("curentlock: ",this.currentData.lockStatus);
    console.log("prevlock: ",this.prevData.lockStatus);

    var tempLayout=( <LinearLayout
      height="36"
      width="36"
      id={id}
      onClick={()=>this.privacyChange(id,lockName,label)}>
        <ImageView
        height="16"
        width="16"
        imageUrl={this.currentData.lockStatus[lockName]=="private"?"ic_action_lock":"ic_action_unlock"}/>
     </LinearLayout>
       );
    this.replaceChild(id,tempLayout.render(), 0);
    if(this.currentData.lockStatus[lockName]=="private"){
      window.__Snackbar.show("Hiding "+label+" from all");
    }else{
      window.__Snackbar.show("Showing "+label+" to all");
    }

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

                  {this.getEditTextView(this.idSet.nameText,window.__S.FIRST_NAME,this.currentData.firstName,window.__S.FIRST_NAME_HINT,false,this.setName,undefined,false,this.idSet.nameLI,"firstName","8,8,8,8")}
                  {this.getEditTextView(this.idSet.lastNameText,window.__S.LAST_NAME,this.currentData.lastName,window.__S.LAST_NAME_HINT,true,this.setLastName,undefined,false,this.idSet.lastNameLI,"lastName","8,8,8,8")}
                  {this.getSingleSelectSpinner(this.idSet.languageSpinnerContainer,window.__S.LANGUAGES,false,this.loadLanguageSpinner,true,this.idSet.languageLI,"language")}
                   <LinearLayout
                   height="wrap_content"
                   width="match_parent"
                   orientation="vertical">

                     <LinearLayout
                      width="match_parent"
                      height="wrap_content"
                      padding="4,0,0,0"
                      orientation="horizontal">
                         <LinearLayout
                         weight="1"
                         height="wrap_content"
                         orientation="vertical">
                             <TextView
                              width="match_parent"
                              height="wrap_content"
                              textAllCaps="true"
                              style={window.__TextStyle.textStyle.HINT.SEMI}
                              text={window.__S.EMAIL_ID}/>
                            <TextView
                              width="wrap_content"
                              weight="1"
                              padding="0,4,0,4"
                              id= {this.idSet.emailText}
                              style={window.__TextStyle.textStyle.CARD.BODY.DARK.FADED}
                              text={this.data.email}/>
                         </LinearLayout>
                         <LinearLayout
                          width="wrap_content"
                          height="wrap_content"
                          padding="0,0,0,0">
                               {this.getLockIcon(this.idSet.emailLI,true,"email",window.__S.EMAIL_ID,"8,16,8,0")}
                         </LinearLayout>
                     </LinearLayout>
                    {this.getLineSeperator()}
                    <LinearLayout
                    width="match_parent"
                    height="18"/>

                    {this.getEditTextView(this.idSet.phoneText,window.__S.PHONE,this.currentData.mobile,window.__S.HINT_MOBILE_NUMBER,false,this.setPhone,"numeric",true,this.idSet.phoneLI,"phone","8,16,8,0")}
                    {this.getEditTextView(this.idSet.descriptionText,window.__S.DESCRIPTION,this.currentData.description,"",true,this.setDescription,undefined,true,this.idSet.descriptionLI,"profileSummary","8,13,8,3")}
                    <LinearLayout
                     width="match_parent"
                     height="wrap_content"
                     orientation="vertical"
                     id={this.idSet.subjectSpinnerContainer}
                     margin="4,0,0,17">
                         <TextView
                          width="match_parent"
                          height="20"
                          style={window.__TextStyle.textStyle.HINT.SEMI}
                          textAllCaps="true"
                          text={window.__S.SUBJECTS}
                          padding ="4,0,4,0"/>
                         <MultiSelectSpinner
                           width="match_parent"
                           height="wrap_content"
                           addLayout={this.getLockIcon(this.idSet.subjectsLI,true,"subject",window.__S.SUBJECTS,"8,10,8,6")}
                           data={this.subjectDictionary}
                           selectedData={this.currentData.selectedSubjects}
                           onItemChange={this.onMultiSelectSubjectItemChange}/>
                    </LinearLayout>
                    {this.getSingleSelectSpinner(this.idSet.spinnerContainer,window.__S.GENDER,true,this.loadGenderSpinner,true,this.idSet.genderLI,"gender")}

                   <LinearLayout
                   width="match_parent"
                   height="wrap_content"
                   orientation="vertical"
                   margin="4,0,0,20">
                       <TextView
                        width="match_parent"
                        height="wrap_content"
                        textAllCaps="true"
                        style={window.__TextStyle.textStyle.HINT.SEMI}
                        text={window.__S.DATE_OF_BIRTH}/>
                        <LinearLayout
                          width="match_parent"
                          height="wrap_content"
                          padding="0,6,0,0">
                              <ImageView
                                height="16"
                                width="16"
                                gravity="center"
                                margin="4,3,7,0"
                                imageUrl="ic_action_calendar_grey"
                                onClick={this.showCalendar}/>
                              <TextView
                                width="match_content"
                                height="wrap_content"
                                id= {this.idSet.dobText}
                                textAllCaps="true"
                                style={window.__TextStyle.textStyle.CARD.BODY.DARK.FADED}
                                text={this.prevData.dob}
                                onClick={this.showCalendar}/>
                                <LinearLayout
                                weight="1"/>
                                {this.getLockIcon(this.idSet.dobLI,true,"dob",window.__S.DATE_OF_BIRTH,"8,4,8,12")}
                        </LinearLayout>
                        {this.getLineSeperator()}
                  </LinearLayout>
                  <LinearLayout
                    width="match_parent"
                    height="wrap_content"
                    orientation="vertical"
                    id={this.idSet.gradeSpinnerContainer}
                    margin="4,0,0,17">
                        <TextView
                         width="match_parent"
                         height="wrap_content"
                         textAllCaps="true"
                         style={window.__TextStyle.textStyle.HINT.SEMI}
                          text={window.__S.GRADE}
                         padding="4,0,0,0"/>
                        <MultiSelectSpinner
                          width="match_parent"
                          height="wrap_content"
                          addLayout={this.getLockIcon(this.idSet.gradeLI,true,"grade",window.__S.GRADE,"8,10,8,6")}
                          data={this.GradeArray}
                          selectedData={this.currentData.grade}
                          onItemChange={this.onMultiSelectGradeItemChange}/>
                  </LinearLayout>
                  {this.getEditTextView(this.idSet.locationText,window.__S.CURRENT_LOCATION,this.currentData.location,"",true,this.setLocation,undefined,true,this.idSet.locationLI,"location","8,13,8,3")}

                  <LinearLayout
                  height="wrap_content"
                  width="match_parent"
                  margin="4,0,0,6"
                  orientation="horizontal">
                      <TextView
                      height="wrap_content"
                      width="wrap_content"
                      style={window.__TextStyle.textStyle.HINT.SEMI}
                      text={window.__S.WEBLINKS}
                      textAllCaps = "true"
                      />
                      <LinearLayout
                      height="0"
                      weight="1"
                      />
                      {this.getLockIcon(this.idSet.webLinksLI,true,"webPages",window.__S.WEBLINKS,"8,0,8,16")}
                  </LinearLayout>
                  {this.getEditTextView(this.idSet.fbText,window.__S.FACEBOOK,this.currentData.fb,"",true,this.setFb,undefined,false,this.idSet.fbLI,"8,8,8,8")}
                  {this.getEditTextView(this.idSet.twitterText,window.__S.TWITTER,this.currentData.twitter,"",true,this.setTwitter,undefined,false,this.idSet.twitterLI,"8,8,8,8")}
                  {this.getEditTextView(this.idSet.linkedinText,window.__S.LINKEDIN,this.currentData.linkedin,"",true,this.setLinkedin,undefined,false,this.idSet.linkedinLI,"8,8,8,8")}
                  {this.getEditTextView(this.idSet.blogText,window.__S.BLOG,this.currentData.blog,"",true,this.setBlog,undefined,false,this.idSet.blogLI,"8,8,8,8")}
           </LinearLayout>
        </LinearLayout>
      </ScrollView>
  </LinearLayout>)
 }

  onMultiSelectGradeItemChange = (selectedArray) => {
    this.currentData.grade = selectedArray;
    console.log(this.currentData.grade , "selectedArray");
    this.updateSaveButtonStatus(this.checkCompleteStatus());
  }
  onMultiSelectSubjectItemChange = (selectedArray) => {
    this.currentData.selectedSubjects = selectedArray;
    console.log(this.currentData.selectedSubjects , "selectedArray");
    this.updateSaveButtonStatus(this.checkCompleteStatus());
  }

  render(){
      console.log("render");
      this.layout=(
        <LinearLayout
          orientation="vertical"
          root="true"
          background={window.__Colors.WHITE}
          width="match_parent"
          height="match_parent">
          <SimpleToolbar
            title={window.__S.PERSONAL_DETAILS}
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

   loadLanguageSpinner = () => {
     return(<Spinner
             width="match_parent"
             height="24"
             style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
             id={this.idSet.languageSpinner}
             onItemClick = {this.handleLanguageSpinnerItemClick}
             values={this.LanguageArray.toString()}/>)
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

  loadGenderSpinner = () => {
    return(<Spinner
            width="match_parent"
            height="24"
            style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
            onItemClick = {this.handleGenderSpinnerItemClick}
            id={this.idSet.genderSpinner}
            values={this.GenderArray.toString()}/>)
  }

  handleGenderSpinnerItemClick = (...params) => {
    console.log(params[2]," loadGenderSpinner");
       if(params[2]>0)
       {
         this.currentData.gender=this.GenderArray[params[2]]
       }
       else{
         this.currentData.gender="";
       }
       this.updateSaveButtonStatus(this.checkCompleteStatus());
  }

  showCalendar = () =>{
    var _this = this;
    var today = new Date();
    var maxDate = (today.getFullYear()-18)+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var selectedDate = (this.currentData.dob!=undefined && this.currentData.dob!="")?this.currentData.dob:maxDate;
    var minDate = (today.getFullYear()-128)+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var callback = callbackMapper.map(
      function (data){

            data[0]=_this.formatDate(data[0]);
            _this.currentData.dob=data[0];

              var cmd = _this.set({
                id: _this.idSet.dobText,
                text: data[0],
                style: window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK
              });
              Android.runInUI(cmd, 0);
              _this.updateSaveButtonStatus(_this.checkCompleteStatus());});

      console.log("current date ",selectedDate);
      JBridge.showCalender(callback,minDate,maxDate,selectedDate);
  }

  formatDate = (date) =>{
    date = date.substr(0,4)+"-"+date.substr(5);
    if(date.charAt(7)!='/'){
       date = date.substr(0,5)+"0"+date.substr(5);
     }
    date = date.substr(0,7)+"-"+date.substr(8);
    if(date.length<10)
      date = date.substr(0,8)+"0"+date.substr(8);
      return date;
    }

  onBackPressed = () => {
    var whatToSend = []
    var event = { tag: "BACK_AdditionalInformationActivity", contents: whatToSend};
    window.__runDuiCallback(event);
  }

  arrayEquals = (array1,array2) => {
    if(array1.length!=array2.length){
       return false;
    }

    var i=0
    for(i=0;i<array1.length;i++){
      if(array2.indexOf(array1[i])<0){
           return false;
      }
    }
    return true;
  }

  checkEmailFormat = (data) =>{
    if(!(data.indexOf("@") !== -1) || !(data.indexOf(".") !== -1)){
        return false;
    }
    return true;
  }

  checkPhoneFormat = (data) =>{
    if(data.length == 10 && /^\d+$/.test(data)){
       return true;
  }
    return false;
  }

  checkAdharFormat = (data) =>{
    if(data.length == 12 && /^\d+$/.test(data)){
       return true
    }
    return false;
  }

  getJSONtoSend = () => {
    var json = {};
    if(this.currentData.firstName != this.prevData.firstName)
       json.firstName=this.currentData.firstName;
    else
       delete json.name;

    if(!this.arrayEquals(this.currentData.language, this.prevData.language))
       json.language=this.currentData.language;
    else
      delete json.language;

    if(this.currentData.email != this.prevData.email && this.checkEmailFormat(this.currentData.email))
        json.email=this.currentData.email;

    else if(this.currentData.email == this.prevData.email)
      delete json.email;
    else {
      window.__Snackbar.show(window.__S.ERROR_EMAIL_FORMAT)
      return;
    }

    if(this.currentData.mobile != this.prevData.mobile &&  this.checkPhoneFormat(this.currentData.mobile))
        json.phone=this.currentData.mobile;
    else if(this.currentData.mobile == this.prevData.mobile)
      delete json.phone;
    else {
      window.__Snackbar.show(window.__S.ERROR_SHORT_MOBILE)
      return;
    }

    if(this.currentData.location!=this.prevData.location)
       json.location=this.currentData.location;
    else
       delete json.location;

    // if(this.currentData.adhar!=null){
    //   if(this.checkAdharFormat(this.currentData.adhar)){
    //        json.aadhaarNo=this.currentData.adhar;
    //   }
    //   else {
    //     window.__Snackbar.show(window.__S.ERROR_INVALID_AADHAAR)
    //     return;
    //   }
    // }
    // else{
    //   delete json.aadhaarNo;
    // }
    if(this.currentData.lastName!=this.prevData.lastName)
       json.lastName= this.currentData.lastName;
    else
      delete json.lastName;

    if(this.currentData.dob!=this.prevData.dob){
      if (!(this.prevData.dob == window.__S.SELECT_DATE && this.currentData.dob == "")) {
        json.dob = this.currentData.dob;
      }
    } else
      delete json.dob;

    if(!this.arrayEquals(this.currentData.grade,this.prevData.grade) )
      json.grade=this.currentData.grade;
    else
      delete json.grade;

    if(this.currentData.gender!=this.prevData.gender)
      json.gender=this.currentData.gender.toLowerCase();
    else
      delete json.gender;

    if(! this.arrayEquals(this.currentData.selectedSubjects,this.prevData.selectedSubjects))
      json.subject= this.currentData.selectedSubjects;
    else
      delete json.subject;

    if(this.currentData.description != this.prevData.description)
      json.profileSummary = this.currentData.description;
    else
      delete json.profileSummary;

    json.webPages=[];

    if(this.currentData.fb!="")
      {
           var obj={
            "type":"fb",
            "url": this.currentData.fb}
            json.webPages.push(obj);
      }
   if(this.currentData.twitter!="")
      {
           var obj={
            "type":"twitter",
            "url": this.currentData.twitter}
            json.webPages.push(obj);
      }
   if(this.currentData.linkedin!="")
      {
           var obj={
            "type":"in",
            "url": this.currentData.linkedin}
            json.webPages.push(obj);
      }
   if(this.currentData.blog!="")
      {
        var obj={
         "type":"blog",
         "url": this.currentData.blog}
         json.webPages.push(obj);
      }
   json.userId=window.__userToken;
   return json;
 }

  handleSaveClick =()=>{
    if(!JBridge.isNetworkAvailable()){
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
    }else if(!this.checkCompleteStatus()){
      window.__Snackbar.show(window.__S.NO_CHANGE);
    }else{
      window.__LoaderDialog.show();
      this.handleSaveClickBody();
      window.__LoaderDialog.hide();
    }
  }

  handleSaveClickBody = () => {
    var _this=this;
    var json=  {};
   var json = this.getJSONtoSend();
   var url=window.__apiUrl + "/api/user/v1/update"

   var body = {
             "id":"unique API ID",
             "ts":"response timestamp YYYY-MM-DDThh:mm:ss+/-nn:nn (timezone defaulted to +5.30)",
               "params": {},
             "request":json
             }
  console.log(JSON.stringify(body),"sendingJson");
  this.responseCame=false;
  if(JBridge.isNetworkAvailable()){
   if(!this.checkProfileSameData()){
            JBridge.patchApi(url,JSON.stringify(body),window.__user_accessToken,window.__apiToken);
            window.__LoaderDialog.show();

           setTimeout(() => {
               if(this.responseCame){
                 return;
               }
               window.__Snackbar.show(window.__S.ERROR_SERVER_CONNECTION);
               window.__LoaderDialog.hide();
               this.responseCame=false;
           },window.__API_TIMEOUT);
      }
      else if(!this.checkPrivacySameData()){
        console.log("privacy api calling");
           this.privacyStatusApiCall();
      }
    }else {
   window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
 }
}

getPatchCallback = (data) => {
  data = JSON.parse(data);
  if (this.responseCame) {
    return;
  }

  window.__LoaderDialog.hide();
  this.responseCame = true;
  console.log(data)
  if (data.result.response == "SUCCESS") {
    window.__Snackbar.show(window.__S.PROFILE_UPDATE_SUCCESS);
    if (!this.checkPrivacySameData()) {
      console.log("making privacy call");
      this.privacyStatusApiCall();
    }
    else {
      // window.__BNavFlowRestart();
      window.__changePureScriptFlow();
      // this.onBackPressed();
    }
  } else {
    window.__Snackbar.show(data.params.errmsg ? data.params.errmsg : window.__S.PROFILE_UPDATE_FAILED);
  }
}

privacyStatusApiCall = () => {
    var fields=["email","location","phone" ,"language","dob","gender","profileSummary","grade","subject","webPages"];
    var publicArray=[];
    var privateArray=[];

    fields.map((item)=>{
       if(this.prevData.lockStatus[item]!=this.currentData.lockStatus[item])
       {
           if(this.currentData.lockStatus[item]=="private")
              privateArray.push(item);
           else
              publicArray.push(item);
       }
    })

    console.log(privateArray , "private");
    console.log(publicArray , "public");

    var whatToSend = {
      user_token : window.__user_accessToken,
      api_token : window.__apiToken,
      request:{ userId: window.__userToken }
    }
   if(privateArray.length>0)
       whatToSend.request['private']=privateArray;

   if(publicArray.length>0)
      whatToSend.request['public']=publicArray;

    console.log("whatToSend",whatToSend);
    whatToSend.request=JSON.stringify(whatToSend.request);
    var event = { tag: "API_ProfileVisibility", contents: whatToSend }
    window.__runDuiCallback(event);
  }

  handleStateChange = (state) =>{
    var res = utils.processResponse(state);
    if(res.code!=504){
        var response = res.data;
        console.log(res, "response details------>")
        var responseCode = res.code;

        if(responseCode == "200"){
          // window.__BNavFlowRestart();
          window.__changePureScriptFlow();
          // this.onBackPressed();
        } else {
          window.__LoaderDialog.hide();
          window.__Snackbar.show("failed");
        }

    }else{
      window.__LoaderDialog.hide();
      window.__Snackbar.show(window.__S.TIME_OUT)
    }
  }

  checkCompleteStatus = () =>{
     console.log("checkSameData",this.checkSameData());
    if(this.currentData.firstName==null || this.currentData.language==null || this.currentData.mobile==null || this.checkSameData())
      {
      return false;
      }
    return true;
  }

  checkSameData = () =>{
    if(this.checkProfileSameData() && this.checkPrivacySameData())
      return true;
    return false;
  }

  checkProfileSameData = () => {
    if(this.currentData.firstName == this.prevData.firstName
       && this.currentData.lastName == this.prevData.lastName
       && JSON.stringify(this.currentData.language) == JSON.stringify(this.prevData.language)
       && this.currentData.email == this.prevData.email
       && this.currentData.mobile == this.prevData.mobile
       && this.currentData.description == this.prevData.description
       && this.currentData.dob == this.prevData.dob
       && this.currentData.location == this.prevData.location
       && this.currentData.fb==this.prevData.fb
       && this.currentData.linkedin==this.prevData.linkedin
       && this.currentData.twitter==this.prevData.twitter
       && this.currentData.blog == this.prevData.blog
       && (this.currentData.gender == this.prevData.gender || (this.currentData.gender && this.prevData.gender && this.currentData.gender.toLowerCase() == this.prevData.gender.toLowerCase()))
       && this.arrayEquals(this.currentData.grade,this.prevData.grade)
       && this.arrayEquals(this.currentData.selectedSubjects,this.prevData.selectedSubjects) ){
               return true;
      }
      return false;
  }

  checkPrivacySameData = () => {
    if(JSON.stringify(this.prevData.lockStatus)==JSON.stringify(this.currentData.lockStatus) ){
      console.log(this.prevData.lockStatus + " locks "+this.currentData.lockStatus);
            return true;
   }
   return false;
  }

  updateSaveButtonStatus = (enabled) => {
    var alphaVal;
    var isClickable;

   if(!this.beforeRender){
        if (enabled ) {
          alphaVal="1"
          isClickable = "true"
        } else {
          alphaVal="0.5"
          isClickable = "false"
        }
        console.log("clickable",isClickable);
        var cmd = this.set({
          id: this.idSet.saveButton,
          clickable: isClickable,
          alpha : alphaVal
        })


        Android.runInUI(cmd, 0);
    }
  }

  setName = (data) =>{
    this.currentData.firstName= data;
    this.updateSaveButtonStatus(this.checkCompleteStatus());
  }

  setLastName = (data) =>{
    this.currentData.lastName= data;
    this.updateSaveButtonStatus(this.checkCompleteStatus());
  }

  setEmail = (data) =>{
    this.currentData.email=data;
    this.updateSaveButtonStatus(this.checkCompleteStatus());

  }
  setPhone = (data) =>{
    this.currentData.mobile=data;
    this.updateSaveButtonStatus(this.checkCompleteStatus());
  }

  setAdhar= (data) => {
    this.currentData.adhar=data;
    this.updateSaveButtonStatus(this.checkCompleteStatus());
  }

  setLocation = (data) => {
    this.currentData.location=data;
    this.updateSaveButtonStatus(this.checkCompleteStatus());
  }

  setDescription = (data)=>{
    this.currentData.description=data;
    this.updateSaveButtonStatus(this.checkCompleteStatus());
  }

   setFb = (data)=>{
    this.currentData.fb= data;
    this.updateSaveButtonStatus(this.checkCompleteStatus());
  }

   setTwitter = (data)=>{
    this.currentData.twitter= data;
    this.updateSaveButtonStatus(this.checkCompleteStatus());
  }

   setLinkedin = (data)=>{
    this.currentData.linkedin= data;
    this.updateSaveButtonStatus(this.checkCompleteStatus());
  }


  setBlog= (data)=>{
   this.currentData.blog=data;
   this.updateSaveButtonStatus(this.checkCompleteStatus());
 }
}
module.exports = Connector(AdditionalInformationActivity);
