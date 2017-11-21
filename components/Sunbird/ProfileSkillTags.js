

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
    console.log("Profileskillstag",this.props.data);
    _this = this;
    this.isEditable = this.props.editable;
    this.data = this.props.data;

  }


  getHeader() {
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              gravity="center">
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
    if(input.skillName==undefined){
        input.skillName="Not available";
      }
      var temp = this.checkIfEndorsed(input.endorsersList);     
    return (<LinearLayout
              width="match_parent"
              height="wrap_content"
              margin="0,24,0,0"
              visibility={input.skillName==undefined?"gone":"visible"}
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
              text={ utils.cropText(input.skillName,50)}
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
              text={input.endorsementcount}
              padding="8,0,12,0"
              style={window.__TextStyle.textStyle.HINT.REGULAR}/>
              </LinearLayout>
              <LinearLayout
               width="wrap_content"
               height="wrap_content"
               onClick={()=>this.handleEndorseSkill(input.skillName,temp)}>
                <TextView
                width="wrap_content"
                height="wrap_content"
                visibility={this.isEditable=="true"?"gone":"visible"}
                text={"+1"}
                margin="5,0,5,0"
                padding="10,3,10,3"
                cornerRadius="15"
                stroke={"2,"+(temp?window.__Colors.PRIMARY_BLACK_22:window.__Colors.PRIMARY_BLACK)}
                style={temp?window.__TextStyle.textStyle.HINT.REGULAR:window.__TextStyle.textStyle.FILTER.REGULAR_BLACK}/>
              </LinearLayout>
            </LinearLayout>)
  }
  checkIfEndorsed=(endorsersList)=>{
    if(endorsersList!=undefined){
    endorsersList.map((item,i)=>{
      if(window.__userToken==endorsersList[i].userId){
        return true;
      }
    });
  }
    return false;
  }
  handleEndorseSkill=(input,temp)=>{
    if(temp){
      JBridge.__Snackbar.show(window.__S.SKILL_ALREADY_ENDORSED);
      return
    }
    if(!JBridge.isNetworkAvailable()){
      window.__Snackbar.show(window.__S.ERROR_NO_INTERNET_MESSAGE);
      return;
    }
    window.__LoaderDialog.show();
   var request = {
      "endorsedUserId":this.props.id,
      "skillName":[input]
  }
  var whatToSend = {
    "user_token" : window.__user_accessToken,
    "api_token" : window.__apiToken,
    "requestBody" : JSON.stringify(request)
  }
  var event= { "tag": "API_EndorseSkill1", contents: whatToSend };
  window.__runDuiCallback(event);
}


  skillTagBody() {
    var rows = (<LinearLayout
    height="0"
    width="0"/>);
    if(this.data!=undefined&& this.data.length>0){
      rows = this.data.map((item, i) => {
      return (<LinearLayout
                width="match_parent"
                height="wrap_content"
                orientation="vertical">
                {this.getRows(item)}

                </LinearLayout>)
    });
  }
    return rows;

  }


  render() {
      this.layout = (
        <LinearLayout
                  width="wrap_content"
                  height="wrap_content"
                  margin="0,16,0,24"
                  visibility={((this.data!=undefined&&this.data.length>0)||(this.isEditable=="true"))?"visible":"gone"}
                  orientation="vertical">

                  {this.getLineSeperator()}

                  {this.getHeader()}

                  {this.skillTagBody()}

                </LinearLayout>
      );
    return this.layout.render();
  }
}



module.exports = ProfileSkillTags;
