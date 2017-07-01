var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;

var Button = require('../../Sunbird/Button');

class ProgressButton extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "ProgressButton";
  }

  handleClick = (data) => {
    // this.props.onButtonClick(data);
  }



  getButtons = () => {
      return (
        <RelativeLayout
        width="match_parent"
        height="48">

        <LinearLayout
        width="match_parent"
        height="48">

            <LinearLayout
            width="0"
            height="match_parent"
            weight="50"
            multiCorners={"8,0,0,8,"+window.__Colors.THICK_BLUE}/>

            <LinearLayout
            width="0"
            height="match_parent"
            weight="50"
            multiCorners={"0,8,8,0,"+window.__Colors.PRIMARY_DARK}/>

        </LinearLayout>

        <TextView
        width="wrap_content"
        height="wrap_content"
        centerInParent="true,-1"
        style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
        text="DOWNLOAD THIS RESOURCE"/>

        </RelativeLayout> )
  }



  render() {
    var text = this.props.text;


    this.layout = (
      <LinearLayout
        height="wrap_content"
        orientation="vertical"
        width="match_parent"
        background={window.__Colors.WHITE}>
        <LinearLayout
          height="2"
          visibility={this.props.hideDivider?"gone":"visible"}
          width="match_parent"
          background={window.__Colors.PRIMARY_BLACK_22}/>
        <LinearLayout
          height="match_parent"
          width="match_parent"
          margin="16,16,16,16">
       
            {this.getButtons()}
       
         </LinearLayout>     

      </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = ProgressButton;
