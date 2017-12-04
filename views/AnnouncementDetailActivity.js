var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var TextInputView = require('../components/Sunbird/core/TextInputView');
var FeatureButton = require('../components/Sunbird/FeatureButton');
var Spinner = require('../components/Sunbird/core/Spinner');
var Attachments = require('../components/Sunbird/Attachments');
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var utils = require('../utils/GenericFunctions');
var Styles = require("../res/Styles");
let IconStyle = Styles.Params.IconStyle;

var _this;

class AnnouncementDetailActivity extends View{
  constructor(props, children,state) {
    super(props, children,state);
    this.setIds(["attachmentSection",
                 "attachmentCardSection",
                 "announcementType",
                 "announcementFrom",
                 "announcementHeading",
                 "announcementBody",
                 "webLinkSection",
                 "webLink",
                  "updateInfo"]);
     _this = this;
    console.log(state,"AnnouncementDetailActivity");
    this.data = JSON.parse(state.data.value0.announcementData); //data Recieved from intent
    console.log("Recieved data in AnnouncementDetailActivity ", this.data);


    var announcementList = []; //list of announcementData in local storage
    if (JBridge.getSavedData("savedAnnouncements") != "__failed"){
      announcementList = JSON.parse(utils.decodeBase64(JBridge.getSavedData("savedAnnouncements"))).announcements;
    }
    else {
      console.log("got __failed");
    }

    this.announcementData = {};
    announcementList.map((item) => {
      if (item.id == this.data.announcementId) {
        this.announcementData = item; //setting current announcement details
      }
    });

    //TODO handle no announcement data in this.announcementData

    console.log("current announcement details: ", this.announcementData);
    console.log("Info State", this.data);
    this.screenName = "AnnouncementDetailActivity";
    this.shouldCacheScreen = false;
  }

  handleStateChange = (state) => {
    var res = utils.processResponse(state);

    if(!res.hasOwnProperty("err") && res.responseFor=="API_ReadAnnouncement")
    {
      console.log("announcement read successful");
    }
    else{
      console.log("announcement read unsuccessful");
    }

  }

  afterRender = () => {
    JBridge.logAnnouncementDeatilScreen(this.data.announcementId);
    if(!(this.announcementData.hasOwnProperty("read") && this.announcementData.read)){
          if (JBridge.isNetworkAvailable()) {
            var request = {
            announcementId: this.data.announcementId ,
              channel: "mobile"
            };
            var whatToSend = {
              user_token: window.__user_accessToken,
              api_token: window.__apiToken,
              requestBody: JSON.stringify(request)
            };
            var event = {tag: "API_ReadAnnouncement", contents: whatToSend};
            window.__runDuiCallback(event);
          } else {
            console.log("__failed to Read Announcement");
          }
     }
  else{
     console.log("Announcement has already been read");
  }
  if(this.data.whereFrom=="webLinks"){
    this.openLink(this.data.details);
  }
}



  shareAction = () => {

  }

  getFooter(){
    var d =  new Date(this.announcementData.createddate);
    var time = utils.prettifyDate(d);
    var footerText = window.__S.SENT_ON+" "+time;    
    return (
      <LinearLayout
      width="match_parent"
      height="wrap_content"
      orientation="horizontal"
      margin="0,0,0,20">
        <TextView
        height="wrap_content"
        width="wrap_content"
        text={footerText}
        id={this.idSet.updateInfo}
        style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>
        <ViewWidget
        height="0"
        weight="1"/>
        <ImageView
        height="14"
        width="14"
        imageUrl="ic_action_share_black"
        onClick={this.shareAction}/>
      </LinearLayout>
    )
  }

  getLineSeperator() {
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,16,0,16"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  populateAttachments = () =>{
    var _this= this;
    var check = (this.data.whereFrom=="attachments");
    var cards = this.announcementData.attachments.map((item,index)=>{
      return (
        <Attachments
         data={JSON.parse(item)}
         id={this.data.announcementID}
         index={index}
         open={check&&(this.data.details==item)}/>
      );
    })
    console.log(cards , "cardssss");
    return  (<LinearLayout
                   height="wrap_content"
                   width="match_parent"
                   orientation="vertical">
                   {cards}
                   </LinearLayout>)


  }
  
  openLink = (url) => {
    if(url==undefined)
      url="www.google.com/github";

    if (!url.startsWith("http://") && !url.startsWith("https://"))
     url = "http://" + url;

    console.log(url,"urllll");
    JBridge.openLink(url+"");
  }
  

  getAttachment(){
    // console.log("get Attachments", this.data);
     if(this.announcementData.hasOwnProperty("attachments") && this.announcementData.attachments.length>0)
         return(<LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical"
          id={this.idSet.attachmentSection}
          margin="0,0,0,0">
            <TextView
             height="wrap_content"
             width="match_parent"
             text="Attachments"
             margin="0,0,0,6"
             style={window.__TextStyle.textStyle.TOOLBAR.HEADING}/>
             <LinearLayout
             height="wrap_content"
             width="match_parent"
             id={this.idSet.attachmentCardSection}>
              {this.populateAttachments()}
             </LinearLayout>
          </LinearLayout>
        );

    return(
      <LinearLayout
      width="wrap_content"
      height="wrap_content"/>
    )
  }

  getSingleLink=(item)=>{
    return(<LinearLayout
      height="wrap_content"
      width="match_parent">
      <TextView
       height="wrap_content"
       width="match_parent"
       text={item}
       onClick={this.openLink}
       id={this.idSet.webLink}
       style={window.__TextStyle.textStyle.CLICKABLE.BLUE_SEMI}
      />
    </LinearLayout>
   )
  }

