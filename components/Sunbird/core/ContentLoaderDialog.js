var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");

class ContentLoaderDialog extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      'progressContainer',
      "parentContainer",
      "btnContainer",
      "loadingContentText"
    ]);

    this.state = state;
    window.__ContentLoaderDialog = this;

    this.isVisible = false;
    this.handleClickCallback = null;
    this.isButtonVisible = false;
  }

  setClickCallback = (callback) => {
    this.handleClickCallback = callback;
  }

  show = () => {
    Android.runInUI(
      this.set({
        id: this.idSet.parentContainer,
        visibility: "visible"
      }),
      null
    );
    this.updateProgressBar(0);
    this.isVisible = true;
  }

  hide = () => {
    Android.runInUI(
      this.set({
        id: this.idSet.parentContainer,
        visibility: "gone"
      }),
      null
    );
    this.isVisible = false;
    if (this.handleClickCallback)
      this.handleClickCallback = null;
  }

  getVisible = () => {
    return this.isVisible;
  }

  handleClick = () => {
    if (this.handleClickCallback)
      this.handleClickCallback();
  }

  updateProgressBar = (pStatus) => {
    this.replaceChild(this.idSet.progressContainer, this.getProgressBar(pStatus).render(), 0);
    this.replaceChild(this.idSet.loadingContentText, this.getLoadingContentText(pStatus).render(), 0);
    if (pStatus > 0 && pStatus < 100) {
      if (!this.isButtonVisible) {
        this.isButtonVisible = true;
        Android.runInUI(this.set({
          id: this.idSet.btnContainer,
          visibility: "visible"
        }), 0);
      }
    } else {
      if (this.isButtonVisible) {
        this.isButtonVisible = false;
        Android.runInUI(this.set({
          id: this.idSet.btnContainer,
          visibility: "gone"
        }), 0);
      }
    }
  }

  getButton = () => {
    return (
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        gravity="center"
        margin="0,24,0,24">
        <TextView
          height="wrap_content"
          width="wrap_content"
          onClick={this.handleClick}
          text={window.__S.CANCEL}
          style={window.__TextStyle.textStyle.CARD.BODY.BLUE_R}
          color={window.__Colors.PRIMARY_ACCENT}
          padding="16,10,16,10" />
      </LinearLayout>
    );
  }

  getProgressBar = (pStatus) => {
    var completedProgress = pStatus;
    var remainingProgress = (100 - parseInt(pStatus)) + "";
    return (<LinearLayout
      width="250"
      root="true"
      height="20">
      <LinearLayout
        width="0"
        height="10"
        background={window.__Colors.LIGHT_BLUE}
        weight={completedProgress} />
      <LinearLayout
        width="0"
        background={window.__Colors.PRIMARY_BLACK_22}
        height="10"
        weight={remainingProgress} />
    </LinearLayout>)
  }

  getLoadingContentText = (pStatus) => {
    var loadingPercentage = window.__S.LOADING_CONTENT;
    if( pStatus > 0 && pStatus <= 100)
      loadingPercentage+=" ("+pStatus+"%)";
    return (
      <LinearLayout
        width="match_parent"
        height="match_parent"
        orientation="vertical"
        gravity="center">
      <TextView
        width="wrap_content"
        height="wrap_content"
        margin="0,0,0,32"
        text={loadingPercentage } />
        </LinearLayout>
    )

  }

  render() {
    this.layout = (
      <RelativeLayout
        width="match_parent"
        height="match_parent"
        id={this.idSet.parentContainer}
        visibility="gone"
        clickable="true"
        root="true">
        <LinearLayout
          width="match_parent"
          height="match_parent"
          orientation="vertical"
          margin="0,0,0,0"
          clickable="true"
          background={window.__Colors.WHITE}
          gravity="center">

          <LinearLayout
            height="wrap_content"
            width="match_parent"
            gravity="center"
            orientation="vertical"
            id={this.idSet.loadingContentText}>

          <TextView
            width="wrap_content"
            height="wrap_content"
            margin="0,0,0,32"
            text={window.__S.LOADING_CONTENT} />

            </LinearLayout>

          <LinearLayout
            height="wrap_content"
            width="match_parent"
            gravity="center"
            orientation="vertical"
            id={this.idSet.progressContainer}>


            {this.getProgressBar(0)}


          </LinearLayout>

        </LinearLayout>
        <LinearLayout
          width="match_parent"
          height="wrap_content"
          alignParentBottom="true, -1"
          gravity="center"
          visibility="gone"
          id={this.idSet.btnContainer}
          margin="0,8,0,8">
          {this.getButton()}
        </LinearLayout>
      </RelativeLayout>
    );

    return this.layout.render();
  }
}

module.exports = ContentLoaderDialog;
