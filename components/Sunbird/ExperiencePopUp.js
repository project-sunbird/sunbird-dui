var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var EditText = require('@juspay/mystique-backend').androidViews.EditText;
var TextInputView = require('./core/TextInputView');
var Spinner = require('../Sunbird/core/Spinner');
var RadioButton = require('../Sunbird/core/RadioButton');
var CheckBox = require("@juspay/mystique-backend").androidViews.CheckBox;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var Styles = require("../../res/Styles");
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
      "delButtonParent"
    ]);
    this.isVisible = false;
    this.spinnerArray = ["Select","Hindi","English","Math","Physics","Chemistry","Economics"];
    this.array="Select,Hindi,English,Math,Physics,Chemistry,Economics";
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

 }

 show = () => {
   this.isVisible = true;
   window.__patchCallback = this.getPatchCallback ;
   this.responseCame=false;
    var cmd=this.set({
     id: this.idSet.saveButtonParent,
     background: window.__Colors.FADE_BLUE
   })
   Android.runInUI(cmd, 0)

   this.replaceChild(this.idSet.experiencePopUpParent,this.getUi().render(),0);
   this.setVisibility("visible");

  this.initializeData();
  this.populateData();
 }

 hide = () => {
   this.isVisible = false;
   this.spinnerArray = ["Select","Hindi","English","Math","Physics","Chemistry","Economics"];
   this.array="Select,Hindi,English,Math,Physics,Chemistry,Economics";
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
   var subs=this.prevData.subjects.slice();
   subs.map((item)=>{
     this.addSubject(item);
   });
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

      <LinearLayout
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

         <LinearLayout
           width="match_parent"
           height="wrap_content"
           stroke={"2,"+window.__Colors.PRIMARY_BLACK_66}
           padding="8,8,8,8"
           cornerRadius="4,4,4,4"
           id={this.idSet.spinnerContainer}>

            {this.loadSpinner()}

         </LinearLayout>

         <HorizontalScrollView
           height = "wrap_content"
           width = "match_parent"
           id={this.idSet.subjectContainer}
           margin = "0,10,0,0"/>
      </LinearLayout>

      <LinearLayout
      height="wrap_content"
      width="match_parent"
      padding = "4,0,0,0"
      margin = "0,0,0,12">
          <TextView
            height="wrap_content"
            width="wrap_content"
            margin="0,0,16,0"
            style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
            text="Is this your current job?"
          />

          <RadioButton
           height="wrap_content"
           width="wrap_content"
           gravity="center_vertical"
           items={[{name:"Yes",select:"0",icon:"ic_check_circle"},{name:"No",select:"0",icon:"ic_check_circle"}]}
           onClick={this.handleRadioButtonClick}/>


      </LinearLayout>

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
                 margin="0,0,0,4"/>

                 <LinearLayout
                   width="match_parent"
                   height="wrap_content"
                   padding="4,18,12,12">

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
                 margin="0,0,0,4"/>

                 <LinearLayout
                   width="match_parent"
                   height="wrap_content"
                   padding="4,18,12,12">

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

    </LinearLayout>
   );
 }

  getUi(){
    return(
      <LinearLayout
        height="match_parent"
        width="match_parent"
        root="true"
        orientation="vertical">
        {this.getToolbar()}

        <RelativeLayout
          height="match_parent"
          width="match_parent"
          background="#ffffff">

          <LinearLayout
            height="match_parent"
            width="match_parent"
            orientation="vertical">

            <ScrollView
              height="match_parent"
              width="match_parent"
              weight="1">

              {this.getScrollView()}
            </ScrollView>

            <LinearLayout
              height="match_parent"
              width="match_parent"
              weight="6"/>
          </LinearLayout>

          <LinearLayout
            height="match_parent"
            width="match_parent"
            orientation="vertical" >

            <LinearLayout
            height="match_parent"
            width="match_parent"
            weight="1"
            />

            {this.getLineSeperator()}

            <LinearLayout
              weight = "6"
              height = "match_parent"
              width = "match_parent"
              orientation = "horizontal">

                {this.getSaveBtn()}
                {this.getDelBtn()}
            </LinearLayout>
          </LinearLayout>
        </RelativeLayout>
      </LinearLayout>
    )
  }

  getEditTextView = (id, label, optional,onChange, inputType) => {
    return (
      <LinearLayout
        height="wrap_content"
        width="match_parent"
        orientation="vertical"
        margin = "0,0,0,12">
        <LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="horizontal"
          margin = "0,0,0,-5"
          padding = "4,0,0,0">
          <TextView
            height="wrap_content"
            width="wrap_content"
            text={label}
            textAllCaps="true"
            textStyle={window.__TextStyle.textStyle.HINT.SEMI}/>
          <TextView
            height="wrap_content"
            width="wrap_content"
            text=" *"
            color="#FF0000"
            visibility = {optional ? "gone" : "visible"}/>
        </LinearLayout>
        <EditText
          width="match_parent"
          height="wrap_content"
          id = {id}
          onChange={onChange}
          singleLine="true"
          maxLine="1"
          inputType = {inputType ? inputType : "text"}
          hint = {optional ? "(Optional)" : ""}
          style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>
    </LinearLayout>
    );
  }

