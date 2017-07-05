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
      "parentContainer"
    ]);
    this.displayName = "TextInputview";


  }

  handleOnChange = (data) => {
    console.log("TEXT CHANGE ", data)
    this.props._onChange(data);
  }

  render() {


    this.layout = (
      <LinearLayout
      id={this.idSet.parentContainer}
      width="match_parent"
      height="wrap_content"
      margin="0,2,0,2"
      orientation="vertical">

        <TextView
          text={this.props.labelText}
          padding="6,0,0,0"
          color={this.props.color}
          width="match_parent"
          fontStyle= {window.__Font.fontStyle.MEDIUM}
          height="wrap_content"/>

        
            <EditText
              width="match_parent"
              height="wrap_content"
              singleLine="true"
              maxLine="1"
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
