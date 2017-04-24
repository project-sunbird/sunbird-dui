var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var Space = require("@juspay/mystique-backend").androidViews.Space;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;

var Styles = require("../../res/Styles").Params;
var TextStyle = require("../../res/TextStyle").textStyle;
var Colors = require('../../res/Colors');

class PasscodeInputItem extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "PasscodeInputItem";
  }

  dotItem = () =>{
    return (
      <ViewWidget
        id = {this.props.id}
        width = "16"
        height = "16"
        cornerRadius = "16"
        margin = "0,0,0,5"
        visibility = "invisible"
        layout_gravity = "center"
        background = "#484848"/>
    )
  }

  textItem = () => {
    return (
      <TextView
        id = {this.props.id}
        layout_gravity = "center"
        visibility = "invisible"
        style = {TextStyle.amountDisplay}/>
    )
  }

  setVisible = (id, type, value) =>{
    var cmd = "";

    if(type === "SHOW"){
      cmd = this.set({
        id: id,
        visibility:"visible",
        text: value
      });

    }else if(type === "HIDE"){
      cmd = this.set({
        id: id,
        visibility:"visible",
      });
    
    }
    
    return cmd;
  }

  setInvisible = (id) =>{
    var cmd = "";

    cmd = this.set({
      id: id,
      visibility:"invisible"
    });

    return cmd;
  }

  render() {
    var passcodeSingleItem = this.props.type === "HIDE" ? this.dotItem() : this.textItem();

    this.layout = (
        <LinearLayout
          width = "36"
          margin = "5,0,0,0"
          orientation = "vertical">
          <Space
            visibility = {this.props.type === "HIDE" ? "visible" : "gone"}
            height="21"/>

          {passcodeSingleItem}
          
          <ViewWidget
            width = "36"
            height = "2"
            background = "#484848"/>
        </LinearLayout>
    )

    return this.layout.render()
  }
}

class PasscodeInput extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "PasscodeInput";

    this.setIds([
         "inputContainer",
         "text",
         "dot",
         "visibilityText",
         "visibilityImage"
    ]);

    this.count = this.props.count;
    this.visibilityStatus = 0;
    this.value = null;
  }

  passcodeItem = (condition) =>{
    var layoutArray = [];

    for(var i=0;i<this.count;i++){
      if(condition === "HIDE"){
        layoutArray.push(
          <PasscodeInputItem 
            type = "HIDE" 
            id = {this.idSet.dot+""+i}/>
        )
      }else if(condition === "SHOW"){
        layoutArray.push(
          <PasscodeInputItem 
            type = "SHOW" 
            id = {this.idSet.text+""+i}/>
        )
      }
    }      

    return layoutArray;
  }

  toggleVisibility = () =>{
    var cmd = "";
    var layout ="";

    this.visibilityStatus = !this.visibilityStatus;
    
    if(this.visibilityStatus){
      cmd = this.set({
        id: this.idSet.visibilityText,
        text: "HIDE"
      });

      cmd += this.set({
        id: this.idSet.visibilityImage,
        imageUrl: "ic_agent_offline"
      });

      layout = <LinearLayout
                gravity = "center_horizontal"
                width = "match_parent">

                {this.passcodeItem("SHOW")}

              </LinearLayout>
    }else if(!this.visibilityStatus){
      cmd = this.set({
        id: this.idSet.visibilityText,
        text: "SHOW"
      });

      cmd += this.set({
        id: this.idSet.visibilityImage,
        imageUrl: "ic_agent_online"
      });

      layout = <LinearLayout
                gravity = "center_horizontal"
                width = "match_parent">

                {this.passcodeItem("HIDE")}

              </LinearLayout>
    }

    this.replaceChild(this.idSet.inputContainer, layout.render(),0);
    Android.runInUI(
      cmd,
      null
    );
    this.setValue(this.value);
  }

  setValue = (value) =>{
    var cmd = "";
    var length = value.length - 1;
    var passcodeInputItem = this.find('PasscodeInputItem')[0];

    this.value = value;

    if(this.visibilityStatus){
      for (var currentIndex = 0;  currentIndex < this.count; currentIndex++){
        if(currentIndex <= length){
          cmd += passcodeInputItem.setVisible(this.idSet.text+""+currentIndex,"SHOW",value[currentIndex]);
        }else{
          cmd += passcodeInputItem.setInvisible(this.idSet.text+""+currentIndex);
        }
      }

    }else if(!this.visibilityStatus){
      for (var currentIndex = 0;  currentIndex < this.count; currentIndex++){
        if(currentIndex <= length){
          cmd += passcodeInputItem.setVisible(this.idSet.dot+""+currentIndex,"HIDE");
        }else{
          cmd += passcodeInputItem.setInvisible(this.idSet.dot+""+currentIndex);
        }

      }
    }

    Android.runInUI(
      cmd,
      null
    );
  }

  showHide = () =>{
    return (
      <LinearLayout 
        height = "48"
        onClick = {this.toggleVisibility}
        allowMultipleClicks="true"
        margin="0,15,0,0"
        layout_gravity = "right">

        <ImageView
          visibility="invisible"
          id = {this.idSet.visibilityImage}
          imageUrl="ic_agent_online"
          style = {Styles.IconStyle}/>
        <TextView
          id = {this.idSet.visibilityText}
          textSize = "14"
          width = "48"
          layout_gravity = "center"
          color = "#1B3281"
          text="SHOW"/>

      </LinearLayout>
    )
  }
  
  render() {
    var bottomLine = this.passcodeItem("HIDE");
    var showHide = this.showHide();

    this.layout = (
      <LinearLayout 
        background="#ffffff"
        width = "250"
        afterRender = {this.afterRender}
        layout_gravity = "center_horizontal"
        orientation = "vertical">
        
        <LinearLayout
          id = {this.idSet.inputContainer}
          gravity = "center_horizontal"
          height = "45"
          width = "match_parent">
          
          {bottomLine}
        
        </LinearLayout>
        
          {showHide}
      
      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = PasscodeInput;
