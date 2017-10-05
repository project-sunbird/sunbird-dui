var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var RatingBar = require("@juspay/mystique-backend/src/android_views/RatingBar");;
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");

var _this;
class ProfileCreations extends View {
  constructor(props, children) {
    super(props, children);
    console.log("HAKUNA MATATA",this.props);
    this.setIds([

    ]);
    _this=this;
    this.completed = 0.65;
    this.followingPpl = "180";
    this.followedBy = "60";
    this.followingGrp = "05";
    this.isEditable = this.props.editable;

  }


  getHeader = () => {
    var percentL = parseFloat(this.props.data.completeness) / (100.0)
    var percentR = (1 - percentL);
    return (
        <LinearLayout
          margin="0,0,0,16"
          orientation="vertical"
          width="match_parent"
          height="wrap_content">

          <LinearLayout
            orientation = "horizontal"
            width = "match_parent"
            height = "wrap_content">
            <LinearLayout
              weight="1"
              padding="0,8,0,8">
              <TextView
              width="match_parent"
              height="wrap_content"
              text={window.__S.YOUR_PROFILE_IS.format(this.props.data.completeness)}
              style={window.__TextStyle.textStyle.HINT.REGULAR}/>
            </LinearLayout> 
            {this.getEditButton()}
          </LinearLayout>
          <LinearLayout
          width = "match_parent"
          height = "6"
          margin = "0, 10, 0, 0"
          cornerRadius = "2"
          orientation = "horizontal">
          <LinearLayout
            multiCorners = {"10,0,0,10," + window.__Colors.PRIMARY_ACCENT}
            width = "0"
            height = "match_parent"
            weight = {percentL}/>
          <LinearLayout
            alpha="0.3"
            multiCorners = {"0,10,10,0," + window.__Colors.PRIMARY_BLACK}
            width = "0"
            height = "match_parent"
            weight = {percentR}/>
        </LinearLayout>
        </LinearLayout>
      )
  }

