
var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var RatingBar = require("@juspay/mystique-backend/src/android_views/RatingBar");;
var Button = require('../Sunbird/Button');
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var StarComponent = require('../Sunbird/StarComponent');
var _this;

var utils = require('../../utils/GenericFunctions');

class BatchCard extends View {
  constructor(props, children) {
    super(props, children);``
    _this=this;

    this.setIds([
    ]);


  }


  requestCreatorDetails = () => {
    if(this.props.batch.createdByName == undefined ){
      this.props.onRequestCreator(this.props.batch.createdBy);
    }
  }



  getBatchCardOption = () =>{

    return (<LinearLayout
      height="wrap_content"
      width="wrap_content"
      afterRender={this.requestCreatorDetails}
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
    description+= utils.prettifyDate(this.props.batch.startDate);
    if(this.props.batch.endDate && this.props.batch.endDate!=null && this.props.batch.endDate!=undefined){
      description+= " - ";
      description+= utils.prettifyDate(this.props.batch.endDate);
    }
    return (<LinearLayout
              margin="0,8,0,0"
              width="match_parent"
              gravity="center_vertical"
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
                  text={utils.firstLeterCapital(this.props.batch.name)}
                  style={window.__TextStyle.textStyle.CARD.TITLE.DARK_14}/>

                <TextView
                  width="match_parent"
                  height="wrap_content"
                  text={description}
                  style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULA_10}/>

                  <LinearLayout
                    width="match_parent"
                    height = "wrap_content"
                    orientation = "horizontal"
                    visibility={this.props.batch.createdByName?"visible":"gone"}>

                      <TextView
                          width="wrap_content"
                          height="wrap_content"
                          text={window.__S.CREATED_BY_SMALL+"  "}
                          style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULA_10}/>

                       <TextView
                        width="wrap_content"
                        height="wrap_content"
                        text={utils.firstLeterCapital(this.props.batch.createdByName || "" )}
                        style={window.__TextStyle.textStyle.CARD.TITLE.DARK_14}/>

                  </LinearLayout>

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