  getLinks(){
    var links = this.announcementData.links.map((item)=>{
      if(item==undefined)
        return(
          <LinearLayout
          height="wrap_content"
          width="wrap_content"/>
        )
       return(
         this.getSingleLink(item)
       )
     })

     return(
       <LinearLayout
       width="match_parent"
       height="wrap_content">
         {links}
       </LinearLayout>
     )

  }

  getWeblinks(){
    if (this.announcementData.hasOwnProperty("links")&& this.announcementData.links.length>0)
        return(
          <LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical"
          margin="0,0,0,16"
          id={this.idSet.webLinkSection}>
          <TextView
           height="wrap_content"
           width="match_parent"
           text={window.__S.WEBLINKS}
           margin="0,0,0,6"
           style={window.__TextStyle.textStyle.TOOLBAR.HEADING}/>
           {this.getLinks()}
          </LinearLayout>
        );
     else
       return (
         <LinearLayout
         width="wrap_content"
         height="wrap_content"/>
       )
  }

  getDescription(){
    if(this.announcementData.hasOwnProperty("details")&& this.announcementData.details.hasOwnProperty("description"))
      return(
        <TextView
         height="wrap_content"
         width="match_parent"
         id={this.idSet.announcementBody}
         text={this.announcementData.details.description}
         margin="0,0,0,18"
         style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>
      );
    else
    return(
      <LinearLayout
      height="wrap_content"
      width="wrap_content"/>
    )

  }

  getAnnouncementFrom(){
    if(this.announcementData.hasOwnProperty("details")&& this.announcementData.details.hasOwnProperty("from"))
      return(
        <TextView
       height="wrap_content"
       width="wrap_content"
       padding="0,0,10,10"
       id={this.idSet.announcementFrom}
       text={this.announcementData.details.from}
       style={window.__TextStyle.textStyle.HINT.REGULAR}/>
     )
     else
       return(
         <LinearLayout
         height="wrap_content"
         width="wrap_content"/>
       )
  }

  getAnnouncementTitle(){
    if(this.announcementData.hasOwnProperty("details")&& this.announcementData.details.hasOwnProperty("title"))
    return (
      <TextView
       height="wrap_content"
       width="match_parent"
       text={this.announcementData.details.title}
       id={this.idSet.announcementHeading}
       margin="0,0,0,6"
       style={window.__TextStyle.textStyle.CARD.TITLE.DARK_16}/>
    );

    else
      return(
        <LinearLayout
        height="wrap_content"
        width="wrap_content"/>
      )

  }

  getAnnouncementInfo(){

    if(this.announcementData.hasOwnProperty("details") && this.announcementData.details.hasOwnProperty("type"))
    return(
        <TextView
            width="wrap_content"
            height="wrap_content"
            margin = "0,0,10,10"
            text= {this.announcementData.details.type}
            textAllCaps="true"
            id={this.idSet.announcementType}
            padding="8,3,8,3"
            cornerRadius="4"
            background={window.__Colors.PRIMARY_BLACK_66}
            style={window.__TextStyle.textStyle.SYMBOL.STATUSBAR.TIME}/>
   );

   else
     return(
       <LinearLayout
       height="wrap_content"
       width="wrap_content"/> 
     )

  }

  getBody(){
    return (
    <LinearLayout
    height="match_parent"
    width="match_parent"
    orientation="vertical"
    padding="15,20,15,0">
      {this.getAnnouncementInfo()}
      {this.getAnnouncementTitle()}
      {this.getAnnouncementFrom()}
      {this.getDescription()}
      {this.getWeblinks()}
      {this.getAttachment()}
      {this.getLineSeperator()}
      {this.getFooter()}
    </LinearLayout>
   );
  }
  getBack(){
    return (
      <ImageView
      margin="0,0,10,0"
      style={IconStyle}
      height="48"
      width="48"
      onClick={this.onBackPressed}
      imageUrl = {"ic_action_arrow_left"}/>);
  }

  getTitle(){
    return (<LinearLayout
            height="match_parent"
            width="wrap_content"
            gravity="center_vertical"
            visibility="gone">
              <TextView
                  height="match_parent"
                  width="match_parent"
                  gravity="center_vertical"
                  background={window.__Colors.WHITE}
                  text={window.__S.PERSONAL_DETAILS}
                  style={window.__TextStyle.textStyle.TOOLBAR.HEADING}/>
          </LinearLayout>);
    }


  getToolbar(){
    return( <LinearLayout
            height="56"
            padding="0,0,0,2"
            gravity="center_vertical"
            background={window.__Colors.PRIMARY_BLACK_22}
            width="match_parent" >
                <LinearLayout
                  height="56"
                  padding="0,0,0,0"
                  gravity="center_vertical"
                  background={window.__Colors.WHITE}
                  width="match_parent" >
                    {this.getBack()}
                    {this.getTitle()}
                </LinearLayout>
            </LinearLayout>);
  }

  render(){
      this.layout=(
        <LinearLayout
          orientation="vertical"
          root="true"
          background={window.__Colors.WHITE}
          width="match_parent"
          height="match_parent">
           {this.getToolbar()}
           <ScrollView
           height="wrap_content"
           width="match_parent">
           {this.getBody()}
           </ScrollView>
       </LinearLayout>
      );
    return this.layout.render();
  }

  onBackPressed = () => {
    var whatToSend = []
    var event = {tag:"BACK_AnnouncementDetailActivity",contents: whatToSend}
    window.__runDuiCallback(event);
  }

}


module.exports = Connector(AnnouncementDetailActivity);
