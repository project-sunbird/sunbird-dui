var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");

var _this;
class ProfileHeader extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([

    ]);
    console.log("this.props.data", this.props.data);
    this.isEditable = this.props.editable;
    this.userName = this.props.data.userName ? this.props.data.userName : "";
    this.imageUrl = this.props.data.avatar ? this.props.data.avatar : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR1X3cm5xzR4D1W9oPb2QWioKlrfLVd0DvXFUNqSjZfg-M0bpc";
    this.firstName = this.props.data.firstName ? this.props.data.firstName : this.userName
    this.lastName = this.props.data.lastName ? this.props.data.lastName : ""
    this.address = (this.props.data.address && this.props.data.address.length > 0) ? this.props.data.address : ""
    // this.orgName=this.props.data.rootOrg.orgName?this.props.data.rootOrg.orgName:"";

    if (this.props.data.rootOrg != null && this.props.data.rootOrg.hasOwnProperty("orgName")) {
      this.orgName = this.props.data.rootOrg.orgName
    }
    else
      this.orgName = "";
    if (this.props.data.rootOrg != null && this.props.data.rootOrg.contactDetail != null && this.props.data.rootOrg.contactDetail.length > 0) {
      try {
        var temp = JSON.parse(this.props.data.rootOrg.contactDetail);
      } catch (err) {
        console.log("JSON.parse(this.props.data.rootOrg.contactDetail) failed, using fallback");
        var temp = this.props.data.rootOrg.contactDetail;
      }
      this.orgEmail = temp[0].email ? temp[0].email : "";
    }
    else {
      this.orgEmail = ""
    }
    this.lastLoginTime = this.formatTime(this.props.data.lastLoginTime);
  }

  formatTime = (data) => {
    if (data == null || data == "") return "";
    var date = new Date(data);
    var option = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" };
    var date = date.toLocaleTimeString("en-us", option);
    console.log("utc time - " + data + ", local time - " + date);
    return date;
  }

  sendEmail = () => {
    if (this.orgEmail != "") {
      JBridge.sendEmail(this.orgEmail);
    }
    else {
      window.__Snackbar.show(window.__S.NO_EMAIL_FOUND)
    }
  }


  getUserName = () => {
    console.log("username", this.userName)
    if (window.__loggedInState != "GUEST") {
      return (<LinearLayout
        width="wrap_content"
        height="wrap_content"
        gravity="center"
        background="#e8e8e8"
        cornerRadius="5"
        padding="5,5,5,5"
        margin="0,0,0,5"
        visibility={this.userName == null || this.userName == undefined || this.userName == "" ? "gone" : "visible"}
        alpha="0.7">
        <TextView
          width="wrap_content"
          height="wrap_content"
          enableEllipse="true"
          text={window.__S.USER_NAME_PROFILE + "-" + this.userName}
          style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK} />
      </LinearLayout>);
    }
    else {
      return (<LinearLayout />)
    }
  }
  getEmailPart = () => {
    return (
      <LinearLayout
        width="wrap_content"
        height="wrap_content"
        gravity="center"
        background="#e8e8e8"
        cornerRadius="5"
        padding="5,5,5,5"
        visibility={this.orgName == null || this.orgName == undefined || this.orgName == "" || this.orgEmail == "" ? "gone" : "visible"}
        margin="0,5,0,0">
        <LinearLayout
          width="match_parent"
          height="match_parent"
          gravity="center"
          orientation="horizontal"
          alpha="0.7"
          onClick={this.sendEmail}>
          <TextView
            width="wrap_content"
            height="wrap_content"
            enableEllipse="true"
            text={this.orgName}
            style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK} />
          <ImageView
            width="30"
            height="18"
            imageUrl="ic_mail_outline" />
        </LinearLayout>
      </LinearLayout>);
  }

  capitalizeFirstLetter = (string) => {
    if (string != undefined) return string.charAt(0).toUpperCase() + string.slice(1);
    else return string;
  }

  showProfileImagePopup = () => {
    if (this.isEditable == "true" && window.__loggedInState != "GUEST") {
      window.__ProfileImagePopUp.show(this.imageUrl);
    }
  }

  render() {
    this.layout = (
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        gravity="center_horizontal"
        orientation="vertical">
        <TextView
          visibility={this.lastLoginTime == "" ? "gone" : "visible"}
          width="wrap_content"
          height="wrap_content"
          text={window.__S.LAST_LOGIN_TIME.format(this.lastLoginTime)}
          margin="0,0,0,16"
          style={window.__TextStyle.textStyle.HINT.REGULAR} />
        <ImageView
          width="80"
          height="80"
          circularImageUrl={"0," + this.imageUrl}
          stroke={"2," + "#d8d8d8"}
          cornerRadius="40"
          onClick={this.showProfileImagePopup} />
        <TextView
          width="wrap_content"
          height="wrap_content"
          text={this.capitalizeFirstLetter(this.firstName) + " " + this.capitalizeFirstLetter(this.lastName)}
          padding="0,10,0,2"
          style={window.__TextStyle.textStyle.HEADING.DARK} />

        {this.getUserName()}
        {this.getEmailPart()}

        <TextView
          width="wrap_content"
          height="wrap_content"
          visibility={(this.address && this.address != "") ? "visible" : "gone"}
          text={this.address}
          padding="0,0,0,8"
          style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR} />
      </LinearLayout>)
    return this.layout.render();
  }
}



module.exports = ProfileHeader;
