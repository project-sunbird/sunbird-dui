var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;


var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;


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
    console.log("TEXT CHANGE ", data)
    this.props._onChange(data);
  }

  afterRender = () =>{
    console.log("IN AFTER RENDER \n\n\n\n\n")

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

        <TextView
          text={this.props.labelText}
          padding="4,0,0,0"
          style={window.__TextStyle.textStyle.BOTTOMBAR.DEFAULT}
          width="match_parent"
          height="wrap_content"/>


            <EditText
              margin="0,0,0,0"
              padding="4,4,0,10"
              width="match_parent"
              height="wrap_content"
              id={this.idSet.editText}
              singleLine="true"
              maxLine="1"
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
