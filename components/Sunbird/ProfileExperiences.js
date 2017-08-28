var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

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
              width="wrap_content"
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
        <ImageView
        width="18"
        height="18"
        imageUrl="ic_action_edit_blue"
        onClick={()=>{this.showPopUp(item)}}/>
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

  getBody(input) {
    var date = "";
    var title = input.jobName ? input.jobName : input.name;
    var address = "";

    if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.EDUCATION){
      if (input.yearOfPassing)
        date = "Year of passing : " + input.yearOfPassing;
    } else if (this.props.popUpType == window.__PROFILE_POP_UP_TYPE.EXPERIENCE) {
      var dateOptions = {month: "short", year: "2-digit"};
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
    } else {
      title = input.addType;
      address = input.addressLine1 + ", " + input.addressLine2;

      if(input.hasOwnProperty("city")){
        date = input.city ? input.city : "";
      }
      if(input.hasOwnProperty("state")){
        if (input.state)
          date  = (date == "") ? input.state : date + ", "
            + input.state;
      }

      if(input.hasOwnProperty("country")){
        if (input.country)
          date  = (date == "") ? input.country : date + ", "
            + input.country;
      }

      if(input.hasOwnProperty("zipcode")){
        if (input.zipcode)
          date  = (date == "") ? input.zipcode : date + ", "
            + input.zipcode;
      }
    }


    return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              orientation="vertical"
              margin="12,0,0,0">

                    <TextView
                    width="wrap_content"
                    height="wrap_content"
                    text={title}
                    style={window.__TextStyle.textStyle.CARD.HEADING}/>

                    <TextView
                    width="wrap_content"
                    height="wrap_content"
                    visibility = {address == "" ? "gone" : "visible"}
                    text={address}
                    style={window.__TextStyle.textStyle.HINT.REGULAR}/>

                    <TextView
                    width="wrap_content"
                    height="wrap_content"
                    text={date}
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
                width="wrap_content"
                height="wrap_content"
                gravity="center_vertical"
                margin="0,16,0,0">

                <LinearLayout
                  background={window.__Colors.WHITE_F4}
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
                width="wrap_content"
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
