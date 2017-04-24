var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
 
var Values = require("../../res/values");

class Loader extends View {
  constructor(props, children) {
    super(props, children);
    
    this.displayName = "Loader";
    this.timerId  = [];
    this.setIds([
      "root",
      "dot",
    ]);

    this.currentAlpha = [0.33,0.33,1]
    this.tempAlpha = 0;
    this.fliping = false;
    this.loader = false;
  }

  showLoader = () => {  
    if(this.loader == true)
    return;
    this.loader = true;
    var cmd = this.set({
      id : this.idSet.root,
      visibility : "visible",
    })

    Android.runInUI(
      cmd,
      null
    );

    this.showLoaderTime = (new Date()).getTime();
  }
  
  startLoader = () =>{
    if(this.fliping == true)
    return;
    
    this.fliping = true;
    this.flip();
  } 

  stopLoader = () => {
    if(this.fliping == false)
      return;

    this.fliping = false;
  }

  hideLoader = () =>{
    if(this.loader == false)
      return;

    this.loader = false;
    
    var cmd = this.set({
      id : this.idSet.root,
      visibility : "gone"
    });

    if((new Date()).getTime() - this.showLoaderTime >= 5000){
      this.fliping = false;
      Android.runInUI(
        cmd,
        null
      );
    }
    else{
      setTimeout(() => {
        this.fliping = false;
          Android.runInUI(
          cmd,
          null
        );
      },((new Date()).getTime() - this.showLoaderTime));
    }
  }

  flip = () =>{
    this.tempAlpha = this.currentAlpha[2];
    this.currentAlpha[2] = this.currentAlpha[1];
    this.currentAlpha[1] = this.currentAlpha[0];
    this.currentAlpha[0] = this.tempAlpha;

    var cmd =this.set({
      id : this.idSet.dot + "00",
      alpha : "" + this.currentAlpha[0]
    });

    cmd +=this.set({
      id : this.idSet.dot + "01",
      alpha : "" + this.currentAlpha[1]
    });

    cmd +=this.set({
      id : this.idSet.dot + "02",
      alpha : "" + this.currentAlpha[2]
    });

    Android.runInUI(cmd, null)

    setTimeout(() => {
      console.log('this');
      if(this.fliping)
        this.flip();
    },1000)
  }

  getLoader() {
    return(
      <LinearLayout
        width = "match_parent"
        gravity = "center">

        <TextView id={this.idSet.dot + "00"}
          translationX= "-70"
          background = "#311B92"
          cornerRadius="15"
          width="15"
          height="15"
          alpha="0.33"/>
        <TextView id={this.idSet.dot + "01"}
          translationX= "0" 
          background = "#311B92" 
          cornerRadius="15" 
          width="15" 
          height="15" 
          alpha="0.66"/>
        <TextView id={this.idSet.dot + "02"}  
          translationX= "70" 
          background = "#311B92" 
          cornerRadius="15" 
          width="15" 
          height="15" 
          alpha="1"/>
      </LinearLayout>
    )
  }

  render() {
    var background = (this.props.type == "fullScreen") ?  "#ffffff" : null;
    var height = (this.props.type == "fullScreen") ?  "match_parent" : "wrap_content";
    var visibility = (this.props.type == "fullScreen") ?  "gone" : "visible";
    var loader = this.getLoader();

    this.layout = (
      <RelativeLayout
        id = {this.idSet.root}
        clickable = "true"
        afterRender = {this.flip}
        clickable = "true"
        height = {height}
        background = {background}
        gravity = "center"
        width = "match_parent"
        margin = "0,0,0,10"
        centerInParent="true,-1"
        visibility = {visibility}>
  
          {loader}  
        
      </RelativeLayout>
    )
  return this.layout.render();
  }
}

module.exports = Loader;
