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
    this.props=this.props||"";
    this.data=this.props.params||"";
    this.hasAttachments = this.checkAttachments();

    if(this.hasAttachments){
        this.data.attachments.map((item,index) => {
          try{
        this.data.attachments[index]=JSON.parse(this.data.attachments[index]);
          }catch(e){
            this.data.attachments[index]=""
          }
      });
    }else{
      this.data.attachments=[];
    }
  }
  checkAttachments = ()=>{
    if(this.data.hasOwnProperty("attachments")
       &&this.data.attachments!=undefined
       &&this.data.attachments.length>0
       &&this.data.attachments[0].length>1){
         return true;
       }
       return false;
  }

  afterRender = () => {
  }

  getLabel = () =>{
    var type = "NA";
    if(this.data.hasOwnProperty("details")&&this.data.details.hasOwnProperty("type")){
      type = this.data.details.type||"NA"
    }
    return(<TextView
            width="wrap_content"
            height="wrap_content"
            margin = "0,0,10,10"
            visibility={type!="NA"?"visible":"gone"}
            text= {type}
            padding="5,3,5,3"
            cornerRadius="4"
            background={window.__Colors.PRIMARY_BLACK_66}
            style={window.__TextStyle.textStyle.SYMBOL.STATUSBAR.LABEL}/>
          );
  }

  getBody(){
    var size=""
    var attachmentsCount=0;
    var  linksCount=0;
    if(this.data.hasOwnProperty("links")&&this.data.links!=undefined&&this.data.links.length!=0){
      linksCount=this.data.links.length;
    }
    if(this.hasAttachments){
        attachmentsCount=this.data.attachments.length;
      size=this.data.attachments[0].hasOwnProperty("size") ? window.__S.FILE_SIZE.format(utils.formatBytes(this.data.attachments[0].size)) : "NA";
        if(size!="NA")
        size=size.substring(6,size.length-1);
    }
    var content = this.data.details.description;
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
            margin="0,0,0,7"
            text={this.data.details.title}
            style={window.__TextStyle.textStyle.CARD.TITLE.DARK_16}/>

          <TextView
            width="match_parent"
            height="wrap_content"
            margin="0,0,0,10"
            visibility={this.data.details.from==undefined?"gone":"visible"}
            text={this.data.details.from||""}
            style={window.__TextStyle.textStyle.HINT.REGULAR}/>

          {this.getDescription(content)}
          {this.getWebLinks()}
          <TextView
            widht="match_parent"
            height="wrap_content"
            padding="23,0,0,8"
            visibility={linksCount>1?"visible":"gone"}
            text={"+"+(linksCount-1)+" "+window.__S.WEBLINKS}/>
          {this.getAttachment(size)}
          <TextView
            widht="match_parent"
            height="wrap_content"
            padding="23,0,0,0"
            visibility={(attachmentsCount>1)&&this.hasAttachments?"visible":"gone"}
            text={"+"+attachmentsCount-1+" "+window.__S.ATTACHMENTS}/>
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
      height="wrap_content"
      padding="0,0,0,10"
      visibility={content==""?"gone":"visible"}>
      <TextView
        width="wrap_content"
        height="wrap_content"
        text={content}
        gravity="center_vertical"
        padding="0,0,7,2"
        style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>
        <TextView
        width="wrap_content"
        height="wrap_content"
        padding="5,0,5,3"
        background={window.__Colors.WHITE}
        alignParentRight="true,-1"
        alignParentBottom="true,-1"
        visibility={content.length>60?"visible":"gone"}
        text={window.__S.READ_MORE}
        style={window.__TextStyle.textStyle.CLICKABLE.BLUE_SEMI}/>
        </RelativeLayout>
      );
  }

  getWebLinks=()=>{
    var link = "";
    if((this.data.hasOwnProperty("links")&&this.data.links[0]!=undefined)){
      link=this.data.links[0];
    }      
    return(<LinearLayout
      width="match_parent"
      height="wrap_content"
      visibility={link!=""?"visible":"gone"}
      padding="0,0,0,3"
      orientation="horizontal">
      <ImageView
      height="18"
      width="18"
      imageUrl="ic_action_link"/>
      <TextView
      width="match_parent"
      height="match_parent"
      gravity="center_vertical"
      padding="7,0,0,0"
      text={link}
      style={window.__TextStyle.textStyle.CLICKABLE.BLUE_SEMI}/>
      </LinearLayout>
      );
  }

  getAttachment=(size)=>{  
    if(size=="NAN GB"){
      size="NA"
    }     
    if(this.hasAttachments==false){
      return (<LinearLayout
      height="0"
      width="0"/>);
    }
    if(this.data.hasOwnProperty("attachments"))
    return(<LinearLayout
      width="wrap_content"
      height="wrap_content"
      padding="0,0,0,3"
      visibility={this.hasAttachments?"visible":"gone"}
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
      text={this.data.attachments[0].name||"Attachments"}
      style={window.__TextStyle.textStyle.CLICKABLE.BLUE_SEMI}/>
      <TextView
      width="wrap_content"
      height="match_parent"
      padding="5,0,5,0"
      text={"("+(this.data.attachments[0].mimetype||"NA") +","+(size) +")"}/>
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
        onClick={this.props.onClick}
        orientation="horizontal">
      <LinearLayout
      width="4"
      height="match_parent"
      background={this.data.read?window.__Colors.PRIMARY_LIGHT:window.__Colors.PRIMARY_DARK}/>
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
    );

    return this.layout.render();
  }
}

module.exports = AnnouncementCard;
