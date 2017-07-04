var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;

class Spinner extends View{

  constructor(props, children) {
      super(props, children);
  }
  render() {
    
    return (<spinner
              id = {this.props.id}
              width={this.props.width}
              fontStyle={this.props.fontStyle || "clearsans_regular" }
              height={this.props.height}
              values={this.props.values||this.props.missingText}
              onItemClick = {this.props.onItemClick}/>)
                       
  }
}
module.exports = Spinner;