  getEditButton=()=>{
    var editButtonText=this.props.data.missingFields[0];
    if(editButtonText=="address"||editButtonText=="location"){
        editButtonText=window.__S.TITLE_ADDRESS;
      }
    else if(editButtonText=="education"){
        editButtonText=window.__S.TITLE_EDUCATION;
      }
    else if(editButtonText=="jobProfile"){
        editButtonText=window.__S.TITLE_EXPERIENCES;
      }
    else if(editButtonText=="dob"){
        editButtonText=window.__S.DATE_OF_BIRTH;
      }
    else if(editButtonText=="grade"){
        editButtonText=window.__S.GRADE;
      }
    else if(editButtonText=="gender"){
        editButtonText=window.__S.GENDER;
      }
    else if(editButtonText=="profileSummary"){
        editButtonText=window.__S.DESCRIPTION;
      }
    else if(editButtonText=="lastName"){
         editButtonText=window.__S.LAST_NAME;
      }
    else{
      editButtonText="Profile details";
    }
    return (<TextView
    padding="16,8,0,8"
    width="wrap_content"
    height="wrap_content"
    visibility={this.props.data.completeness==100?"gone":"visible"}
    text= {"+ "+window.__S.ADD+" "+editButtonText}
    style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}
    onClick={this.handleEditProfileClick}/>);
  }
  getHorizontalSpace() {
    return (<LinearLayout
            width="1"
            height="match_parent"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  getFollowBtn = () => {
    return (
      <LinearLayout
        width = "wrap_content"
        height = "wrap_content"
        cornerRadius = "3"
        orientation = "horizontal"
        gravity = "center"
        margin = "0, 0, 0, 10"
        padding = "10, 3, 10, 3"
        stroke ={ "2," + window.__Colors.PRIMARY_ACCENT}>
        <ImageView
          imageFromUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR1X3cm5xzR4D1W9oPb2QWioKlrfLVd0DvXFUNqSjZfg-M0bpc"
          height = "10"
          width = "10" />
        <ViewWidget
          width = "10" />
        <TextView
          text = {window.__S.FOLLOW}
          style={window.__TextStyle.textStyle.CARD.BODY.DARK.BLUE_R} />
      </LinearLayout>
    )
  }

  getFollowing = () => {
    return (
      <LinearLayout
        width = "match_parent"
        height = "wrap_content"
        orientation = "horizontal"
        gravity = "center"
        visibility="gone">

        <LinearLayout
          width = "0"
          weight = "1"
          height = "wrap_content"
          orientation = "vertical"
          gravity = "center">

          <TextView
          width="wrap_content"
          height="wrap_content"
          text={this.followingPpl}
          style={window.__TextStyle.textStyle.CARD.TITLE.BIG_BLUE}/>

          <TextView
          width="wrap_content"
          height="wrap_content"
          text={window.__S.PEOPLE_YOU_FOLLOW}
          style={window.__TextStyle.textStyle.HINT.REGULAR}/>

        </LinearLayout>

        {this.getHorizontalSpace()}

        <LinearLayout
          width = "0"
          weight = "1"
          height = "wrap_content"
          orientation = "vertical"
          gravity = "center">

          <TextView
          width="wrap_content"
          height="wrap_content"
          text={this.followingGrp}
          style={window.__TextStyle.textStyle.CARD.TITLE.BIG_BLUE}/>

          <TextView
          width="wrap_content"
          height="wrap_content"
          text={window.__S.GROUPS_YOU_FOLLOW}
          style={window.__TextStyle.textStyle.HINT.REGULAR}/>

        </LinearLayout>

        {this.getHorizontalSpace()}

        <LinearLayout
          width = "0"
          weight = "1"
          height = "wrap_content"
          orientation = "vertical"
          gravity = "center">

          <TextView
          width="wrap_content"
          height="wrap_content"
          text={this.followedBy}
          style={window.__TextStyle.textStyle.CARD.TITLE.BIG_BLUE}/>

          <TextView
          width="wrap_content"
          height="wrap_content"
          text={window.__S.PEOPLE_WHO_FOLLOW_YOU}
          style={window.__TextStyle.textStyle.HINT.REGULAR}/>

        </LinearLayout>

      </LinearLayout>
    )
  }

  render() {
    this.layout= (
              <LinearLayout
                margin="0,24,0,0"
                width = "match_parent"
                height = "wrap_content"
                orientation="vertical">

                <LinearLayout
                  orientation = "vertical"
                  width = "match_parent"
                  height = "match_parent"
                  visibility = {(this.isEditable == "true") ? "visible" : "gone"}>
                    {this.getHeader()}
                </LinearLayout>

                <LinearLayout
                  orientation = "vertical"
                  width = "match_parent"
                  height = "match_parent"
                  gravity = "center"
                  visibility = {(this.isEditable != "true") ? "visible" : "gone"}>
                    {this.getFollowBtn()}
                </LinearLayout>

                <LinearLayout
                  orientation = "horizontal"
                  width = "match_parent"
                  height = "match_parent"
                  gravity = "center">
                    {this.getFollowing()}
                </LinearLayout>
              </LinearLayout>
    )
    return this.layout.render();
  }

  handleEditProfileClick = () => {
    var editButtonText=this.props.data.missingFields[0];
    if(editButtonText=="address"||editButtonText=="location"){
      window.__AddressPopUp.data=undefined;
      window.__AddressPopUp.show();
      return ;
      }
    else if(editButtonText=="education"){
      window.__EducationPopUp.data=undefined;
      window.__EducationPopUp.show();
      return;
      }
    else if(editButtonText=="jobProfile"){
      window.__ExperiencePopUp.data=undefined;
      window.__ExperiencePopUp.show();
      return;
      }
        var whatToSend = { "profile" : JSON.stringify(this.props.data)}
        var event ={ tag: "OPEN_EditProfileActivity", contents: whatToSend }
        window.__runDuiCallback(event);
    
      }

}



module.exports = ProfileCreations;
