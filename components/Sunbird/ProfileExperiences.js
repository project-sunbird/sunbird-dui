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

  }


  getHeader() {
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

              <TextView
              width="wrap_content"
              height="wrap_content"
              text="Add"
              padding = "8,8,8,8"
              onClick = {() => this.showPopUp()}
              visibility = {(this.isEditable == "true") ? "visible" : "gone"}
              style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>

              </LinearLayout>)
  }

  getLineSeperator = () => {
    return (<LinearLayout
              width="match_parent"
              height="1"
              margin="0,0,0,24"
              background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  getEditButton = (item) =>{
    if(this.isEditable == "true"){
    return (
      <LinearLayout
      height="wrap_content"
      width="wrap_content"
      padding = "8,8,8,8"
      gravity="center">
      <ViewWidget
        height="0"
        weight="1"/>
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
    console.log(item, "showPopUp");

    if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.EXPERIENCE) {
      window.__ExperiencePopUp.data=item;
      window.__ExperiencePopUp.show();
    } else if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.EDUCATION) {
      window.__EducationPopUp.data=item;
      window.__EducationPopUp.show();
    } else if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.ADDRESS) {
      window.__AddressPopUp.data=item;
      window.__AddressPopUp.show();
    }
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
          date = date + " - Present";
        }
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

    return address;
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
    return (sub == "") ? sub : sub + "\n";
  }

  getOrg = (input) => {
    if (input.orgName && input.orgName != "")
      return input.orgName + "\n";
    else
      return "";
  }

  getPosition = (input) => {
    if (input.role && input.role != "")
      return input.role + ", ";
    else
      return "";
  }

  getDegree = (input) => {
    if (input.degree && input.degree != "")
      return input.degree + "\n"
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
      return input.boardOrUniversity;
    else
      return "";
  }

  getDetails = (input) => {
    var det = "";
    if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.EXPERIENCE) {
      det = this.getPosition(input) + this.getOrg(input) +
        this.getSubjects(input) + this.getDate(input);
    } else if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.EDUCATION) {
      det = this.getDegree(input) + this.getDate(input) +
        this.getGrade(input) +
        this.getUniv(input);
    } else {
      det = this.getAddress(input);
    }
    return det;
  }

  getBody(input) {
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              orientation="vertical"
              padding="12,0,0,0">

                    <TextView
                    width="wrap_content"
                    height="wrap_content"
                    text={this.getTitle(input)}
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
    var cards = this.jobs.map((item, i) => {
      return (<LinearLayout
                width="match_parent"
                height="wrap_content"
                padding="0,8,0,0">

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

  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,0,0,24"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }


  render() {
    this.layout = (

              <LinearLayout
                width="match_parent"
                height="match_parent"
                margin="0,16,0,0"
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
