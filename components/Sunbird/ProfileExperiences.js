var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var CropParagraph = require('../../components/Sunbird/CropParagraph');


var _this;
class ProfileExperiences extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([

    ]);
    _this = this;
    this.isEditable = this.props.editable;
    this.popUpType = this.props.popUpType;
    this.jobs = (this.props.data != undefined)? this.props.data : [];
    this.lockIconVisibility=this.props.privacyStatus;

    if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.EXPERIENCE) {
      this.name="jobProfile"
    } else if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.EDUCATION) {
      this.name="education"
    } else if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.ADDRESS) {
      this.name="address"
    }
  }


  getHeader() {
    console.log(this.props.data,this.isEditable);
    if((this.props.data==undefined)||(this.props.data.length==0&&this.isEditable=="false"))
      {
        return (<LinearLayout
          height="wrap_content"
          width="wrap_content"/>)
      }
    return (<LinearLayout
              width="match_parent"
              height="wrap_content">

              <TextView
                width="wrap_content"
                height="wrap_content"
                text={this.props.heading}
                style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

              <ViewWidget
                height="0"
                weight="1"/>
              <LinearLayout
              width="wrap_content"
              height="wrap_content"
              layout="horizontal"
              padding = "16,16,0,16"
              visibility = {(this.isEditable == "true") ? "visible" : "gone"}>

              <TextView
              width="wrap_content"
              height="wrap_content"
              text={window.__S.ADD}
              onClick = {() => this.showPopUp()}
              style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}
              margin="0,0,10,0"/>

              <RelativeLayout>
                      <ImageView
                      height="14"
                      width="14"
                      onClick={()=>{this.props.handleLock(this.name,this.lockIconVisibility,this.props.heading)}}
                      id={this.idSet.lockIcon}
                      visibility={this.lockIconVisibility?"visible":"gone"}
                      imageUrl="ic_action_lock"/>
                      <ImageView
                      id={this.idSet.unlockIcon}
                      height="14"
                      width="14"
                      onClick={()=>{this.props.handleLock(this.name,this.lockIconVisibility,this.props.heading)}}
                      visibility={this.lockIconVisibility?"gone":"visible"}
                      imageUrl="ic_action_unlock"/>
                  </RelativeLayout>
               </LinearLayout>
              </LinearLayout>)
  }

  getLineSeperator = () => {
    var temp= true;
    if((this.props.data==undefined)||(this.props.data.length==0&&this.isEditable=="false"))
      {
        temp = false;
      }
    return (<LinearLayout
              width="match_parent"
              height="1"
              margin="0,16,0,16"
              visibility = {temp?"visible":"gone"}
              background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  getEditButton = (item) =>{
    if(this.isEditable == "true"){
    return (
      <LinearLayout
      height="wrap_content"
      width="0"
      weight = "2"
      padding = "16,16,0,16"
      gravity="center">
      <LinearLayout
        width="0"
        weight="1" />
        <LinearLayout
          width = "wrap_content"
          height = "wrap_content"
          padding = "10,10,0,10"
          onClick={()=>{this.showPopUp(item)}}>
          <ImageView
          width="18"
          height="18"
          imageUrl="ic_action_edit_blue"/>
        </LinearLayout>
      </LinearLayout>
    )
   }

   else {
     return (<LinearLayout
       height="wrap_content"
       width="wrap_content"/>)
   }
  }

  showPopUp = (item) =>{
    if(!JBridge.isNetworkAvailable()){
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
      return ;
    }
    console.log(item, "showPopUp");
    if(!JBridge.isNetworkAvailable()){
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
      return;
    }
    if(item==undefined)
      {item=""}

    if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.EXPERIENCE) {
      this.getCurrentJobStatus();
      window.__currentJobSelected=this.currJobFlag  ;
      var whatToSend = { "profile": JSON.stringify(item) }
      var event = { tag: 'OPEN_ExperienceActivity', contents: whatToSend }
      window.__runDuiCallback(event);
    } else if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.EDUCATION) {

      var whatToSend = { "profile": JSON.stringify(item) }
      var event = { tag: 'OPEN_EducationActivity', contents: whatToSend }
      window.__runDuiCallback(event);

    } else if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.ADDRESS) {
      var whatToSend = { "profile": JSON.stringify(item) }
      var event = { tag: 'OPEN_AddressActivity', contents: whatToSend }
      window.__runDuiCallback(event);
    }
  }

  getCurrentJobStatus = () => {
     this.currJobFlag = false;
     var _this=this;
     this.jobs.map((item) => {
        if(item.isCurrentJob)
           _this.currJobFlag=true;
     });
  }

  getTitle = (input) => {
    var title = input.jobName ? input.jobName : input.name;
    if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.ADDRESS) {
      title = input.addType;
    }
    return title;
  }

  getDate = (input) => {
    var date = "";

    if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.EDUCATION){
      if (input.yearOfPassing)
        date = "Year of passing : " + input.yearOfPassing;
    } else if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.EXPERIENCE) {
      var dateOptions = {month: "short", year: "2-digit"};
      if(input.hasOwnProperty("joiningDate") && input.joiningDate && input.joiningDate != ""){
        var joiningDate = new Date(input.joiningDate);
        var joiningDateString = joiningDate.toLocaleDateString("en-us", dateOptions);
        date = joiningDateString;
        if(input.hasOwnProperty("endDate") && input.endDate && input.endDate != ""){
          var endDate = new Date(input.endDate);
          var endDateString = endDate.toLocaleDateString("en-us", dateOptions);
          var val = Math.abs(joiningDate.getUTCFullYear() - endDate.getUTCFullYear());
          if (val == 0)
            var noOfYears = "";
          else
            var noOfYears = " (" + val + " YRS)";
          date = date + " - " + endDateString + noOfYears;
        } else {
          var noOfYears = "";
        }
        if(input.isCurrentJob)
          date = date + " - Present";
      }
    }
    return (date == "") ? date : date + "\n";
  }

  getAddress = (input) => {
    var address = "";

    if (input.hasOwnProperty("addressLine1")) {
      address = input.addressLine1 ? input.addressLine1 : "";
    }

    if (input.hasOwnProperty("addressLine2")) {
      if (input.addressLine2)
        address  = (address == "") ? input.addressLine2 : address + ", "
          + input.addressLine2;
    }

    if (address.length > 0) {
      address = address + "\n";
    }

    if(input.hasOwnProperty("city")){
      if (input.city)
        address  = (address == "") ? input.city : address
          + input.city;
    }

    if(input.hasOwnProperty("state")){
      if (input.state)
        address  = (address == "") ? input.state : address + ", "
          + input.state;
    }

    if(input.hasOwnProperty("country")){
      if (input.country)
        address  = (address == "") ? input.country : address + ", "
          + input.country;
    }

    if(input.hasOwnProperty("zipcode")){
      if (input.zipcode)
        address  = (address == "") ? input.zipcode : address + ", "
          + input.zipcode;
    }

    return this.trimText(address);
  }

  getSubjects = (input) => {
    var sub = "";
    if (input.subject && input.subject.length > 0){
      input.subject.map((item, i) => {
        if (i == input.subject.length - 1)
          sub = sub + item;
        else
          sub = sub + item + ", ";
      });
      sub = "Subjects : " + sub;
    }
    return (sub == "") ? sub : this.trimText(sub) + "\n";
  }

  getOrg = (input) => {
    if (input.orgName && input.orgName != "")
      return this.trimText(input.orgName) + "\n";
    else
      return "";
  }

  getPosition = (input) => {
    if (input.role && input.role != "")
      return this.trimText(input.role) + ", ";
    else
      return "";
  }

  getDegree = (input) => {
    if (input.degree && input.degree != "")
      return this.trimText(input.degree, 30) + "\n"
    else
      return "";
  }

  getGrade = (input) => {
    var grade = "";
    if (input.grade && input.grade != "")
      grade = grade + input.grade + " ";
    if (input.percentage && input.percentage != "")
      grade = grade + "(" + input.percentage + "%)"
    return (grade == "") ? grade : "Grade : " + grade + "\n";
  }

  getUniv = (input) => {
    if (input.boardOrUniversity && input.boardOrUniversity != "")
      return this.trimText(input.boardOrUniversity);
    else
      return "";
  }

  getDetails = (input) => {
    var det = "";
    if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.EXPERIENCE) {
      det = this.getPosition(input) + this.getOrg(input) +
        this.getSubjects(input) + this.getDate(input);
        this.currJobFlag = this.getCurrentJobStatus();
    } else if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.EDUCATION) {
      det = this.getDegree(input) + this.getDate(input) +
        this.getGrade(input) +
        this.getUniv(input);
    } else {
      det = this.getAddress(input);
    }
    return det;
  }

  trimText = (text, max) => {
    var maxChar = max || 30;
    if (text.length > maxChar) {
      return text.substring(0, maxChar) + "...";
    }
    return text;
  }

  getBody(input) {
    return (<LinearLayout
              width="0"
              height="wrap_content"
              orientation="vertical"
              padding="12,0,0,16"
              weight="5.5">

                    <TextView
                    width="wrap_content"
                    height="wrap_content"
                    text={this.getTitle(input)}
                    enableEllipse = "true"
                    style={window.__TextStyle.textStyle.CARD.HEADING}/>

                    <TextView
                    width="wrap_content"
                    height="wrap_content"
                    text={this.getDetails(input)}
                    style={window.__TextStyle.textStyle.HINT.REGULAR}/>

                </LinearLayout>)
  }

  experienceBody = () => {

   if(this.jobs.length <= 0){
     return(
       <LinearLayout
       width="wrap_content"
       height="wrap_content"/>);
   }

   this.jobs = this.sortDatewise(this.jobs);
    var cards = this.jobs.map((item, i) => {
      return (<LinearLayout
                width="match_parent"
                height="wrap_content"
                padding="0,0,0,0">

                <LinearLayout
                  background={window.__Colors.WHITE_F4}
                  margin = "0, 5, 0, 0"
                  width="44"
                  height="44"/>

                {this.getBody(item)}
                {this.getEditButton(item)}

                </LinearLayout>)

    });

    return cards;

  }

  sortDatewise = (jobs) => {
    if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.EXPERIENCE) {

      return jobs.sort(
        function (a,b) {
            if(a.hasOwnProperty("endDate") && b.hasOwnProperty("endDate"))
            {
                if(b.isCurrentJob)
                  return 1;
                else if(a.endDate == null)
                  return -1;
                else if(b.endDate == null && !a.isCurrentJob)
                   return 1;

                var a1 = new Date(a.endDate);
                var b1 = new Date(b.endDate);

                return (b1.getTime()-a1.getTime());
            }
            else if(!a.hasOwnProperty("endDate") && b.hasOwnProperty("endDate"))
            {
                return 1;
            }
            else {
                return -1;
            }
        }
      );
    } else if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.EDUCATION) {
      return jobs.sort(
        function (a,b) {
            if(a.hasOwnProperty("yearOfPassing") && b.hasOwnProperty("yearOfPassing"))
            {
                if(a.yearOfPassing==null)
                  return 1;
                if(b.yearOfPassing==null)
                  return -1;

                return (b.yearOfPassing-a.yearOfPassing);
            }
            else if(!a.hasOwnProperty("yearOfPassing") && b.hasOwnProperty("yearOfPassing"))
            {
                return 1;
            }
            else {
                return -1;
            }
        }
      );
    }
    else {
      return jobs;
    }
  }

  render() {
    this.layout = (

              <LinearLayout
                width="match_parent"
                height="match_parent"
                margin="0,0,0,0"
                orientation="vertical"
                >

                {this.getLineSeperator()}

                {this.getHeader()}

                {this.experienceBody()}

              </LinearLayout>



    )
    return this.layout.render();
  }
}



module.exports = ProfileExperiences;