getSaveBtn = () => {
  return (
    <LinearLayout
    weight="1"
     height="match_parent"
     width="0"
     padding="6,6,6,6"
     background="#ffffff"
     orientation="horizontal"
     id={this.idSet.saveButtonParent}>
        <LinearLayout
        height="match_parent"
        width="match_parent"
        clickable="false"
        onClick={ this.sendJSON }>
            <LinearLayout
            height="match_parent"
            width="match_parent"
            gravity="center"
            cornerRadius="5"
            background={window.__Colors.LIGHT_BLUE_22}
            id={this.idSet.saveButton}>
                <TextView
                text="Save"
                gravity="center"
                style={window.__TextStyle.textStyle.CARD.TITLE.LIGHT}/>
            </LinearLayout>
        </LinearLayout>
      </LinearLayout>
  );
}

getDelBtn = () => {
  return (
    <LinearLayout
    weight="1"

     height="match_parent"
     width="0"
     padding="6,6,6,6"
     background="#ffffff"
     orientation="horizontal"
     visibility = {window.__ExperiencePopUp.data ? "visible" : "gone"}
     id={this.idSet.delButtonParent}>
        <LinearLayout
        height="match_parent"
        width="match_parent"
        onClick={ this.del }>
            <LinearLayout
            height="match_parent"
            width="match_parent"
            gravity="center"
            cornerRadius="5"
            background={window.__Colors.ERROR_RED}
            id={this.idSet.delButton}>
                <TextView
                text="Delete"
                gravity="center"
                style={window.__TextStyle.textStyle.CARD.TITLE.LIGHT}/>
            </LinearLayout>
        </LinearLayout>
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
       orientation="vertical"
       height="match_parent"
       width="match_parent"
       id={this.idSet.experiencePopUpParent}
       visibility="gone"
       gravity="center">

      {this.getUi()}

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
         JBridge.showCalender(callback,this.joiningDate,this.endDate,"");
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


       this.saveButton =(
         <LinearLayout
          height="match_parent"
          width="match_parent"
          padding="4,4,4,4"
          background="#ffffff"
          root="true"
          orientation="horizontal"
          id={this.idSet.saveButtonParent}>
             <LinearLayout
             height="match_parent"
             width="match_parent"
             onClick={ this.sendJSON }
             clickable="true">
                 <LinearLayout
                 height="match_parent"
                 width="match_parent"
                 gravity="center"
                 cornerRadius="5"
                 background={window.__Colors.LIGHT_BLUE}
                 id={this.idSet.saveButton}>
                     <TextView
                     text="Save"
                     gravity="center"
                     style={window.__TextStyle.textStyle.CARD.TITLE.LIGHT}/>
                 </LinearLayout>
             </LinearLayout>
           </LinearLayout>)

       this.replaceChild(this.idSet.saveButtonParent, this.saveButton.render(), 0);


     }

     disableSaveButton = () =>{

      this.saveButton =(
        <LinearLayout
         height="match_parent"
         width="match_parent"
         padding="4,4,4,4"
         background="#ffffff"
         orientation="horizontal"
         root ="true"
         id={this.idSet.saveButtonParent}>
            <LinearLayout
            height="match_parent"
            width="match_parent"
            onClick={ this.sendJSON }
            clickable="false">
                <LinearLayout
                height="match_parent"
                width="match_parent"
                gravity="center"
                cornerRadius="5"
                background={window.__Colors.LIGHT_BLUE_22}
                id={this.idSet.saveButton}>
                    <TextView
                    text="Save"
                    gravity="center"
                    style={window.__TextStyle.textStyle.CARD.TITLE.LIGHT}/>
                </LinearLayout>
            </LinearLayout>
          </LinearLayout>)

      this.replaceChild(this.idSet.saveButtonParent, this.saveButton.render(), 0);

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


     removeSubject = (data) => {

       this.subjects.splice(this.subjects.indexOf(data),1);
       this.array=this.array+","+data;
       this.spinnerArray.push(data);
       this.spinnerLayout= (
         <LinearLayout
           root="true"
           height="wrap_content"
           width="match_parent">

           {this.loadSpinner()}

         </LinearLayout>);
       this.replaceChild(this.idSet.spinnerContainer,this.spinnerLayout.render(),0);
       this.showSelectedSubjects();
     }

     addSubject = (data) =>{
       this.subjects.unshift(data);
       if(this.array.indexOf(data+",")>-1){
         this.array = this.array.replace(data+",","");
       }else{
         this.array = this.array.replace(","+data, "");
       }
       this.spinnerArray.splice(this.spinnerArray.indexOf(data),1);
       this.spinnerLayout= (
         <LinearLayout
         root="true"
         height="wrap_content"
         width="match_parent">

          {this.loadSpinner()}

         </LinearLayout>);
       this.replaceChild(this.idSet.spinnerContainer,this.spinnerLayout.render(),0);
       this.showSelectedSubjects();
     }

     showSelectedSubjects = () =>{
       var items = this.subjects.map((data)=>{
           return(
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
                   text={data}
                   margin="0,0,4,0"
                   textStyle={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>

                 <ImageView
                   height="15"
                   width="15"
                   imageUrl="ic_action_close"
                   margin="0,1,0,0"
                   onClick={()=>{this.removeSubject(data)}}/>
              </LinearLayout>
           )
       });


    this.subjectCards =(
      <LinearLayout
        width="match_parent"
        height="match_parent"
        root="true">

        {items}

      </LinearLayout>
    )

    this.replaceChild(this.idSet.subjectContainer,this.subjectCards.render(),0);
   }

  }

module.exports = ExperiencePopUp;
