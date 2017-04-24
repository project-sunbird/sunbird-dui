var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var Styles = require("../../res/Styles");
var TextStyle = require("../../res/TextStyle");
var Colors = require('../../res/Colors');
var Loader = require('./Loader');
 
class Waiting extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "Waiting";
    this.setIds([
      "timer",
      "waitingBackground",
      "waitingComponent"
    ]);
    
    this.time = 90;
    this.timer = false;
  }
  
  showTimer = () => {  
    if(this.timer == true)
    return;

    this.timer = true;
    var cmd = "";

    cmd = this.set({
      id : this.idSet.waitingBackground,
      visibility : "visible"
    });

    cmd += this.set({
      id : this.idSet.waitingComponent,
      a_translationY : "0",
      a_duration : "360"
    });

    Android.runInUI(
      cmd,
      null
    );
  }

  startTimer = () =>{
    if(this.time > 0 && this.time < 90)
      return;

    this.time = 90;
    this.updateTimer();

    if(!this.hasOwnProperty('loader')) {
      this.loader = this.find('Loader')[0];      
    }
    
    this.loader.startLoader();
  }

  updateTimer = () =>{
    var cmd = "";

    cmd = this.set({
      id : this.idSet.timer,
      text : this.time + "s"
    });

    Android.runInUI(
      cmd,
      null
    );
    this.time = this.time - 1;
    
    if(this.time != -1) {
      setTimeout(() => {
        this.updateTimer();
      }, 1000);
    }
  }

  stopTimer = () =>{
   if(this.time == 0 || this.time == 90)
    return;
    this.time = 0;

    if(!this.hasOwnProperty('loader')) {
      this.loader = this.find('Loader')[0];      
    }

    this.loader.stopLoader();
  }
 

  hideTimer = () =>{
    if(this.timer == false)
    return;
    this.timer = false;
    var cmd = this.set({
      id : this.idSet.waitingComponent,
      a_translationY : "1860",
      a_duration : "360"
    });

    cmd += this.set({
      id : this.idSet.waitingBackground,
      visibility : "gone"
    });

    this.loader.stopLoader();
    setTimeout(() => {
      Android.runInUI(
        cmd, 
        null  
      );
    }, 360);
  }
  
  render() {
    this.layout = (
      <LinearLayout
        width = "match_parent"
        height = "match_parent"
        clickable = "true"
        orientation = "vertical"
        visibility = "gone"
        id = {this.idSet.waitingBackground}
      >
      <LinearLayout
        height = "0"
        weight = "1"
        width = "match_parent"
        background = "#FFFFFF"
        alpha = "0.5"
      />

      <LinearLayout
        height="1"
        background="#fcfcfc"
        width="match_parent" />
      <LinearLayout
         height="1"
         background="#efefef"
         width="match_parent" />
      <LinearLayout
         height="1"
         background="#e2e2e2"
         width="match_parent" />
      <LinearLayout
         width = "match_parent"
         height = "188"
         orientation = "vertical"
         alignParentBottom = "true,-1"
         id = {this.idSet.waitingComponent}
         background="#FFFFFF">

  
        <TextView
          gravity = "center"
          width = "match_parent"
          margin = "0,30,0,5"
          padding = "0,5,0,5"
          style = {TextStyle.textStyle.statusAlert}
          text = "Waiting for OTP"
        />
        
        <TextView
          gravity = "center"
          width = "match_parent"
          margin = "0,5,0,5"
          
          id = {this.idSet.timer}
          text = {this.time}
          style = {TextStyle.textStyle.statusAlert}
          padding = "0,5,0,5"
        />

        <Loader />
        </LinearLayout>
      </LinearLayout >
    )

    return this.layout.render();
  }
}

module.exports = Waiting;
