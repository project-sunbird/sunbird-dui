var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

var _this;
class ComingSoonComponent extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([

    ]);
    _this = this;

   
  }


  render() {
    this.layout = (
    
    <LinearLayout
                  gravity="center"
                  centerInParent="true,-1"
                  clickable="false"
                  alpha = "0.9"
                  background={window.__Colors.WHITE}
                  width="match_parent"
                  height="150">

                    <TextView
                    gravity="center"
                    width="match_parent"
                    height="match_parent"
                    style ={window.__TextStyle.textStyle.NOTHING}
                    text={this.props.text||"Coming Soon.."}/>
                  

                </LinearLayout>

               
     
    )
    return this.layout.render();
  }
}



module.exports = ComingSoonComponent;
