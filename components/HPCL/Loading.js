const dom = require("@juspay/mystique-backend").doms.android;
const View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;

const Values = require("../../res/values");

class Loading extends View {
  constructor(props, children) {
    super(props, children);
    
    this.displayName = "Loading";
    this.timerId  = [];
    this.setIds([
      "waitText",
      "root",
      "dot"
    ]);
    this.loadingMsg="Please Wait";

    if(this.props.text!== undefined)
        this.loadingMsg=this.props.text;

    this.count = 0;
    this.current = [-70,-70,0,70]
    console.log("this.current => ",this.current);
  }
  moveRight = (id) => {
    var cmd =this.set({
      id : this.idSet.dot + "0" + id,
      a_translationX : " " + (this.current[id] + 70),
      })
    this.current[id]= this.current[id] + 70;
    Android.runInUI(cmd, null)
  }
  scaleDown =(id) =>{
    var cmd =this.set({
      id:this.idSet.dot + "0" + id,
      a_scaleX: "0",
      a_scaleY: "0",
      })
    Android.runInUI(cmd, null);
    cmd = this.set({
      id:this.idSet.dot + "0" + id,
      a_translationX : " " + (this.current[id] - 140),
      });
    this.current[id]=this.current[id]-140;
    setTimeout(()=>{
    Android.runInUI(cmd, null)
    },500);
  }
  scaleUp =(id) => {
    var cmd =this.set({
      id: this.idSet.dot + "0" + id,
      a_scaleX: "1",
      a_scaleY: "1",
    })
    Android.runInUI(cmd, null)
  }
  loop =() => {
    if(this.count == 4){
      this.count = 0;
    }
    if (this.count == 0) {
      this.scaleUp(0);
      this.moveRight(1);
      this.moveRight(2);
      this.scaleDown(3);         
    }
    if (this.count == 1) {
      this.scaleUp(3);       
      this.moveRight(0);
      this.moveRight(1);
      this.scaleDown(2);
    }
    if (this.count == 2) {
      this.scaleUp(2);
      this.moveRight(3);
      this.moveRight(0);
      this.scaleDown(1);
    }
    if (this.count == 3) { 
      this.scaleUp(1);
      this.moveRight(2);
      this.moveRight(3);
      this.scaleDown(0);
    }
    this.count++;
  }
  blink =() =>{
    var id = setInterval(()=>{
      this.loop();
    },1000);
    this.timerId.push(id);
  }
  hideLoader= () => {
    var _this = this;
    var cmd =  this.set({
      id: _this.idSet.root,
      "visibility": "gone",
      })
    for (var i=0; i < this.timerId.length; i++) {
      clearInterval(this.timerId[i]);  
    }
    Android.runInUI(cmd, null);
  }
  showLoader = () => {
    var _this = this;
    var cmd =  this.set({
      id: _this.idSet.root,
      visibility: "visible",
    })
    cmd += this.set({
      id: _this.idSet.waitText,
      text: this.loadingMsg,
    })
    this.loop();
    this.blink();
    Android.runInUI(cmd, null);
  }
  render() {
    console.log("takeit1");
    console.log(this.idSet.root);
    this.layout = (
      <RelativeLayout
        id = {this.idSet.root}
        clickable="true"
        minHeight="400"
        visibility={this.props.visibility}
        clickable="true"
        height="wrap_content"
        width="match_parent">
        <FrameLayout
          background="#ffffff"
          alpha="0.95"
          width="match_parent"
          height="match_parent"/>  
        <LinearLayout
          width="200"
          centerInParent="true,-1"
          orientation="vertical">
        <RelativeLayout
          gravity="center"
          width="match_parent"
          margin="0,0,0,10">
          <TextView id={this.idSet.dot + "00"} translationX= "-70" background = "#311B92" cornerRadius="15" width="15" height="15"/>
          <TextView id={this.idSet.dot + "01"} translationX= "-70" background = "#311B92" cornerRadius="15" width="15" height="15"/>
          <TextView id={this.idSet.dot +"02"}  translationX= "0" background = "#311B92" cornerRadius="15" width="15" height="15"/>
          <TextView id={this.idSet.dot +"03"}  translationX= "70" background = "#311B92" cornerRadius="15" width="15" height="15"/>
        </RelativeLayout>
          <TextView
            id={this.idSet.waitText}
            width="match_parent"
            gravity="center"
            text = {"Please Wait"}
            color = {Values.colors.MONEY_SENT_TEXT}setScaleX = "0" setScaleY = "0" 
            fontSize = "0,4"
            typeface = "bold"/> 
        </LinearLayout>
        </RelativeLayout>
    )
  return this.layout.render();
  }
}

module.exports = Loading;
