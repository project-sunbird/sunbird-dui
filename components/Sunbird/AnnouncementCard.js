var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var utils = require('../../utils/GenericFunctions')

class AnnouncementCard extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "readBar",
      "parentContainer"
    ]);

    this.props=this.props||"";
    this.data=this.props.params||"";
    this.hasAttachments = this.checkAttachments();
  }
  checkAttachments = ()=>{
    if(this.data.hasOwnProperty("attachments")
       &&this.data.attachments!=undefined
       &&this.data.attachments.length>0){
         return true;
       }
       return false;
  }

  getLabel = () =>{
    var type = this.data.type||"";
    return(<TextView
            width="wrap_content"
            height="wrap_content"
            margin = "0,0,10,10"
            visibility={type==""?"gone":"visible"}
            text= {type}
            padding="5,3,5,3"
            cornerRadius="4"
            background={window.__Colors.PRIMARY_BLACK_66}
            style={window.__TextStyle.textStyle.SYMBOL.STATUSBAR.LABEL}/>
          );
  }

  getAnnouncementTitle(){
    var title = this.data.title||"";
    return (
      <TextView
       height="wrap_content"
       width="match_parent"
       text={title}
       visibility={title==""?"gone":"visible"}
       margin="0,0,0,6"
       style={window.__TextStyle.textStyle.CARD.TITLE.DARK_16}/>
    );
  }

  getAnnouncementFrom(){
    var from = this.data.from||""
      return(
        <TextView
       height="wrap_content"
       width="wrap_content"
       padding="0,0,10,10"
       visibility={from==""?"gone":"visible"}
       id={this.idSet.announcementFrom}
       text={from}
       style={window.__TextStyle.textStyle.HINT.REGULAR}/>
     );
  }

  getBody(){
    var tempAttachmentsCount = this.hasAttachments?(this.data.attachments.length-1)+"":"";
    var  linksCount=0;
    if(this.data.hasOwnProperty("links")&&this.data.links!=undefined&&this.data.links.length!=0){
      linksCount=this.data.links.length;
      var tempWeblinksCount = (linksCount-1)+"";
    }
    return (

        <LinearLayout
          width="match_parent"
          height="wrap_content"
          padding="12,16,16,16"
          orientation="vertical"
          background={window.__Colors.WHITE}>
          {this.getLabel()}
          {this.getAnnouncementTitle()}
          {this.getAnnouncementFrom()}
          {this.getDescription()}
          {this.getWebLinks()}
          <TextView
            widht="match_parent"
            height="wrap_content"
            padding="23,0,0,8"
            visibility={linksCount>1?"visible":"gone"}
            text={"+"+tempWeblinksCount+" "+window.__S.WEBLINKS}/>
          {this.getAttachment()}
          <TextView
            widht="match_parent"
            height="wrap_content"
            padding="23,0,0,0"
            visibility={this.hasAttachments&&(this.data.attachments.length>1)?"visible":"gone"}
            text={"+"+tempAttachmentsCount+" "+window.__S.ATTACHMENTS}/>
          <LinearLayout
            width="match_parent"
            height="2"
            cornerRadius="5"
            margin="0,15,0,5"
            background={window.__Colors.WHITE_F2}/>
          {this.getFooter()}
        </LinearLayout>);
  }

  getDescription=()=>{

    var content = ""
    if(this.data.hasOwnProperty("details")&& this.data.details.hasOwnProperty("description")){
      content= utils.cropText(this.data.details.description,60);
      }
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
    return(
      <LinearLayout
      width="match_parent"
      height="wrap_content"
      visibility={link!=""?"visible":"gone"}
      padding="0,0,0,3"
      onClick={()=>this.handleAnnouncementClick(this.props.params,"webLink",link,this.props.index)}
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

  handleAnnouncementClick = (item,whereFrom,details) => {
    if(this.props.onClick!=undefined){
      this.props.onClick();
    }
        var whatToSend = {
                          "announcementData": JSON.stringify({
                            "announcementId" : item.id,
                            "whereFrom": whereFrom,
                            "details" : details,
                            "announcementData" : item
                          })
                         }
        var event ={ tag: this.props.tag, contents: whatToSend }
        window.__runDuiCallback(event);
      }

  getAttachment=()=>{
    var temp=this.data.attachments[0]||"";
    if(temp.hasOwnProperty("mimetype"))
    var attachmentsType = temp.mimetype.substring(temp.mimetype.lastIndexOf("/")+1);
    if(this.hasAttachments==false||temp==""){
      return (<LinearLayout/>);
    }
    return(<LinearLayout
      width="wrap_content"
      height="wrap_content"
      padding="0,0,0,3"
      onClick={()=>this.handleAnnouncementClick(this.props.params,"attachments",this.data.attachments[0],this.props.index)}
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
          text={temp.name||"Attachments"}
          style={window.__TextStyle.textStyle.CLICKABLE.BLUE_SEMI}/>
        <TextView
          width="wrap_content"
          height="match_parent"
          padding="5,0,5,0"
          text={"("+(attachmentsType||"NA") +","+(temp.size||"NA") +")"}/>
      </LinearLayout>
      );
  }

  getFooter=()=>{
    var d =  new Date(this.data.createdDate);
    var time = utils.prettifyDate(d);
    return(
        <TextView
          width="match_parent"
          height="wrap_content"
          text={window.__S.SENT_ON+" "+time}
          style={window.__TextStyle.textStyle.HINT.REGULAR}/>
      );
  }

  afterRender = () => {
    JBridge.setMapId(this.idSet.parentContainer + "",window.__S.ANNOUNCEMENT, window.__S.ANNOUNCEMENT, "1");
  }

  render() {
    this.layout = (
      <LinearLayout
        id={this.idSet.parentContainer}
        width="match_parent"
        height="wrap_content"
        root="true"
        onClick={()=>this.handleAnnouncementClick(this.props.params,"cardClick","",this.props.index)}
        orientation="horizontal">
      <LinearLayout
      width="4"
      height="match_parent"
      id={this.idSet.readBar}
      background={this.data.read?window.__Colors.PRIMARY_LIGHT:window.__Colors.PRIMARY_DARK}/>
        {this.getBody()}
     </LinearLayout>
    );
    return this.layout.render();
  }
}

module.exports = AnnouncementCard;
