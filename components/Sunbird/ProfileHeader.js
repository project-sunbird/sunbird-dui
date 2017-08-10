var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

var _this;
class ProfileHeader extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([

    ]);


    this.userName = (this.props.data.userName == undefined) ? "Mock User" : this.props.data.userName;
    this.imageUrl = this.props.data.imageUrl ? this.props.data.imageUrl : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR1X3cm5xzR4D1W9oPb2QWioKlrfLVd0DvXFUNqSjZfg-M0bpc";


  }




  render() {
    this.layout = (<LinearLayout
              width="match_parent"
              height="wrap_content"
              gravity="center_horizontal"
              orientation="vertical">

              <ImageView
              width="80"
              height="80"
              circularImageUrl={"0,"+this.imageUrl}/>

              <TextView
              width="wrap_content"
              height="wrap_content"
              text={this.userName}
              padding="0,10,0,2"
              style={window.__TextStyle.textStyle.HEADING.DARK}/>

              <TextView
              width="wrap_content"
              height="wrap_content"
              text="<address details>"
              padding="0,0,0,8"
              style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>

              <LinearLayout
                orientation = "vertical"
                height = "wrap_content"
                width = "wrap_content"
                background = "#FFD8D8D8"
                cornerRadius = "4">
                <TextView
                  padding = "10, 2, 10, 2"
                  text = {"Username: @" + this.userName} />
              </LinearLayout>
              </LinearLayout>)
    return this.layout.render();
  }
}



module.exports = ProfileHeader;
