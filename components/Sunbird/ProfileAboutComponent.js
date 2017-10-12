
var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var objectAssign = require('object-assign');

window.R = require("ramda");
var PageOption = require("../../components/Sunbird/core/PageOption");
class ProfileAboutComponent extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "PROFILE_ABOUT_SCREEN"

    this.setIds([
      "pageOption",
    ]);
  }

  afterRender = () => {

  }
  handleEnrollClick = (data) => {
    if (data === "ENROLL NOW") {
      console.log(data)

      this.replaceChild(this.idSet.parentContainer, this.getEnrolledContent().render(), 0);



    }
  }

  render() {
    var btn = {
      text : "EDIT PROFILE",
      onClick : this.handleEnrollClick
    }
    var buttonList = [btn];
    this.layout = (

      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        height="match_parent"
        alignParentTop="true"
        >

        <TextView
          text=""
          height="wrap_content"
          margin="16,12,16,16"
          style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>



      <ViewWidget
        weight="1"
        />
       <PageOption
           width="match_parent"
           id={this.idSet.pageOption}
           buttonItems={buttonList}
           hideDivider="true"/>

    </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = ProfileAboutComponent;
