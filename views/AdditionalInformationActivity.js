var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var TextInputView = require('../components/Sunbird/core/TextInputView');
var FeatureButton = require('../components/Sunbird/FeatureButton');
var Spinner = require('../components/Sunbird/core/Spinner');
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var ProfileHeader = require('../components/Sunbird/ProfileHeader');
var ComingSoonComponent = require('../components/Sunbird/ComingSoonComponent');
var PersonalDetails = require('../components/Sunbird/PersonalDetails');
var ProfileExperiences = require('../components/Sunbird/ProfileExperiences');
var ProfileSkillTags = require('../components/Sunbird/ProfileSkillTags');
var ProfileAccomplishments = require('../components/Sunbird/ProfileAccomplishments');
var ProfileCreations = require('../components/Sunbird/ProfileCreations');
var ProfileBadges = require('../components/Sunbird/ProfileBadges');
var ProfileAdditionalInfo = require('../components/Sunbird/ProfileAdditionalInfo');
var MultiSelectSpinner = require('../components/Sunbird/MultiSelectSpinner');
var Styles = require("../res/Styles");
var PageOption = require('../components/Sunbird/core/PageOption')

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
      "descriptionText"
    ]);
    this.shouldCacheScreen = false;
    this.state=state;
    this.screenName="AdditionalInformationActivity"
    this.subjectDictionary=["Select","Assamese","Bengali","English","Gujarati","Hindi","Kannada","Malayalam","Marathi","Maths","Nepali","Oriya","Punjabi","Tamil","Telugu","Urdu"];
    this.selectedSubjects=[];
    //this.hobbieDictionary=["cycling","swimming","singing","travelling","playing","dancing"];
    //this.selectedHobbies=[];
    this.email = null;
    this.mobile = null;
    this.location = null;
    this.grade=null;
    this.name= null;
    this.lastName=null;
    this.language=null;
    this.adhar=null;
    this.gender=null;
    this.dob=null;
    this.description=null;
    this.responseCame=false;

    this.prevData={};
    this.prevData.description=null;

    this.genderArray= "Select,Male,Female,Transgender";
    this.GenderArray=["Select","Male","Female","Transgender"];
    this.languageArray= "Select,Assamese,Bengali,English,Gujarati,Hindi,Kannada,Marathi,Punjabi,Tamil,Telugu";
    this.LanguageArray=["Select","Assamese","Bengali","English","Gujarati","Hindi","Kannada","Marathi","Punjabi","Tamil","Telugu"]
    this.gradeArray= "Select,Kindergarten,Grade 1,Grade 2,Grade 3,Grade 4,Grade 5,Grade 6,Grade 7";
    this.GradeArray=["Select","Kindergarten","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7"];

    this.data = JSON.parse(this.state.data.value0.profile);
    console.log("Info State", this.data);

    this.saveBtnState = {
      text : window.__S.SAVE,
      id : this.idSet.saveButton,
      isClickable : "false",
      onClick :  this.handleSaveClick,
      alpha : "0.5"
    }
  }


  initData = () => {

    console.log(this.data, "jsontosens");
    window.__patchCallback = this.getPatchCallback ;
    this.email = this.data.email;
    this.mobile = this.data.phone;
    this.name = this.data.firstName;
    this.lastName = this.data.lastName;
    this.adhar = this.data.aadhaarNo;
    this.location = this.data.location;
    this.language = this.data.language;
    this.dob = this.data.dob;
    this.gender = this.data.gender;
    this.description=this.data.profileSummary;
    this.grade=this.data.grade!=null ? this.data.grade.slice():null;
    this.selectedSubjects = this.data.subject!=null ? this.data.subject.slice():null;

    this.prevData.email = this.data.email;
    this.prevData.mobile = this.data.phone;
    this.prevData.name = this.data.firstName;
    this.prevData.lastName = this.data.lastName;
    this.prevData.adhar = this.data.aadhaarNo;
    this.prevData.location = this.data.location;
    this.prevData.language = this.data.language;
    this.prevData.dob = this.data.dob;
    this.prevData.gender = this.data.gender;
    this.prevData.description=this.data.profileSummary;
    this.prevData.grade = this.data.grade!=null ? this.data.grade.slice():null;
    this.prevData.selectedSubjects = this.data.subject!=null ? this.data.subject.slice():null;


    var cmd = this.set({
      id: this.idSet.emailText,
      text: this.email
    })

    cmd += this.set({
      id: this.idSet.phoneText,
      text: this.mobile
    })

    cmd += this.set({
      id: this.idSet.locationText,
      text: this.location
    })

    cmd += this.set({
      id: this.idSet.nameText,
      text: this.name
    })

    cmd += this.set({
      id: this.idSet.lastNameText,
      text: this.lastName
    })

    cmd += this.set({
      id: this.idSet.dobText,
      text: this.dob
    })

    cmd += this.set({
      id: this.idSet.adharText,
      text: this.adhar
    })

    cmd += this.set({
      id: this.idSet.descriptionText,
      text: this.description
    })

    Android.runInUI(cmd, 0);


    this.populateSubjects(this.data.subject);

    this.populateGrade(this.data.grade);

    JBridge.selectSpinnerItem(this.idSet.languageSpinner,this.LanguageArray.indexOf(this.language[0]));
    var gender = this.gender != null ? (this.gender.substr(0,1).toUpperCase()+this.gender.substr(1)) : null;
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
           style={window.__TextStyle.textStyle.HINT.SEMI}
           text={window.__S.GRADE}
           margin="0,0,0,8"
           padding="4,0,0,0"/>
          <MultiSelectSpinner
            width="match_parent"
            height="wrap_content"
            data={this.GradeArray}
            selectedData={items}
            onItemChange={this.onMultiSelectGradeItemChange}
           />
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
           style={window.__TextStyle.textStyle.HINT.SEMI}
           text={window.__S.SUBJECTS}
           margin="0,0,0,8"
           padding="4,0,0,0"/>
          <MultiSelectSpinner
            width="match_parent"
            height="wrap_content"
            data={this.subjectDictionary}
            selectedData={items}
            onItemChange={this.onMultiSelectSubjectItemChange}
           />
      </LinearLayout>
    );

    this.replaceChild(this.idSet.subjectSpinnerContainer, itemsListView.render(), 0);
  }


  afterRender = () => {
    this.initData();
    this.updateSaveButtonStatus(this.checkCompleteStatus());
  }

  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="2"
            margin="0,0,0,0"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  getButtons = () => {
      var buttonList = [this.saveBtnState];
    return (
      <LinearLayout
        width = "match_parent"
        height = "wrap_content"
        visibility = {"visible"}>
        <PageOption
            width="match_parent"
            buttonItems={buttonList}
            hideDivider={false}/>
      </LinearLayout>
    );
  }


  getBtn = (id, type, label, onClick, visibility) => {
    return (
      <LinearLayout
        width = "0"
        weight = "1"
        height = "wrap_content"
        visibility = {visibility}
        margin = "0, 0, 16, 0">
        <FeatureButton
          weight = "1"
          id = {id}
          clickable="false"
          width = "match_parent"
          height = "match_parent"
          stroke = {type == "pos" ? "1," + window.__Colors.WHITE : "3," + window.__Colors.PRIMARY_DARK}
          background = {type == "pos" ? window.__Colors.PRIMARY_DARK : window.__Colors.WHITE}
          text = {label}
          buttonClick = {onClick}
          textColor = {type == "pos" ? window.__Colors.WHITE : window.__Colors.PRIMARY_DARK}
          textStyle = {window.__TextStyle.textStyle.CARD.ACTION.LIGHT}/>
      </LinearLayout>
    );
  }

  getTail = () => {
    return (
      <LinearLayout
        width = "match_parent"
        height = "wrap_content"
        orientation = "vertical"
        background = "#ffffff"
        alignParentBottom = "true, -1">
        <LinearLayout
          width = "match_parent"
          height = "match_parent"
          orientation = "horizontal">
          {this.getButtons()}
        </LinearLayout>
      </LinearLayout>
    );
  }

  getSingleSelectSpinner = (id,label,optional,callSpinner) => {
    return(
      <LinearLayout
      width="match_parent"
      height="wrap_content"
      orientation="vertical"
      margin="0,0,0,17">
         {this.getLabel(label,optional)}
         <LinearLayout
           width="match_parent"
           height="wrap_content"
           stroke={"2,"+window.__Colors.PRIMARY_BLACK_66}
           padding="0,8,8,8"
           margin="4,0,4,4"
           cornerRadius="4,4,4,4"
           id={id}>
            {callSpinner()}
         </LinearLayout>
       </LinearLayout>
    )
  }

  getEditTextView = (id, label, hint , optional , onChange, inputType) =>{
    return(
      <TextInputView
        id = {id}
        height="wrap_content"
        width="match_parent"
        hintText={hint + (optional ? " (Optional)" : "")}
        labelText={label}
        mandatory = {optional ? "false" : "true"}
        margin = "0,0,0,18"
        _onChange={onChange}
        text = ""
        textStyle = {window.__TextStyle.textStyle.HINT.SEMI}
        editTextStyle = {window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
        inputType = {inputType ? inputType : "text"}/>
    )
  }

  getLabel = (label,optional) =>{
     if(optional)
         return(
           <TextView
          width="match_parent"
          height="wrap_content"
          style={window.__TextStyle.textStyle.HINT.SEMI}
          text={label}
          margin="0,0,0,8"
          padding="4,0,0,4"/>
         );

     return (
       <LinearLayout
       height="wrap_content"
       width="wrap_content"
       orientation="horizontal"
       margin ="0,0,0,8"
       padding="4,0,0,4">
       <TextView
        width="match_parent"
        height="wrap_content"
        style={window.__TextStyle.textStyle.HINT.SEMI}
        text={label}/>
       <TextView
       height="wrap_content"
       width="wrap_content"
       text=" *"
       color="#FF0000"/>
       </LinearLayout>
     );
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
        padding="15,15,15,15"
        orientation="vertical">


                  {this.getEditTextView(this.idSet.nameText,window.__S.FIRST_NAME,window.__S.FIRST_NAME_HINT,false,this.setName)}
                  {this.getEditTextView(this.idSet.lastNameText,window.__S.LAST_NAME,window.__S.LAST_NAME_HINT,true,this.setLastName)}
                  {this.getSingleSelectSpinner(this.idSet.languageSpinnerContainer,window.__S.LANGUAGES,false,this.loadLanguageSpinner)}

                {//  <TextView
                //   width="match_parent"
                //   height="20"
                //   style={window.__TextStyle.textStyle.HINT.BOLD}
                //   text="SUBJECTS"
                //   margin="4,0,0,0"/>
                //   <EditText
                //   width="match_parent"
                //   height="wrap_content"
                //   maxLines="1"
                //   style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
                //   onChange={this.getLanguagePredictions}
                //   hint="Start typing to add a subject"
                //   />
              }

                   <LinearLayout
                   height="wrap_content"
                   width="match_parent"
                   orientation="vertical">

                       {this.getEditTextView(this.idSet.emailText,window.__S.EMAIL_ID,window.__S.HINT_EMAIL_ID,false,this.setEmail)}
                       {this.getEditTextView(this.idSet.phoneText,window.__S.PHONE,window.__S.HINT_MOBILE_NUMBER,false,this.setPhone,"number")}
                       {this.getEditTextView(this.idSet.descriptionText,window.__S.DESCRIPTION,"",true,this.setDescription)}
                       <LinearLayout
                         width="match_parent"
                         height="wrap_content"
                         orientation="vertical"
                         id={this.idSet.subjectSpinnerContainer}
                         margin="0,0,0,17">
                           <TextView
                            width="match_parent"
                            height="20"
                            style={window.__TextStyle.textStyle.HINT.SEMI}
                            text={window.__S.SUBJECTS}
                            margin="0,0,0,8"
                            padding ="4,0,4,0"/>
                           <MultiSelectSpinner
                             width="match_parent"
                             height="wrap_content"
                             data={this.subjectDictionary}
                             selectedData={this.selectedSubjects}
                             onItemChange={this.onMultiSelectSubjectItemChange}
                            />
                       </LinearLayout>
                       {this.getSingleSelectSpinner(this.idSet.spinnerContainer,window.__S.GENDER,true,this.loadGenderSpinner)}

                       <LinearLayout
                       width="match_parent"
                       height="wrap_content"
                       orientation="vertical"
                       margin="4,0,0,17">
                         <TextView
                          width="match_parent"
                          height="wrap_content"
                          style={window.__TextStyle.textStyle.HINT.SEMI}
                          text={window.__S.DATE_OF_BIRTH}/>
                          <LinearLayout
                            width="match_parent"
                            height="wrap_content"
                            padding="0,6,12,12">

                              <ImageView
                                height="16"
                                width="16"
                                gravity="center"
                                margin="4,3,7,0"
                                imageUrl="ic_action_calendar_grey"
                                onClick={this.showCalendar}/>

                              <TextView
                                width="match_parent"
                                height="wrap_content"
                                id= {this.idSet.dobText}
                                style={window.__TextStyle.textStyle.CARD.BODY.DARK.FADED}
                                text={window.__S.SELECT_DATE}
                                onClick={this.showCalendar}/>
                          </LinearLayout>
                          <LinearLayout
                            width="match_parent"
                            height="1"
                            margin="1,0,2,0"
                            alpha="0.6"
                            background={window.__Colors.PRIMARY_BLACK}/>
                        </LinearLayout>
                        {this.getEditTextView(this.idSet.adharText,"ADHAR NUMBER","",true,this.setAdhar,"number")}
                        <LinearLayout
                          width="match_parent"
                          height="wrap_content"
                          orientation="vertical"
                          id={this.idSet.gradeSpinnerContainer}
                          margin="0,0,0,17">
                            <TextView
                             width="match_parent"
                             height="wrap_content"
                             style={window.__TextStyle.textStyle.HINT.SEMI}
                             text={window.__S.GRADE}
                             margin="0,0,0,8"
                             padding="4,0,0,0"/>
                            <MultiSelectSpinner
                              width="match_parent"
                              height="wrap_content"
                              data={this.GradeArray}
                              selectedData={this.grade}
                              onItemChange={this.onMultiSelectGradeItemChange}
                             />
                        </LinearLayout>



                         {
                          // <LinearLayout
                          // width="match_parent"
                          // height="wrap_content"
                          // orientation="vertical">
                          //   <TextView
                          //    width="match_parent"
                          //    height="20"
                          //    style={window.__TextStyle.textStyle.HINT.BOLD}
                          //    text="HOBBIES"/>
                          //    <LinearLayout
                          //    height="8"
                          //    orientation="horizontal"
                          //    width="match_parent"
                          //    />
                          //    <EditText
                          //    width="match_parent"
                          //    height="wrap_content"
                          //    maxLines="1"
                          //    style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
                          //    hint="Start typing to add a hobby"
                          //    onChange={this.getHobbiePredictions}
                          //    />
                          //    <RelativeLayout
                          //     width="match_parent"
                          //     height="wrap_content">
                          //         <LinearLayout
                          //         height="wrap_content"
                          //         width="wrap_content"
                          //         orientation="horizontal"
                          //         id={this.idSet.HobbiesLayout}
                          //         margin="0,4,0,8"/>
                          //
                          //         <LinearLayout
                          //         height="wrap_content"
                          //         width="328"
                          //         background={window.__Colors.PRIMARY_BLACK_22}>
                          //            <ScrollView
                          //            height="wrap_content"
                          //            width="match_parent"
                          //            margin="2,0,2,0">
                          //                <LinearLayout
                          //                height="wrap_content"
                          //                width="match_parent"
                          //                margin="2,0,2,0"
                          //                id={this.idSet.predictionHobbiesLayout}
                          //                background="#ffffff">
                          //                </LinearLayout>
                          //            </ScrollView>
                          //         </LinearLayout>
                          //
                          //    </RelativeLayout>
                          //
                          //  </LinearLayout>
                         }
                    </LinearLayout>



        </LinearLayout>
       </ScrollView>
      </LinearLayout>
    )
  }

  getBack = () => {
    return (
      <ImageView
      margin="0,0,10,0"
      style={IconStyle}
      height="48"
      width="48"
      onClick={this.onBackPressed}
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
                  background={window.__Colors.WHITE}
                  text={window.__S.EDIT + " "+ window.__S.PROFILE_BNAV}
                  style={window.__TextStyle.textStyle.TOOLBAR.HEADING}/>

          </LinearLayout>);

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

  onMultiSelectGradeItemChange = (selectedArray) => {
    this.grade = selectedArray;
    console.log(this.grade , "selectedArray");
    this.updateSaveButtonStatus(this.checkCompleteStatus());
  }

  onMultiSelectSubjectItemChange = (selectedArray) => {
    this.selectedSubjects = selectedArray;
    console.log(this.selectedSubjects , "selectedArray");
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

           {this.getToolbar()}
           <RelativeLayout
           width="match_parent"
           height="match_parent">
               {this.getBody()}
               {this.getTail()}
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
             margin="0,0,5,6"
             id={this.idSet.languageSpinner}
             onItemClick = {this.handleLanguageSpinnerItemClick}
             values={this.languageArray}
             />)
   }

   handleLanguageSpinnerItemClick = (...params) => {
        console.log(params[2]);

        if(params[2]>0)
        {this.language=[this.LanguageArray[params[2]]]
        this.updateSaveButtonStatus(this.checkCompleteStatus());}
   }

  loadGenderSpinner = () => {
    return(<Spinner
            width="match_parent"
            height="24"
            style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
            margin="0,0,5,6"
            onItemClick = {this.handleGenderSpinnerItemClick}
            id={this.idSet.genderSpinner}
            values={this.genderArray}
            />)
  }

  handleGenderSpinnerItemClick = (...params) => {
       if(params[2]>0)
       {this.gender=this.GenderArray[params[2]]
       this.updateSaveButtonStatus(this.checkCompleteStatus());}
  }

  showCalendar = () =>{
    var _this = this;
    var callback = callbackMapper.map(
      function (data){

            data[0]=_this.formatDate(data[0]);
             _this.dob=data[0];

              var cmd = _this.set({
                id: _this.idSet.dobText,
                text: data[0],
                style: window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK
              });
              Android.runInUI(cmd, 0);

              _this.updateSaveButtonStatus(_this.checkCompleteStatus());

    });


      JBridge.showCalender(callback,"","","");

  }

  formatDate = (date) =>{
      date = date.substr(0,4)+"-"+date.substr(5);
      if(date.charAt(7)!='-'){
         date = date.substr(0,5)+"0"+date.substr(5);
       }

      date = date.substr(0,7)+"-"+date.substr(8);
      if(date.length<10)
        date = date.substr(0,8)+"0"+date.substr(8);
        return date;

      }


  getLanguagePredictions = (data) => {

    console.log(this.subjectDictionary, " subjectDictionarycitionary");
    data=data.toLowerCase();
      var predictions=[];
      var i;

      if(data!=""){
         for(i=0; i < this.subjectDictionary.length;i++)
         {
           if(this.subjectDictionary[i].startsWith(data))
              predictions.unshift(this.subjectDictionary[i]);
         }
         console.log(predictions, "LangPredi");
         if(predictions!=[])
         this.populateLanguagePredictions(predictions,data);
     }
     else {
       {
         this.predictLanguageLayout =(<LinearLayout
            height="wrap_content"
            width="wrap_content"/>);

         this.replaceChild(this.idSet.predictionLanguageLayout, this.predictLanguageLayout.render(), 0);
       }
     }

  }

  populateLanguagePredictions = (predictions,data) =>{

    var predictionContent = predictions.map((item) => {
      return (this.getLanguagePredictionCard(item))
    });

    var addDictionaryString="Add \"String\"";
    addDictionaryString = addDictionaryString.replace("String", data);
    this.predictLanguageLayout =(<LinearLayout
       height="match_parent"
       width="wrap_content"
       orientation="vertical"
       margin="16,0,16,0">

         {predictionContent}
         <LinearLayout
         height="match_parent"
         width="match_parent">
           <TextView
            height="wrap_content"
            width="match_parent"
            padding="16,17,0,17"
            textSize="15"
            onClick={()=>{this.addLanguageItem(data)}}
            text={addDictionaryString}
            textColor="#FF333333"/>
         </LinearLayout>
         <LinearLayout
         height="3"
         width="328"
         background="#E0E0E0">
         </LinearLayout>
       </LinearLayout>);

    this.replaceChild(this.idSet.predictionLanguageLayout, this.predictLanguageLayout.render(), 0);

  }

  getLanguagePredictionCard = (item)=>{
    console.log(item, "iitm")
    return (
      <LinearLayout
      height="wrap_content"
      width="match_parent"

      orientation="vertical">
          <TextView
           height="wrap_content"
           width="match_parent"
           padding="16,17,0,17"
           textSize="15"
           onClick={()=>{this.selectLanguageItem(item)}}
           text= {item}
           textColor="#FF333333"
          />
          <LinearLayout
          height="1"
          width="328"
          background={window.__Colors.PRIMARY_BLACK_66}>
          </LinearLayout>
      </LinearLayout>
    );
  }

  selectLanguageItem =(data) =>{
    console.log(data, "selectItem");
    var index=this.subjectDictionary.indexOf(data);
    if(index >-1){
      JBridge.hideKeyboard();

      this.predictLanguageLayout =(<LinearLayout
         height="wrap_content"
         width="wrap_content"/>);

      this.replaceChild(this.idSet.predictionLanguageLayout, this.predictLanguageLayout.render(), 0);

     this.subjectDictionary.splice(index,1);
     this.selectedSubjects.unshift(data);


     var skills = this.selectedSubjects.map((item) => {
       return (this.languageItemLayout(item));
     });

    console.log(this.selectedSubjects," skiilhere");
    this.updatedLanguages=(
      <HorizontalScrollView
      height="wrap_content"
      width="match_parent">
          <LinearLayout
          height="match_parent"
          width="match_parent"
          orientation="horizontal">
             {skills}
          </LinearLayout>
    </HorizontalScrollView>);

      this.replaceChild(this.idSet.LanguageLayout,this.updatedLanguages.render(),0);
      this.updateSaveButtonStatus(this.checkCompleteStatus());

   }

  }

  addLanguageItem = (data) =>{
    if(this.subjectDictionary.indexOf(data)==-1 && this.selectedSubjects.indexOf(data)==-1)
    {
      this.subjectDictionary.unshift(data);
      this.selectLanguageItem(data);
    }
    else {
      JBridge.hideKeyboard();
      JBridge.showSnackBar("Language Already Added");
    }
  }




  languageItemLayout = (item)=> {
    return (
      <LinearLayout
         height="wrap_content"
         width="wrap_content"
         padding="6,4,6,4"
         margin="0,0,10,0"
         cornerRadius="10,10,10,10"
         background={window.__Colors.DARK_GRAY_44}
         gravity="center">

          <TextView
            height="wrap_content"
            width="wrap_content"
            text={item}
            margin="0,0,4,0"
            textStyle={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>

          <ImageView
            height="15"
            width="15"
            imageUrl="ic_action_close"
            margin="0,1,0,0"
            onClick={()=>{this.removeLanguage(item)}}
            />
       </LinearLayout>
      );
  }

  removeLanguage= (item) =>{
    var index= this.selectedSubjects.indexOf(item);
    if(index>-1){
      this.selectedSubjects.splice(index,1);
      this.subjectDictionary.unshift(item);

      var languages = this.selectedSubjects.map((data) => {
        return (this.languageItemLayout(data));
      });

      console.log(this.selectedSubjects," skiilll");
      this.updatedLanguages=(
        <HorizontalScrollView
        height="wrap_content"
        width="match_parent">
           <LinearLayout
           height="match_parent"
           width="match_parent"
           orientation="horizontal">
              {languages}
           </LinearLayout>
         </HorizontalScrollView>)


       this.replaceChild(this.idSet.LanguageLayout,this.updatedLanguages.render(),0);
       this.updateSaveButtonStatus(this.checkCompleteStatus());

    }
  }

  getHobbiePredictions = (data) => {

    console.log(this.hobbieDictionary, " hobbieDictionary");
    data=data.toLowerCase();
      var predictions=[];
      var i;

      if(data!=""){
         for(i=0; i < this.hobbieDictionary.length;i++)
         {
           if(this.hobbieDictionary[i].startsWith(data))
              predictions.unshift(this.hobbieDictionary[i]);
         }
         console.log(predictions, "HobbPredi");
         if(predictions!=[])
         this.populateHobbiePredictions(predictions,data);
     }
     else {
       {
         this.predictHobbieLayout =(<LinearLayout
            height="wrap_content"
            width="wrap_content"/>);

         this.replaceChild(this.idSet.predictionHobbiesLayout, this.predictHobbieLayout.render(), 0);
       }
     }

  }

  populateHobbiePredictions = (predictions,data) =>{

    var predictionContent = predictions.map((item) => {
      return (this.getHobbiePredictionCard(item))
    });

    var addDictionaryString="Add \"String\"";
    addDictionaryString = addDictionaryString.replace("String", data);
    this.predictHobbieLayout =(<LinearLayout
       height="match_parent"
       width="wrap_content"
       orientation="vertical"
       margin="16,0,16,0"
       >

         {predictionContent}
         <LinearLayout
         height="match_parent"
         width="match_parent">
           <TextView
            height="wrap_content"
            width="match_parent"
            padding="16,17,0,17"
            textSize="15"
            onClick={()=>{this.addHobbieItem(data)}}
            text={addDictionaryString}
            textColor="#FF333333"/>
         </LinearLayout>
         <LinearLayout
         height="3"
         width="328"
         background="#E0E0E0">
         </LinearLayout>
       </LinearLayout>);

    this.replaceChild(this.idSet.predictionHobbiesLayout, this.predictHobbieLayout.render(), 0);


  }

  getHobbiePredictionCard = (item)=>{
    console.log(item, "iitm")
    return (
      <LinearLayout
      height="wrap_content"
      width="match_parent"

      orientation="vertical">
          <TextView
           height="wrap_content"
           width="match_parent"
           padding="16,17,0,17"
           textSize="15"
           onClick={()=>{this.selectHobbieItem(item)}}
           text= {item}
           textColor="#FF333333"
          />
          <LinearLayout
          height="1"
          width="328"
          background={window.__Colors.PRIMARY_BLACK_66}>
          </LinearLayout>
      </LinearLayout>
    );
  }

  selectHobbieItem =(data) =>{
    console.log(data, "selectItem");
    var index=this.hobbieDictionary.indexOf(data);
    if(index >-1){
      JBridge.hideKeyboard();

      this.predictHobbieLayout =(<LinearLayout
         height="wrap_content"
         width="wrap_content"/>);

      this.replaceChild(this.idSet.predictionHobbiesLayout, this.predictHobbieLayout.render(), 0);

     this.hobbieDictionary.splice(index,1);
     this.selectedHobbies.unshift(data);


     var skills = this.selectedHobbies.map((item) => {
       return (this.hobbieItemLayout(item));
     });

    console.log(this.selectedHobbies," skiilhere");
    this.updatedHobbies=(
      <HorizontalScrollView
      height="wrap_content"
      width="match_parent">
            <LinearLayout
            height="match_parent"
            width="match_parent"
            orientation="horizontal">
               {skills}
            </LinearLayout>
      </HorizontalScrollView>);

      this.replaceChild(this.idSet.HobbiesLayout,this.updatedHobbies.render(),0);

   }

  }

  addHobbieItem = (data) =>{
    if(this.hobbieDictionary.indexOf(data)==-1 && this.selectedHobbies.indexOf(data)==-1)
    {
      this.hobbieDictionary.unshift(data);
      this.selectHobbieItem(data);
    }
    else {
      JBridge.hideKeyboard();
      JBridge.showSnackBar("Hobbie Already Added");
    }
  }




  hobbieItemLayout = (item)=> {
    return (
      <LinearLayout
      height="wrap_content"
      width="wrap_content"
      >
            <LinearLayout
            height="32"
            width="wrap_content"
            background="#66D8D8D8"
            cornerRadius="12,12,12,12"
            >
                <TextView
                height="28"
                width="wrap_content"
                textColor="#ffffff"
                text={item}
                margin="12,0,0,0"
                gravity="center"
                />
                <ImageView
                margin="11,8,11,8"
                height="match_parent"
                width="match_parent"
                imageUrl="ic_action_close"
                onClick={()=>{this.removeHobbie(item)}}
                />
            </LinearLayout>
            <LinearLayout
            height="wrap_content"
            width="10"/>

    </LinearLayout>
  );
  }

  removeHobbie= (item) =>{
    var index= this.selectedHobbies.indexOf(item);
    if(index>-1){
      this.selectedHobbies.splice(index,1);
      this.hobbieDictionary.unshift(item);

      var Hobbies = this.selectedHobbies.map((data) => {
        return (this.hobbieItemLayout(data));
      });

      console.log(this.selectedHobbies," skiilll");
      this.updatedHobbies=(
        <HorizontalScrollView
        height="wrap_content"
        width="match_parent">
           <LinearLayout
           height="match_parent"
           width="match_parent"
           orientation="horizontal">
              {Hobbies}
           </LinearLayout>
         </HorizontalScrollView>);

       this.replaceChild(this.idSet.HobbiesLayout,this.updatedHobbies.render(),0);

    }
  }

  onBackPressed = () => {
    var whatToSend = []
    var event = { tag: "BACK_AdditionalInformationActivity", contents: whatToSend};
    window.__runDuiCallback(event);
  }

  arrayEquals = (array1,array2) => {
    if(array1.length!=array2.length)
     return false;

    var i=0
    for(i=0;i<array1.length;i++)
      if(array2.indexOf(array1[i])<0)
         return false;

    return true;
  }

  checkEmailFormat = (data) =>{
    if(!(data.indexOf("@") !== -1) || !(data.indexOf(".") !== -1))
        return false
    return true
  }

  checkPhoneFormat = (data) =>{
    if(data.length == 10 && /^\d+$/.test(data))
       return true
    return false;
  }

  checkAdharFormat = (data) =>{
    if(data.length == 12 && /^\d+$/.test(data))
       return true
    return false;
  }

  handleSaveClick = () => {
    var json=  {};


    if(!this.checkCompleteStatus())
      {
        JBridge.showSnackBar(window.__S.NO_CHANGE);
        return;
      }


    json.firstName=this.name;
    json.language=this.language;

    if(this.checkEmailFormat(this.email))
        json.email=this.email;
    else {
      JBridge.showSnackBar(window.__S.ERROR_EMAIL_FORMAT)
      return;
    }


    if(this.checkPhoneFormat(this.mobile))
        json.phone=this.mobile;
    else {
      JBridge.showSnackBar(window.__S.ERROR_SHORT_MOBILE)
      return;
    }


    if(this.location!=null)
    json.location=this.location;

    if(this.adhar!=null)
      if(this.checkAdharFormat(this.adhar))
           json.aadhaarNo=this.adhar;
      else {
        JBridge.showSnackBar(window.__S.ERROR_INVALID_AADHAAR)
        return;
      }

    if(this.dob!=null)
    json.dob= this.dob;

    if(this.grade!=null && this.grade.length >= 0 ) {
      json.grade=this.grade;
    }


    if(this.gender!=null)
      json.gender=this.gender.toLowerCase();

      json.subject=this.selectedSubjects.length>0 ? this.selectedSubjects : null;

      json.profileSummary = this.description;


   json.userId=window.__userToken;

   var url=window.__apiUrl + "/api/user/v1/update"


   var body = {
             "id":"unique API ID",
             "ts":"response timestamp YYYY-MM-DDThh:mm:ss+/-nn:nn (timezone defaulted to +5.30)",
               "params": {

                 },
             "request":json
             }

  console.log(JSON.stringify(body),"sendingJson");

  this.responseCame=false;

  if(JBridge.isNetworkAvailable()){
      JBridge.patchApi(url,JSON.stringify(body),window.__userToken,window.__apiToken);
      window.__LoaderDialog.show();

     setTimeout(() => {
         if(this.responseCame){
           return;
         }
         JBridge.showSnackBar(window.__S.ERROR_SERVER_CONNECTION);
         window.__LoaderDialog.hide();
         this.responseCame=false;
     },window.__API_TIMEOUT);
 }else {
   JBridge.showSnackBar(window.__S.ERROR_NO_INTERNET_MESSAGE);
 }

 //  window.__LoaderDialog.show();
 //
 // setTimeout(() => {
 //     if(_this.responseCame){
 //       return;
 //     }
 //     JBridge.showSnackBar(window.__S.ERROR_SERVER_CONNECTION);
 //     window.__LoaderDialog.hide();
 //     _this.responseCame=false;
 // },window.__API_TIMEOUT);

  }

  getPatchCallback = (data) =>{
    data=JSON.parse(data);
    if(this.responseCame){

      return;
    }

   window.__LoaderDialog.hide();
   this.responseCame=true;
   console.log(data)
   if(data.result.response=="SUCCESS"){
     window.__BNavFlowRestart();
     this.onBackPressed();
   }else{
     JBridge.showSnackBar(data.params.errmsg);
   }

  }

  checkCompleteStatus = () =>{

    if(this.name==null || this.language==null || this.email==null || this.mobile==null || this.checkSameData())
      {
      return false;
      }
    return true;
  }

  checkSameData = () =>{

    console.log(JSON.stringify(this.grade) +" gfgh "+ JSON.stringify(this.prevData.grade));
    if(this.name == this.prevData.name && this.lastName == this.prevData.lastName && JSON.stringify(this.language) == JSON.stringify(this.prevData.language) && this.email == this.prevData.email && this.mobile == this.prevData.mobile && this.prevData.adhar==this.adhar)
      {
        if(this.location==this.prevData.location && this.description == this.prevData.description && this.dob == this.prevData.dob && (this.gender == this.prevData.gender || this.gender.toLowerCase() == this.prevData.gender.toLowerCase()) && this.arrayEquals(this.grade,this.prevData.grade) )
          if (this.arrayEquals(this.selectedSubjects,this.prevData.selectedSubjects))
               return true;
      }
      return false;
  }

  updateSaveButtonStatus = (enabled) => {
    var alphaVal;
    var isClickable;

    if (enabled) {
      alphaVal="1"
      isClickable = "true"
    } else {
      alphaVal="0.5"
      isClickable = "false"
    }

    var cmd = this.set({
      id: this.idSet.saveButton,
      clickable: isClickable,
      alpha : alphaVal
    })

    Android.runInUI(cmd, 0);
  }

  setName = (data) =>{
    this.name= data=="" ? null : data;
    this.updateSaveButtonStatus(this.checkCompleteStatus());
  }

  setLastName = (data) =>{
    this.lastName= data=="" ? null : data;
    this.updateSaveButtonStatus(this.checkCompleteStatus());
  }

  setLanuage = (data) =>{
    this.language=data;
    this.updateSaveButtonStatus(this.checkCompleteStatus());

  }

  setEmail = (data) =>{
    this.email=data=="" ? null : data;
    this.updateSaveButtonStatus(this.checkCompleteStatus());

  }
  setPhone = (data) =>{
    this.mobile=data=="" ? null : data;
    this.updateSaveButtonStatus(this.checkCompleteStatus());

  }

  setAdhar= (data) => {
    this.adhar=data=="" ? null :data;
    this.updateSaveButtonStatus(this.checkCompleteStatus());

  }

  setLocation = (data) => {
    this.location=data=="" ? null :data;
    this.updateSaveButtonStatus(this.checkCompleteStatus());

  }

  setDescription = (data)=>{
    this.description=data;
    this.updateSaveButtonStatus(this.checkCompleteStatus());

  }


}
module.exports = Connector(AdditionalInformationActivity);
