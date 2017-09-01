var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");


var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");


class TextInputView extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "parentContainer",
      "editText"
    ]);
    this.displayName = "TextInputview";


  }

  handleOnChange = (data) => {

    this.props._onChange(data);
  }

  afterRender = () =>{
    JBridge.changeFontStylePassword(this.props.id ? this.props.id : this.idSet.editText);
  }

  render() {


    this.layout = (
      <LinearLayout
        id={this.idSet.parentContainer}
        width="match_parent"
        height="wrap_content"
        afterRender={this.afterRender}
        margin={this.props.margin}
        orientation="vertical">

        <LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="horizontal">

          <TextView
            textFromHtml={this.props.labelText}
            padding="4,0,0,0"
            textAllCaps = "true"
            style={this.props.textStyle ? this.props.textStyle : window.__TextStyle.textStyle.BOTTOMBAR.DEFAULT}
            width="wrap_content"
            height="wrap_content"/>

          <TextView
            height="wrap_content"
            width="wrap_content"
            text=" *"
            visibility = {(this.props.mandatory && this.props.mandatory == "true") ? "visible" : "gone"}
            color= {window.__Colors.ERROR_RED}/>
        </LinearLayout>

        <EditText
          margin="0,0,0,0"
          padding="4,4,0,10"
          width="match_parent"
          height="wrap_content"
          id={this.props.id ? this.props.id : this.idSet.editText}
          singleLine="true"
          maxLine="1"
          style = {this.props.editTextStyle ? this.props.editTextStyle : ""}
          inputType={this.props.inputType?this.props.inputType:"text"}
          color={this.props.color}
          hint={this.props.hintText}
          text={this.props.text?this.props.text:""}
          onChange={this.handleOnChange}/>

      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = TextInputView;
