var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var TextStyle = require("../../res/TextStyle");

var Colors = require("../../res/Colors").color;

class KeyboardKey extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "key";
     
    this.setIds([
      "layoutId",
      "keyId"
    ]);
  }

  onKeyDown = () => {
    var _this = this;
    var keyId = this.props.id ? this.props.id : this.idSet.keyId;
    this.props.onKeyDown(keyId, this.props.key);
  };

  getImageUrl() {
    var keyText = this.props.key.toLowerCase();

      switch (keyText) {
        case "br":
          return this.props.invert ? "ic_submit_dark": "ic_submit_light";
          break;
           
        case "bl":
          return this.props.invert ? "ic_delete_dark": "ic_delete_light";
          break;
      }
  }

  getHeight() {
    var keyText = this.props.key.toLowerCase();

    switch (keyText) {
      case "br":
      return "56";
      case "bl":
      return "24";
    }
  }

  getMargin() {
    var keyText = this.props.key.toLowerCase();

    switch (keyText) {
      case "br":
        return "0,20,0,18"
      case "bl":
        return "0,20,0,18"
    }
  }

  imageAfterRender = () =>{
    // JBridge.setClickFeedback(this.idSet.layoutId);
  }

  renderIcon() {
    var icon = this.getImageUrl();
    var height = this.getHeight();
    var margin = this.getMargin();
    var background = this.props.invert ? "#FFFFFF" : Colors.NPCI_BLUE;
     
    this.layout = (
      <RelativeLayout 
        onLongPress = {this.props.key.toLowerCase()=="del"?this.props._onLongPress:null}
        id={this.idSet.layoutId} 
        weight={"1"}
        width="0"
        height="wrap_content" 
        afterRender = {this.imageAfterRender}
        background={background}
        onClick={this.onKeyDown}
        allowMultipleClicks="true">
         
        <ImageView  
          id={this.props.id?this.props.id:this.idSet.keyId} 
          height={height}
          margin={margin}
          width="match_parent"
          imageUrl={icon}/>
      </RelativeLayout>
    );
     
    return this.layout.render();
  }

   textAfterRender = () =>{
    // JBridge.setClickFeedback(this.idSet.layoutId);
  }

  renderKey() {
    var color = this.props.invert ? Colors.NPCI_BLUE : Colors.WHITE;
    var background = this.props.invert ? "#FFFFFF" : Colors.NPCI_BLUE;

    this.layout = (
      <RelativeLayout  
        id={this.idSet.layoutId}  
        weight={"1"}
        width="0"
        gravity="center"
        afterRender = {this.textAfterRender}
        background={background}
        onClick={this.onKeyDown}
        allowMultipleClicks="true">
         
      <TextView 
        id={this.props.id?this.props.id:this.idSet.keyId}
        text = {this.props.key}
        style = {TextStyle.textStyle.amountInput}
        color = {color}
        />
         
      </RelativeLayout>
    );

    return this.layout.render();
  }

  getKeyType() {
    var keyText = this.props.key.toLowerCase();

    if (keyText == "bl" || keyText == "br")
    return "icon"
  }

  render() {
    var keyType = this.getKeyType();

    if (keyType == "icon")
    return this.renderIcon();
    else
    return this.renderKey();

  }
}

module.exports = KeyboardKey;
