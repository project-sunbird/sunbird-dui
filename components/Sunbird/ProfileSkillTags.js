

var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var utils = require('../../utils/GenericFunctions')
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");

var _this;
class ProfileSkillTags extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([
      "lockIcon",
      "unlockIcon"
    ]);
    _this = this;
    this.isEditable = this.props.editable;
    console.log("Profile skill tags :",this.props.editable)
    this.data = [{
      "name": "Leadership",
      "tagCount": "+24"
    }, {
      "name": undefined,
      "tagCount": "-4"
    }, {
      "name": "Advanced Chemistry",
      "tagCount": "+12"
    }, {
      "name": "Mastery in Organic  Chemistrydnfnwerierjwoeirjoiewjrweijreiewjeij",
      "tagCount": "+14"
    }]
    this.lockIconVisibility=this.props.privacyStatus;

  }


  getHeader() {
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content">

              <TextView
              width="wrap_content"
              height="wrap_content"
              text={window.__S.SKILL_TAGS}
              style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

              <ViewWidget
              height="0"
              weight="1"/>

              <LinearLayout
              width="wrap_content"
              height="wrap_content"
              layout="horizontal"
              visibility = {this.isEditable=="true" ? "visible" : "gone"}>
                  <TextView
                  width="wrap_content"
                  height="wrap_content"
                  margin="0,0,10,0"
                  text={window.__S.ADD}
                  onClick = {this.props.onAddClicked}
                  style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>
                  <RelativeLayout>
                    <ImageView
                    height="14"
                    width="14"
                    onClick={()=>{this.props.handleLock("skills",this.lockIconVisibility)}}
                    id={this.idSet.lockIcon}
                    visibility={this.lockIconVisibility?"visible":"gone"}
                    imageUrl="ic_action_lock"/>
                    <ImageView
                    id={this.idSet.unlockIcon}
                    height="14"
                    width="14"
                    onClick={()=>{this.props.handleLock("skills",this.lockIconVisibility)}}
                    visibility={this.lockIconVisibility?"gone":"visible"}
                    imageUrl="ic_action_unlock"/>
                  </RelativeLayout>
              </LinearLayout>

              </LinearLayout>)
  }

  getLineSeperator() {
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,0,0,24"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }


  getRows(input) {
    return (<LinearLayout
              width="match_parent"
              height="wrap_content"
              margin="0,24,0,0"
              visibility={input.name==undefined?"gone":"visible"}
              gravity="center_vertical">
              <LinearLayout
              weight="1"
              height="wrap_content"
              cornerRadius="20"
              orientation="horizontal"
              background={window.__Colors.WHITE_F4}>
              <TextView
              weight="1"
              height="wrap_content"
              text={ utils.cropText(input.name,50)}
              padding="12,7,12,7"
              style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>
              <LinearLayout
               width="1"
               height="match_parent"
               cornerRadius="2"
               background={window.__Colors.PRIMARY_BLACK_22}
               margin="0,3,0,3"/>
              <TextView
              width="wrap_content"
              height="match_parent"
              gravity="center"
              text={input.tagCount}
              padding="8,0,12,0"
              style={window.__TextStyle.textStyle.HINT.REGULAR}/>
              </LinearLayout>
              <TextView
              width="wrap_content"
              height="wrap_content"
              visibility={this.isEditable=="true"?"gone":"visible"}
              text={"+1"}
              margin="5,0,5,0"
              padding="10,3,10,3"
              cornerRadius="15"
              stroke={"2,"+window.__Colors.PRIMARY_BLACK_22}
              style={window.__TextStyle.textStyle.HINT.REGULAR}/>
              </LinearLayout>)
  }


  skillTagBody() {

    var rows = this.data.map((item, i) => {
      return (<LinearLayout
                width="match_parent"
                height="wrap_content"
                orientation="vertical">
                {this.getRows(item)}

                </LinearLayout>)
    });

    return rows;

  }


  render() {
    this.layout = (
      <LinearLayout
                width="wrap_content"
                height="wrap_content"
                margin="0,16,0,24"
                orientation="vertical">

                {this.getLineSeperator()}

                {this.getHeader()}

                {this.skillTagBody()}

              </LinearLayout>
    )
    return this.layout.render();
  }
}



module.exports = ProfileSkillTags;
