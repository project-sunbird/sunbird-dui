
var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");

var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");

class HorizontalProgressBar extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([
      "progressContainer"

    ]);

    this.displayName = "horizontal_progress_card";

    this.currentProgress = this.props.currentProgress != undefined ? this.props.currentProgress : "0";
    this.totalProgress = this.props.totalProgress != undefined ? this.props.totalProgress : "100";

  }

  updateProgressBar = (pStatus) => {
    this.currentProgress = pStatus
    var progressBar = this.getProgressBar();
    this.replaceChild(this.idSet.progressContainer, progressBar.render(), 0)
  }

  getProgressBar = () => {
    var percentL = parseFloat(this.currentProgress) / parseFloat(this.totalProgress);
    var percentR = (1 - percentL);

    var myProgressColor = percentL==1 ? window.__Colors.SUCCESS_GREEN : (this.props.progressBarColor===undefined?window.__Colors.ORANGE:this.props.progressBarColor) 
    
    return (
      <LinearLayout
      height="2"
      root="true"
      width="match_parent">
        <ViewWidget
          width="0"
          weight={percentL}
          background={myProgressColor}
          height="2"/>
        <ViewWidget
          width="0"
          weight={percentR}
          background={window.__Colors.PRIMARY_BLACK_22}
          height="2"/>

      </LinearLayout>)
  }


  render() {


    this.layout = (

      <LinearLayout
          width="match_parent"
          id={this.idSet.progressContainer}
          height="wrap_content"
          root="true">

            {this.getProgressBar()}

        </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = HorizontalProgressBar;
