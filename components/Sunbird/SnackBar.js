

var dom = require("@juspay/mystique-backend/src/doms/android");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");

class SnackBar extends View {
  constructor(props, children) {
    super(props, children);

    this.displayName = "CustomSnackBar";

    window.__Snackbar = this;

    this.totalTime = 0; //Total time required to render all the snackbar in the queue
    this.totalSnackTime = 1300; //Time for which snackbar is shown, excluding fade in and fade out time
    this.showTime = 2000; //Total time required to show one Snackbar, including both fade times
    this.fadeTime = 350; //Fading animation time
    this.delayTime = 100; //Time delay between render of two Snackbars

    window.totalTime = this.totalTime

    this.setIds([
      "message",
      "action",
      "container"
    ]);
  }

//show(Snackbar text, type of Snackbar, action text, onclick of action text)
  show = (text, status, actionText, onClick) => {
    console.log("Snackbar queued: " + text + ", status: " + status + " @" + this.totalTime);

    setTimeout(() => {
      this.setValues(text, status, actionText, onClick);

      var cmd = this.set({
        id: this.idSet.container,
        visibility: "visible",
        a_translationY: "0",
        a_duration: "360"
      });
      Android.runInUI(cmd, null);

    }, this.totalTime);

    setTimeout(() => {
      this.hide();
    }, this.totalTime + this.showTime - this.fadeTime - this.delayTime) //Time @ which fade out animation should start

    this.totalTime += this.showTime + this.delayTime; //Time required to display one Snackbar and delayTime added to totalTime
  }

  hide = () => {
    var cmd = this.set({
      id: this.idSet.container,
      a_translationY: "360",
      a_duration: "360"
    })
    Android.runInUI(cmd, null);
    cmd = this.set({
      id: this.idSet.container,
      visibility: "gone"
    })

    setTimeout(() => {Android.runInUI(cmd, null)}, this.fadeTime)

    this.totalTime -= this.showTime //After rendering one Snackbar, its time is removed from totalTime
  }

  setValues = (text, status, actionText, onClick) => {
    let background = null;
    if (status == "success") {
      background = window.__Colors.SUCCESS_GREEN;
    } else if (status == "error") {
      background = window.__Colors.ERROR_RED;
    } else {
      background = window.__Colors.DARK_GRAY;
    }
    var cmd = this.set({
      id: this.idSet.container,
      background: background
    })
    cmd += this.set({
      id: this.idSet.message,
      text: text
    })
    if (actionText != undefined && onCLick != undefined) {
      cmd += this.set({
        id: this.idSet.action,
        visibility: visible,
        text: actionText,
        onCLick: onClick
      })
    }

    Android.runInUI(cmd, 0);
  }

  render() {
    var text = "";
    var actionText = null;
    var background = window.__Colors.DARK_GRAY;
    this.layout = (
      <LinearLayout
            height="wrap_content"
            padding = "0,10,0,10"
            alignParentBottom = "true,-1"
            translationY = "360"
            id={this.idSet.container}
            gravity="center_vertical"
            width="match_parent"
            background = {background}>

            <TextView
              id = {this.idSet.message}
              width = "0"
              weight= "1"
              gravity="center_vertical"
              height = "match_parent"
              style = {window.__TextStyle.textStyle.CARD.BODY.LIGHT}
              gravity = "center_vertical"
              text = {text ? text : ""}
              padding="16,8,8,8" />

            <TextView
              id = {this.idSet.action}
              width = "wrap_content"
              height = "52"
              gravity="center_vertical"
              style = {window.__TextStyle.textStyle.CARD.BODY.LIGHT}
              gravity = "center_vertical"
              onClick= {() => {}}
              visibility = {actionText ? "visible" : "gone"}
              text = {actionText ? actionText : ""}
              padding="8,8,16,8" />
      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = SnackBar;
