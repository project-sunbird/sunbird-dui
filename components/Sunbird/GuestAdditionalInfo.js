var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
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

    //this.data = this.props.data;
    console.log("this.data", this.data);

    //initialise data
    this.maxLen = 30;
    this.languages = "";
    this.state = "Karnataka";
    this.grade = "Grade 1";
    this.medium = "English";
    this.syllabus = ""


    if( this.data && this.data.hasOwnProperty("grade")&&this.data.grade.length>0){
    this.data.grade.map((item, i) => {
      var append = ",";
      if (i == this.data.grade.length - 1) append = "";
      this.grade += item + append;
    });
  }
    this.grade = utils.cropText(this.grade, this.maxLen);

    this.info = [{
      name: window.__S.STATE,
      value : this.state
    },
    {
      name: window.__S.MEDIUM_GUEST,
      value : this.medium
    },
    {
      name: window.__S.GRADE,
      value : this.grade
    },
    {
      name: window.__S.SYLLABUS,
      value : this.syllabus
    }]

    this.visibility = "gone"
    if (this.props.editable == "true"){
      this.visibility = "visible";
    }
  }

  getRows = (input)=> {
    var rows = this.info.map((item, i) => {
      return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              margin="0,16,0,0"
              visibility = {(item.value && item.value != "") ? "visible" : "gone"}>

              <TextView
              width="wrap_content"
              height="wrap_content"
              textAllCaps = "true"
              text={item.name}
              style={window.__TextStyle.textStyle.HINT.SEMI}/>

              <ViewWidget
              height="0"
              weight="1"/>

              <TextView
              width="wrap_content"
              height="wrap_content"
              text={item.value}
              style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>

              </LinearLayout>)
    });

    return rows;
  }

  getBody = () => {
    return (<LinearLayout
            width="wrap_content"
            height="wrap_content"
            margin="0,0,0,16"
            orientation="vertical">

            {this.getRows()}

            </LinearLayout>)
  }

  getHeader = () =>{
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              padding="0,16,0,0">

              <TextView
                width="wrap_content"
                height="wrap_content"
                text={window.__S.PROFILE_DETAILS_TITLE}
                style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

              <ViewWidget
              height="0"
              weight="1"/>
              <LinearLayout
          width = "wrap_content"
          height = "wrap_content"
          padding = "10,5,0,10"
          visibility = {"true"}
          onClick={this.handleEditProfileClick}>
          <ImageView
          width="18"
          height="18"
          imageUrl="ic_action_edit_blue"/>
        </LinearLayout>
              </LinearLayout>)
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
                id = {this.idSet.holder}
                gravity = "center">

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
    // var whatToSend = { "profile" : JSON.stringify(this.data)}
    var whatToSend = { "profile" : JSON.stringify({})}
    var event ={ tag: "OPEN_EditGuestProfileActivity", contents: whatToSend }
    window.__runDuiCallback(event);

  }

}



module.exports = GuestAdditionalInfo;
