var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
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
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var Styles = require("../../res/Styles");
var MultiSelectSpinner = require('./MultiSelectSpinner');
let IconStyle = Styles.Params.IconStyle;


var _this;

class ExperiencePopUp extends View{
  constructor(props,childern){
    super(props,childern);
    this.setIds([
      "experiencePopUpParent",
      "joiningDateText",
      "joiningDateLayout",
      "closingDateText",
      "closingDateLayout",
      "scrollView",
      "saveButton",
      "saveButtonParent",
      "jobText",
      "positionText",
      "organizationText",
      "subjectContainer",
      "spinnerContainer",
      "delButton",
      "delButtonParent",
      "subjectSpinner",
      "subjectSpinnerContainer"
    ]);
    this.isVisible = false;
    this.spinnerArray = ["Select","Bengali","English","Gujarati","Hindi","Kannada","Marathi","Punjabi","Tamil"];
    this.subjectArray = ["Select","Bengali","English","Gujarati","Hindi","Kannada","Marathi","Punjabi","Tamil"];
    this.selecteSubject = [];
    this.array="Select,Bengali,English,Gujarati,Hindi,Kannada,Marathi,Punjabi,Tamil";
    _this=this;
    window.__ExperiencePopUp = this;
    this.props=props;
    this.subjects=[];
    this.jobName="";
    this.Organization="";
    this.Position="";
    this.joiningDate="";
    this.endDate="";

    this.jobProfile=[];

    this.prevData={};
    this.delete = false;
    this.canSave = false;

    this.delBtnState = {
      text : "DELETE",
      id : this.idSet.delButton,
      isClickable : "true",
      onClick : this.del,
      visibility : window.__ExperiencePopUp.data ? "visible" : "gone"
    };

    this.saveBtnState = {
      text : "SAVE",
      id : this.idSet.saveButton,
      isClickable : "false",
      onClick : this.sendJSON,
      alpha : "0.5"
    }

 }

 show = () => {
   this.canSave = false;
   this.isVisible = true;
   window.__patchCallback = this.getPatchCallback ;
   this.responseCame=false;
    var cmd=this.set({
     id : this.idSet.saveButton,
     alpha : "0.5",
     clickable : "false"
   });
   Android.runInUI(cmd, 0)

   this.replaceChild(this.idSet.experiencePopUpParent,this.getUi().render(),0);
   this.setVisibility("visible");

  this.initializeData();
  this.populateData();
  cmd = this.set({
    id: this.idSet.delButton,
    visibility: window.__ExperiencePopUp.data ? "visible" : "gone"
  });
  Android.runInUI(cmd, 0)
 }

 hide = () => {
   this.canSave = false;
   this.isVisible = false;
   this.spinnerArray = ["Select","Bengali","English","Gujarati","Hindi","Kannada","Marathi","Punjabi","Tamil"];
   this.array="Select,Bengali,English,Gujarati,Hindi,Kannada,Marathi,Punjabi,Tamil";
   JBridge.hideKeyboard();
   this.setVisibility("gone");
   this.subjects=[];
   window.__ExperiencePopUp.data=undefined;

 }

 getVisibility = (data) => {
   return this.isVisible;
 }

 setVisibility = (data) => {
   var cmd = this.set({
     id: this.idSet.experiencePopUpParent,
     visibility: data
   })

   Android.runInUI(cmd, 0)
 }


 initializeData = () =>{
   this.prevData.subjects=[];
   this.prevData.jobName="";
   this.prevData.Organization="";
   this.prevData.Position="";
   this.prevData.joiningDate=null;
   this.prevData.endDate=null;
   this.jobProfile = [];
   if(window.__ExperiencePopUp.data!=undefined)
   {
     this.prevData.jobName = window.__ExperiencePopUp.data.jobName;
     this.prevData.Organization = window.__ExperiencePopUp.data.orgName;
     this.prevData.Position = window.__ExperiencePopUp.data.role;
     this.prevData.joiningDate=window.__ExperiencePopUp.data.joiningDate;
     this.prevData.endDate=window.__ExperiencePopUp.data.endDate;
     this.prevData.subjects = window.__ExperiencePopUp.data.subject;

   }

 }

