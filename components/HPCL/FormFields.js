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

var Styles = require("../../res/Styles");
var Colors = require("../../res/Colors").color;
var TextStyle = require("../../res/TextStyle");
var Alert = require("./Alert");

/*
  Pass invert="true" for white theme
  Pass validateRegex for using form validation
  validText="INPUT IS VALID" Message for valid input , if you dont pass anything it will show only tick
  invalidText="INPUT IS INVALID" Message for invalid input , if you dont pass anything it will show only tick
*/
class FormFields extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "FormFields";
     
    this.setIds([
      "alert",
      "textField"
    ]);

    this.invert=(this.props.invert!==undefined)?this.props.invert:false;
    this.validateRegex=(this.props.validateRegex!==undefined)? new RegExp(/^(this.props.validateRegex)*/):undefined;

    this.editText = (this.invert)?TextStyle.textStyle.fieldInputWhite:TextStyle.textStyle.fieldInputBlack;
    
    this.hintText = this.props.hintText ? this.props.hintText : "";
    this.hintColor = this.props.hintColor ? this.props.hintColor : Colors.BLACK;


    this.label = (this.invert) ? TextStyle.textStyle.smallLabelWhite : TextStyle.textStyle.smallLabelBlack;
    this.labelVisibility = this.props.labelText ? "visible" : "gone";
    this.labelColor = this.props.labelColor ? this.props.labelColor : Colors.BLACK;
    this.labelAlpha = this.props.labelAlpha ? this.props.labelAlpha : "0.67";
  }

  setAlert = (state, text) =>{ 
    var alert = "";

    alert = (
      <Alert 
        type = {state} 
        text = {text}/>
    );

    this.replaceChild(this.idSet.alert,alert.render(),0);
  }

  setText = (text) => {
    let cmd = this.set({
      id: this.idSet.textField,
      text: text
    });

    Android.runInUI(cmd, null);
  }
  
  render() {
    this.layout = (
      <LinearLayout
         height = "wrap_content"
         width = "match_parent"
         orientation = "vertical"
         padding = {this.props.containerPadding}>

        <TextView
           visibility={this.labelVisibility}
           style = {this.label}
           text = {this.props.labelText}
           alpha = {this.labelAlpha}
           margin = "0,0,0,8"/>

        <LinearLayout
           orientation="horizontal"
           width = "match_parent">
          <TextView
             height="wrap_content"
             width="0"
             weight = "2"
             style = {this.editText}
             visibility = {this.props.prefixText?"visible":"gone"}
             text ={this.props.prefixText?this.props.prefixText:"+91 - "}/>
          
          <EditText
             height="wrap_content"
             width="0" 
             id={this.idSet.textField} 
             text={this.props.value}
             onChange={this.props.onChange}
             weight = "1"
             width = "match_parent"
             padding = "0,0,0,0"
             background = "#00FFFFFF"
             visibility={this.editTextVisibility}
             style = {this.editText}
             inputType = {this.props.inputType?this.props.inputType:"text"}
             hintColor={this.hintColor}
             hint = {this.hintText} />
          
          <TextView
             width="0"
             weight = "3"
             height = "35"
             gravity = "center"
             width = "match_parent"           
             stroke = {"2," + Colors.WHITE}
             cornerRadius = "2"
             onClick = {this.props.verifyClick}
             visibility = {this.props.verifyVisibility?"visible":"gone"}
             style = {TextStyle.textStyle.whiteButton}
             text = "VERIFY"/>

        </LinearLayout>

        <ViewWidget
           height = "1"
           margin = "0,5,0,10"
           background = {this.invert == true? Colors.WHITE : Colors.PRIMARY_BLACK}
           width="match_parent"/>
        <LinearLayout
           width="match_parent"
           id={this.idSet.alert} /> 
      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = FormFields;