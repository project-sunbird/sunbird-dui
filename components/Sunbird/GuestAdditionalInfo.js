var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var utils = require('../../utils/GenericFunctions')

var _this;
class GuestAdditionalInfo extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([
      "holder"
    ]);
    _this = this;

    console.log("profileData in GuestAdditionalInfo", this.props.profileData);

    //initialise data
    this.profileData = this.props.profileData;
    this.maxLen = 30;
    this.handle = this.profileData.handle;
    this.medium = this.profileData.medium ? this.profileData.medium.join(", ") : "";
    this.grade = this.profileData.grade ? this.profileData.grade.join(", ") : "";
    this.board = this.profileData.board ? this.profileData.board.join(", ") : "";
    this.subjects = this.profileData.subject ? this.profileData.subject.join(", ") : "";

    if (this.subjects == "__failed") {
      this.subjects = "";
    }

    this.info = [{
      name: window.__S.BOARD,
      value: this.board
    },
    {
      name: window.__S.GRADE,
      value: this.grade
    },
    {
      name: window.__S.SUBJECTS,
      value: this.subjects
    },
    {
      name: window.__S.MEDIUM_GUEST,
      value: this.medium
    }];
  }

  getRows = ()=> {
    var rows = this.info.map((item, i) => {
      return (<LinearLayout
        width="match_parent"
        height="wrap_content"
        margin="0,16,0,0"
        visibility={(item.value && item.value != "") ? "visible" : "gone"}>

        <RelativeLayout
         width="wrap_content"
         gravity="left">

        <TextView
          width="wrap_content"
          height="wrap_content"
          textAllCaps="true"
          gravity="left"
          text={item.name}
          style={window.__TextStyle.textStyle.HINT.SEMI} />

          </RelativeLayout>

          <RelativeLayout
          width="match_parent"
          gravity="right">

        <TextView
          width="wrap_content"
          height="wrap_content"
          enableEllipse="true"
          gravity="right"
          padding = "16,0,0,0"
          maxLines = "1"
          text={item.value}
          style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK} />
          </RelativeLayout>
          
      </LinearLayout>);
    });

    return rows;
  }

  getBody = () => {
    return (<LinearLayout
      width="match_parent"
      height="wrap_content"
      margin="0,0,0,16"
      orientation="vertical">

      {this.getRows()}
    </LinearLayout>);
  }

  getHeader = () =>{
    return (<LinearLayout
      width="wrap_content"
      height="wrap_content"
      padding="0,16,0,0"
      gravity="center">

      <TextView
        width="wrap_content"
        height="wrap_content"
        text={window.__S.PROFILE_DETAILS_TITLE}
        style={window.__TextStyle.textStyle.CARD.TITLE.DARK} />

      <ViewWidget
        height="0"
        weight="1" />

      <LinearLayout
        width="wrap_content"
        height="wrap_content"
        padding="10,5,0,10"
        visibility={"true"}
        onClick={this.handleEditProfileClick}>

        <ImageView
          width="18"
          height="18"
          imageUrl="ic_action_edit_blue" />
      </LinearLayout>
    </LinearLayout>);
  }

  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,16,0,0"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  render() {
    this.layout = (
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        margin="0,0,0,0"
        orientation="vertical"
        id={this.idSet.holder}>

        {this.getLineSeperator()}
        {this.getHeader()}
        {this.getBody()}
      </LinearLayout>
    )
    return this.layout.render();
  }

  handleEditProfileClick = () => {
    if(!JBridge.isNetworkAvailable()){
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
      return ;
    }
    var whatToSend = { "profile" : JSON.stringify(this.profileData)}
    var event ={ tag: "OPEN_EditGuestProfileActivity", contents: whatToSend }
    window.__runDuiCallback(event);

  }
}



module.exports = GuestAdditionalInfo;
