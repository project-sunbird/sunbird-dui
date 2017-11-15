var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");


var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var utils = require('../../utils/GenericFunctions')
var _this;

class AnnouncementCard extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
    ]);

    _this = this;

  }

  afterRender = () => {
  }

  getLabel = () =>{
    return(<TextView
            width="wrap_content"
            height="wrap_content"
            margin = "0,0,10,10"
            visibility={this.props.params.labelText?"visible":"gone"}
            text= {this.props.params.labelText}
            padding="5,3,5,3"
            cornerRadius="4"
            background={window.__Colors.PRIMARY_BLACK_66}
            style={window.__TextStyle.textStyle.SYMBOL.STATUSBAR.LABEL}/>
          );
  }

  getBody(){
    var size=this.props.params.attachments[0].hasOwnProperty("size") ? window.__S.FILE_SIZE.format(utils.formatBytes(this.props.params.attachments[0].size)) : "NA";    
    size=size.substring(6,size.length-1);
    var content = this.props.params.bodyContent;
    if(content==undefined||content==""){
        content="";
      }else{
        content= utils.cropText(content,60);
      }
    return (
   
        <LinearLayout
          width="match_parent"
          height="wrap_content"
          orientation="vertical">
           
          <TextView
            width="wrap_content"
            height="wrap_content"
            margin="0,0,0,10"
            text={this.props.params.bodyHeading}
            style={window.__TextStyle.textStyle.CARD.TITLE.DARK_16}/>

          <TextView
            width="match_parent"
            height="wrap_content"
            margin="0,0,10,10"
            visibility={this.props.params.announcementBy==undefined?"gone":"visible"}
            text={this.props.params.announcementBy||""}
            style={window.__TextStyle.textStyle.HINT.REGULAR}/>

          {this.getDescription(content)}
          {this.getWebLinks()}
          {this.getAttachment(size)}

          <TextView
            widht="match_parent"
            height="wrap_content"
            padding="23,0,0,0"
            visibility={this.props.params.attachments.length>1?"visible":"gone"}
            text={"+"+(this.props.params.attachments.length-1)+" "+window.__S.ATTACHMENTS}/>
          <LinearLayout
            width="match_parent"
            height="2"
            cornerRadius="5"
            margin="0,15,0,5"
            background={window.__Colors.WHITE_F2}/>

          {this.getFooter()}
        </LinearLayout>);
  }

  getDescription=(content)=>{
    return(<RelativeLayout
      widht="match_parent"
      height="50"
      margin="0,0,0,15"
      visibility={content==""?"gone":"visible"}>
      <TextView
        width="wrap_content"
        height="wrap_content"
        text={content}
        gravity="center_vertical"
        padding="0,7,7,2"
        style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>
        <TextView
        width="wrap_content"
        height="wrap_content"
        padding="0,5,5,5"
        alignParentRight="true,-1"
        alignParentBottom="true,-1"
        visibility={content.length>60?"visible":"gone"}
        text={window.__S.READ_MORE}
        style={window.__TextStyle.textStyle.CLICKABLE.BLUE_SEMI}/>
        </RelativeLayout>
      );
  }

  getWebLinks=()=>{
    return(<LinearLayout
      width="match_parent"
      height="wrap_content"
      visibility={this.props.params.weblinks==undefined?"gone":"visible"}
      margin="0,0,0,10"
      orientation="horizontal">
      <ImageView
      height="18"
      width="18"
      imageUrl="ic_action_link"/>
      <TextView
      width="match_parent"
      height="match_parent"
      gravity="center_vertical"
      visibility={this.props.params.weblinks==undefined?"gone":"visible"}
      padding="7,0,0,0"
      text={this.props.params.weblinks}
      style={window.__TextStyle.textStyle.CLICKABLE.BLUE_SEMI}/>
      </LinearLayout>
      );
  }

  getAttachment=(size)=>{
    return(<LinearLayout
      width="wrap_content"
      height="wrap_content"
      margin="0,0,0,5"
      visibility={this.props.params.attachments.length>0?"visible":"gone"}
      orientation="horizontal">
      <ImageView
      height="18"
      width="18"
      imageUrl="ic_action_attachment"/>
      <TextView
      weight="1"
      height="match_parent"
      gravity="center_vertical"
      padding="5,0,5,0"
      text={this.props.params.attachments[0].text||"Attachment"}
      style={window.__TextStyle.textStyle.CLICKABLE.BLUE_SEMI}/>
      <TextView
      width="wrap_content"
      height="match_parent"
      padding="5,0,5,0"
      text={"("+(this.props.params.attachments[0].type||"NA") +","+(size) +")"}/>
      </LinearLayout>
      );
  }

  getFooter=()=>{
    return(<TextView
      width="match_parent"
      height="match_parent"
      text={window.__S.SENT_ON}
      style={window.__TextStyle.textStyle.HINT.REGULAR}/>
      );
  }

  render() {
    this.layout = (
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        root="true"
        orientation="vertical"
        onClick={this.props.onClick}
        background={window.__Colors.LIGHT_GRAY}>
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        margin="0,0,0,6"
        orientation="horizontal">
      <LinearLayout
      width="4"
      height="match_parent"
      background={this.props.params.read?window.__Colors.PRIMARY_LIGHT:window.__Colors.PRIMARY_DARK}/>
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        padding="12,16,16,16"
        orientation="vertical"
        background={window.__Colors.WHITE}>

        {this.getLabel()}

        {this.getBody()}

     </LinearLayout>
     </LinearLayout>
     </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = AnnouncementCard;