 populateData = () =>{
  //  var subs=this.prevData.subjects.slice();
  //  subs.map((item)=>{
  //    this.addSubject(item);
  //  });

   this.subjects = this.prevData.subjects.slice();


   this.prevData.subjects = this.subjects.slice();
   this.jobName=this.prevData.jobName;
   this.Organization=this.prevData.Organization;
   this.Position=this.prevData.Position;
   this.joiningDate=this.prevData.joiningDate;
   this.endDate=this.prevData.endDate;


   var cmd=this.set({
     id: this.idSet.jobText,
     text: this.prevData.jobName
   })

   cmd+=this.set({
     id: this.idSet.organizationText,
     text: this.prevData.Organization
   })

   cmd+=this.set({
     id: this.idSet.positionText,
     text: this.prevData.Position
   })

   cmd+=this.set({
     id: this.idSet.joiningDateText,
     text: this.prevData.joiningDate
   })

   cmd+=this.set({
     id: this.idSet.closingDateText,
     text: this.prevData.endDate
   })

   this.replaceChild(this.idSet.subjectSpinnerContainer, this.getSpinner().render(), 0);

   Android.runInUI(cmd, 0)
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
                 text="Experience"
                 style={window.__TextStyle.textStyle.TOOLBAR.HEADING}/>


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


      {this.getEditTextView(this.idSet.jobText, "Job Name", false, this.setJobName)}
      {this.getEditTextView(this.idSet.organizationText, "Organization", false, this.setOrganization)}
      {this.getEditTextView(this.idSet.positionText, "Position", true, this.setPosition)}

      {this.getSpinner()}
      {this.getJobStatus()}
      {this.getDatePickers()}
    </LinearLayout>
   );
 }

 getDatePickers = () => {
   return (
     <LinearLayout
       height="wrap_content"
       width="match_parent"
       orientation="horizontal"
       padding = "4,0,0,0"
       margin = "0,0,0,12">

             <LinearLayout
             height="wrap_content"
             width="0"
             weight="1"
             orientation="vertical"
             id={this.idSet.joiningDateLayout}>

               <TextView
                height="wrap_content"
                width="wrap_content"
                text="FROM"
                textStyle={window.__TextStyle.textStyle.HINT.SEMI}
                margin="0,0,0,10"/>

                <LinearLayout
                  width="match_parent"
                  height="wrap_content"
                  padding="4,0,12,12">

                    <ImageView
                      height="16"
                      width="16"
                      gravity="center"
                      margin="4,3,7,0"
                      imageUrl="ic_action_calendar_grey"
                      onClick={this.startCalendar}/>

                    <TextView
                      width="match_parent"
                      height="wrap_content"
                      id= {this.idSet.joiningDateText}
                      style={window.__TextStyle.textStyle.CARD.BODY.DARK.FADED}
                      text="Select Date"
                      onClick={this.startCalendar}/>

                </LinearLayout>
                <LinearLayout
                  width="match_parent"
                  height="1"
                  background={window.__Colors.PRIMARY_BLACK_66}/>
             </LinearLayout>

             <LinearLayout
               weight="0.25"
               height="0"
               width="0"/>

             <LinearLayout
               height="wrap_content"
               width="0"
               weight="1"
               orientation="vertical"
               id={this.idSet.closingDateLayout}>

               <TextView
                height="wrap_content"
                width="wrap_content"
                text="TO"
                textStyle={window.__TextStyle.textStyle.HINT.SEMI}
                margin="0,0,0,10"/>

                <LinearLayout
                  width="match_parent"
                  height="wrap_content"
                  padding="4,0,12,12">

                    <ImageView
                      height="16"
                      width="16"
                      gravity="center"
                      margin="4,3,7,0"
                      imageUrl="ic_action_calendar_grey"
                      onClick={this.endCalendar} />

                    <TextView
                      width="match_parent"
                      height="wrap_content"
                      id= {this.idSet.closingDateText}
                      onClick={this.endCalendar}
                      text="Select Date"
                      style={window.__TextStyle.textStyle.CARD.BODY.DARK.FADED}/>

                </LinearLayout>

                <LinearLayout
                  width="match_parent"
                  height="1"
                  background={window.__Colors.PRIMARY_BLACK_66}/>

              </LinearLayout>

      </LinearLayout>
   );
 }

 getJobStatus = () => {
   return (
     <LinearLayout
     height="wrap_content"
     width="match_parent"
     padding = "4,0,0,0"
     margin = "0,0,0,12"
     orientation="vertical">
         <TextView
           height="wrap_content"
           width="wrap_content"
           margin="0,0,16,10"
           textStyle={window.__TextStyle.textStyle.HINT.SEMI}
           textAllCaps="true"
           text="Is this your current job?"/>

         <RadioButton
          height="wrap_content"
          width="wrap_content"
          gravity="center_vertical"
          items={[{name:"Yes",select:"0",icon:"ic_action_radio"},{name:"No",select:"0",icon:"ic_action_radio"}]}
          onClick={this.handleRadioButtonClick}/>
     </LinearLayout>
   );
 }

 getSpinner = () => {
   return(
     <LinearLayout
       id={this.idSet.subjectSpinnerContainer}
       height="wrap_content"
       width="match_parent"
       orientation="vertical"
       padding = "4,0,0,0"
       margin = "0,0,0,12">

       <TextView
        height="wrap_content"
        width="wrap_content"
        text="SUBJECTS"
        textStyle={window.__TextStyle.textStyle.HINT.SEMI}
        margin="0,0,0,3"/>

        <MultiSelectSpinner
          id={this.idSet.subjectSpinner}
          width="match_parent"
          height="wrap_content"
          data={this.subjectArray}
          selectedData={this.subjects}
          onItemChange={this.onMultiSelectItemChange}
         />
     </LinearLayout>
   );
 }


 onMultiSelectItemChange = (data) => {
   this.subjects = data;
   if (this.checkCompleteStatus()) {
     this.enableSaveButton();
   } else {
     this.disableSaveButton();
   }
 }

 getBody = () => {
   return (
     <LinearLayout
       width = "match_parent"
       height = "match_parent"
       orientation = "vertical"
       margin = "0,0,0,24"
       backgroundColor = "#ffffff">

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

 getUi = () => {
   return (
     <RelativeLayout
       width="match_parent"
       height="match_parent"
       gravity="center">
           {this.getBody()}
           {this.getFooter()}
     </RelativeLayout>
   );
 }


  getEditTextView = (id, label, optional,onChange, inputType) => {
    return (

      <TextInputView
        id = {id}
        height="wrap_content"
        width="match_parent"
        hintText={optional ? "(Optional)" : ""}
        labelText={label}
        mandatory = {optional ? "false" : "true"}
        margin = "0,0,0,18"
        _onChange={onChange}
        textStyle = {window.__TextStyle.textStyle.HINT.BOLD}
        editTextStyle = {window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
        inputType = {inputType ? inputType : "text"}/>
    );
  }

  getFooter = () => {
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
          orientation = "horizontal"
          id = {this.idSet.btnsHolder}>
          {this.getButtons()}
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
        visibility = {"visible"}>
        <PageOption
            width="match_parent"
            buttonItems={buttonList}
            hideDivider={false}/>
      </LinearLayout>
    );
  }

del = () => {
  this.delete = true;
  this.sendJSON();
}

 render(){
   this.layout=(
     <LinearLayout
       width = "match_parent"
       height = "match_parent"
       root = "true"
       id={this.idSet.experiencePopUpParent}
       background = "#ffffff"
       visibility="gone">
       <RelativeLayout
         width="match_parent"
         height="match_parent"
         gravity="center">
             {this.getBody()}
             {this.getFooter()}
       </RelativeLayout>
     </LinearLayout>
     );
        return this.layout.render();
     }

     loadSpinner = () => {
       return(<Spinner
               width="match_parent"
               height="34"
               style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
               margin="0,0,5,6"
               onItemClick = {this.handleSpinnerItemClick}
               values={this.array}
               />)
     }

     handleSpinnerItemClick = (...params) => {


       if(parseInt(params[2])>0)
       this.addSubject(this.spinnerArray[parseInt(params[2])]);

       if(this.checkCompleteStatus())
          this.enableSaveButton();
       else {
         this.disableSaveButton();
       }
     }


     getLineSeperator = () => {
       return (<LinearLayout
               width="match_parent"
               height="2"
               margin="0,0,0,0"
               background={window.__Colors.PRIMARY_BLACK_22}/>)
     }


     startCalendar =() =>{
       this.showCalendar(1);

     }

     endCalendar =() =>{
       this.showCalendar(2);

     }

     showCalendar = (index) =>{
       var _this = this;
       var callback = callbackMapper.map(
         function (data){

               data[0]=_this.formatDate(data[0]);

              if(index==1){
                _this.joiningDate=data[0];

                 var cmd = _this.set({
                   id: _this.idSet.joiningDateText,
                   text: data[0],
                   style: window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK
                 });
                 Android.runInUI(cmd, 0);


            }
            else{
              _this.endDate=data[0];
              var cmd = _this.set({
                id: _this.idSet.closingDateText,
                text: data[0],
                style: window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK

              });
              Android.runInUI(cmd, 0);
            }

            if(_this.checkCompleteStatus()){
              _this.enableSaveButton();
            }else {
              _this.disableSaveButton();
            }
       });


       try{
        if (index==1){
          JBridge.showCalender(callback,"",this.endDate,"");
        }
        else
        {
          JBridge.showCalender(callback,this.joiningDate,"","");
        }
       }
       catch(err){
         console.log(err , "date err");
       }

     }

     handleRadioButtonClick = () =>{

       if(window.__RadioButton!=undefined && window.__RadioButton.currentIndex==0)
       {
         var cmd = this.set({
           id: this.idSet.closingDateLayout,
           visibility: "gone"
         });
         cmd += this.set({
           id: this.idSet.closingDateText,
           text : "Select Date"
         });
         Android.runInUI(cmd, 0);
         this.endDate=null;

         if(this.checkCompleteStatus())
         {
           this.enableSaveButton();
         }
         else {
           this.disableSaveButton();
         }


       }
       else {
         var cmd = this.set({
           id: this.idSet.closingDateLayout,
           visibility: "visible"
         });
         Android.runInUI(cmd, 0);


         if(this.checkCompleteStatus())
         {
           this.enableSaveButton();
         }
         else {
           this.disableSaveButton();
         }
       }
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
        this.hide();
        window.__BNavFlowRestart();
      }else{
        JBridge.showSnackBar(data.params.errmsg);
      }

    }

     sendJSON = () => {

       if (!this.canSave && !this.delete) {
         if (window.__ExperiencePopUp.data)
           JBridge.showSnackBar("Please make some changes");
         else
           JBridge.showSnackBar("Please add mandatory details");
         return;
       }

       if(window.__ExperiencePopUp.data==undefined){
          this.json ={
            "jobName":this.jobName,
            "orgName":this.Organization,
            "role":this.Position,
            "joiningDate":this.joiningDate,
            "endDate":this.endDate,
            "subject":this.subjects,
            }
          this.jobProfile.push(this.json);
        }
        else{
          var json=  window.__ExperiencePopUp.data;


          json.jobName=this.jobName;
          json.orgName=this.Organization;
          json.role=this.Position;
          json.joiningDate=this.joiningDate;
          json.endDate=this.endDate;
          json.subject=this.subjects;
          json.userId= window.__userToken;
          json.isDeleted = this.delete ? this.delete : null;
          if(json.address!=undefined)
          json.address.userId= window.__userToken;
          this.jobProfile.push(json);
          this.delete = false;

        }

        var url=window.__apiUrl + "/api/user/v1/update"


        var body = {
                  "id":"unique API ID",
                  "ts":"response timestamp YYYY-MM-DDThh:mm:ss+/-nn:nn (timezone defaulted to +5.30)",
                    "params": {

                      },
                  "request":{
                    "userId":window.__userToken,
                    "jobProfile": this.jobProfile
                   }
                  }
        _this.responseCame=false;
        JBridge.patchApi(url,JSON.stringify(body),window.__userToken,window.__apiToken);
        window.__LoaderDialog.show();

       setTimeout(() => {
           if(_this.responseCame){
             return;
           }
           JBridge.showSnackBar(window.__S.ERROR_SERVER_CONNECTION);
           window.__LoaderDialog.hide();
           _this.responseCame=false;
       },window.__API_TIMEOUT);
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

     checkCompleteStatus = () =>{
       if(window.__ExperiencePopUp.data != undefined)
       {
         if(this.jobName == this.prevData.jobName && this.Organization == this.prevData.Organization  && this.Position== this.prevData.Position && JSON.stringify(this.subjects)==JSON.stringify(this.prevData.subjects) && this.joiningDate == this.prevData.joiningDate && this.endDate == this.prevData.endDate )
         {
           return false;
         }
         return true;
      }
      else {
        if(this.jobName == this.prevData.jobName || this.Organization == this.prevData.Organization)
        {
          return false;
        }
        return true;
      }
     }

     enableSaveButton = () =>{
       console.log("enableSaveButton");
      var cmd = this.set({
        id: this.idSet.saveButton,
        clickable: "true",
        alpha: "1"
      });
      Android.runInUI(cmd, 0);
      this.canSave = true;
     }

     disableSaveButton = () =>{
       var cmd = this.set({
         id: this.idSet.saveButton,
         clickable: "false",
         alpha: "0.5"
       });
       Android.runInUI(cmd, 0);
       this.canSave = false;
     }

     setJobName = (data) => {
        this.jobName=data;
        if(this.checkCompleteStatus())
        {
          this.enableSaveButton();
        }
        else {
          this.disableSaveButton();
        }

     }

     setOrganization = (data) => {
       this.Organization=data;
       if(this.checkCompleteStatus())
       {
         this.enableSaveButton();
       }else {
         this.disableSaveButton();
       }
     }

     setPosition = (data) => {
       this.Position=data;
       if(this.checkCompleteStatus())
       {
         this.enableSaveButton();
       }
       else {
         this.disableSaveButton();
       }
     }

  }

module.exports = ExperiencePopUp;
