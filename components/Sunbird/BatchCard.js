
var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var RatingBar = require("@juspay/mystique-backend").androidViews.RatingBar;
var Button = require('../Sunbird/Button');
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var StarComponent = require('../Sunbird/StarComponent');
var _this;

var utils = require('../../utils/GenericFunctions');

class BatchCard extends View {
  constructor(props, children) {
    super(props, children);
    _this=this;

    this.setIds([
    ]);


  }


  afterRender = () => {

  }



  getBatchCardOption = () =>{

    return (<LinearLayout
      height="wrap_content"
      width="wrap_content"
      gravity="center_vertical"
      orientation="vertical">

      <TextView
        height="wrap_content"
        width="wrap_content"
        padding="16,8,16,8"
        gravity="center"
        onClick={this.props.onEnrollClick}
        text={window.__S.ENROLL}
        style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>


    </LinearLayout>)

  }

  getBody= ()=>{
    var description="";
    description+= utils.prettifyDate(this.props.batch.createdDate);
    return (<LinearLayout
              margin="0,8,0,0"
              width="match_parent"
              height="wrap_content">

              <LinearLayout
                width="0"
                height="wrap_content"
                weight="1"
                padding="16,8,16,8"
                orientation="vertical">

                <TextView
                  width="match_parent"
                  height="wrap_content"
                  text={this.props.batch.name}
                  style={window.__TextStyle.textStyle.CARD.TITLE.DARK_12}/>

                <TextView
                  width="match_parent"
                  height="wrap_content"
                  text={description}
                  style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULA_10}/>

              </LinearLayout>

              { this.getBatchCardOption() }

            </LinearLayout>
          )
  }

  render() {
      this.layout = (
        <LinearLayout
          height={this.props.height || "wrap_content"}
          width={this.props.width || "match_parent"}
          visibility = { this.props.batchStatus ? ( this.props.batchStatus == this.props.batch.status ? "visible" : "gone" ) : "visible" }
          orientation="vertical">


           {this.getBody()}

           <LinearLayout
             height="2"
             width="match_parent"
             background={window.__Colors.LIGHT_GRAY}
             margin="16,0,16,0"/>

         </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = BatchCard;
