
var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");


var TextView = require("@juspay/mystique-backend/src/android_views/TextView");


class CountDownTimer extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "m0",
      "s0",
      "divider"
    ]);
    this.displayName = "count_down_timer";
    this.totalTime = parseInt(this.props.totalTime);

  }


  setStartTime = (startTime) => {
    this.totalTime = startTime;
    this.setTime(this.totalTime);
  }

  afterRender = () => {
    this.setTime(this.totalTime);
    this.startCountdown();
  }

  handleCountDownFinished = () => {
    this.props.onTimerEnd();
  }

  startCountdown = () => {
    if (this.totalTime < 0) {
      this.handleCountDownFinished();
      return;
    }
    this.setTime(this.totalTime);
    this.totalTime--;

    var _this = this;
    setTimeout(function() {
      _this.startCountdown();
    }, 1000);
  }

  setTime = (time) => {
    var cTime = parseInt(time)
    var minutes = parseInt(cTime / 60);
    var seconds = cTime - minutes * 60;
    var hourse = parseInt(minutes / 60);

    var cmd = this.set({
      id: this.idSet.s0,
      text: ("0" + seconds).slice(-2)
    })

    cmd += this.set({
      id: this.idSet.m0,
      text: ("0" + minutes).slice(-2)
    })
    Android.runInUI(cmd, 0);
  }



  handleSelectionEvent = () => {
    this.setStatus(!this.selectedStatus);
    this.props.onItemSelected(this.props.index, this.selectedStatus);

  }

  render() {


    this.layout = (
      <LinearLayout
      width="match_parent"
      gravity="center"
      afterRender={this.afterRender}
      height="wrap_content">

        <TextView
          height="wrap_content"
          width="wrap_content"
          color="#123123"
          text="00"
          style = {window.__TextStyle.textStyle.CARD.TITLE.DARK}
          id={this.idSet.m0}/>

          <TextView
          height="wrap_content"
          width="wrap_content"
          text=":"
          style = {window.__TextStyle.textStyle.CARD.TITLE.DARK}
          id={this.idSet.divider}/>

          <TextView
          text="00"
          style = {window.__TextStyle.textStyle.CARD.TITLE.DARK}
          height="wrap_content"
          width="wrap_content"
          id={this.idSet.s0}/>

        
        
      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = CountDownTimer;
