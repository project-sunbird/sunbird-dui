var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var Attachments = require('../components/Sunbird/Attachments');
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var utils = require('../utils/GenericFunctions');

var _this;

class AnnouncementDetailActivity extends View{
  constructor(props, children,state) {
    super(props, children,state);
    this.setIds([]);
     _this = this;
    this.data = JSON.parse(state.data.value0.announcementData); //data Recieved from intent
    console.log("Recieved data in AnnouncementDetailActivity ", this.data);

    var announcementList = []; //list of announcementData in local storage
    try{
      announcementList = JSON.parse(utils.decodeBase64(JBridge.getSavedData("savedAnnouncements"))).announcements;
    }catch(e){
      console.log("Failed to get announcement Data from shared preferences :",e);
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
    }else{
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
            console.log("__failed to make Read Announcement API no network");
          }
     }
  else{
     console.log("Announcement has already been read");
  }
  console.log("where from hakuna matata:",this.data);
  if(this.data.whereFrom=="webLinks"){
    this.openLink(this.data.details);
  }
}

  getFooter(){
    var d =  new Date(this.announcementData.createdDate);
    var time = utils.prettifyDate(d);
    var footerText = window.__S.SENT_ON+" "+time;
    return (
      <LinearLayout
      width="match_parent"
      orientation="horizontal"
      gravity="bottom"
      margin="0,5,0,10">
        <TextView
        height="wrap_content"
        weight="1"
        text={footerText}
        style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>
        <ImageView
        height="16"
        width="16"
        margin = "8,8,8,8"
        imageUrl="ic_action_share_black"
        onClick={this.shareAction}/>
      </LinearLayout>
    )
  }

  shareAction = () => {
    JBridge.shareAnnouncement(this.announcementData.details.type, this.announcementData.details.title, this.announcementData.details.description);
  }

  getLineSeperator() {
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,10,0,5"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  populateAttachments = () =>{
    var _this= this;
    var check = (this.data.whereFrom=="attachments");
    var cards = this.announcementData.attachments.map((item,index)=>{
      console.log("hakuna matata :",check,"---->",(this.data.details==item),"+++++>",item);      
      return (
        <Attachments
         data={item}
         id={this.data.announcementId}
         index={index}
         open={check&&(this.data.details==item)}/>
      );
    })
    console.log(cards , "cardssss");
    return  (cards);
  }

  openLink = (url) => {
    if(url==undefined)
      url="www.google.com/github";

    if (!url.startsWith("http://") && !url.startsWith("https://"))
     url = "http://" + url;

    JBridge.openLink(url);
  }


  getAttachment(){
     if(this.announcementData.hasOwnProperty("attachments") && this.announcementData.attachments.length>0){
         return(<LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical">
            <TextView
             height="wrap_content"
             width="match_parent"
             text="Attachments"
             margin="0,0,0,6"
             style={window.__TextStyle.textStyle.TOOLBAR.HEADING}/>
              {this.populateAttachments()}
          </LinearLayout>
        );
      }
    return (<LinearLayout/>);
  }

  getSingleLink=(item)=>{
    return(
      <TextView
       height="wrap_content"
       width="match_parent"
       text={item}
       onClick={this.openLink}
       style={window.__TextStyle.textStyle.CLICKABLE.BLUE_SEMI}/>
   );
  }

  getLinks(){
    var links = this.announcementData.links.map((item)=>{
      if(item==undefined){
        return(<LinearLayout/>);
      }
       return this.getSingleLink(item)
     });
     return links
    }

  getWeblinks(){
    if (this.announcementData.hasOwnProperty("links")&& this.announcementData.links.length>0){
        return(
          <LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical"
          margin="0,0,0,16">
          <TextView
           height="wrap_content"
           width="match_parent"
           text={window.__S.WEBLINKS}
           margin="0,0,0,6"
           style={window.__TextStyle.textStyle.TOOLBAR.HEADING}/>
           {this.getLinks()}
          </LinearLayout>
        );
      }
      return (<LinearLayout/>);
  }

  getDescription(){
    var description=this.announcementData.description||""
      return(
        <TextView
         height="wrap_content"
         width="match_parent"
         text={description}
         visibility={description==""?"gone":"visible"}
         margin="0,0,0,18"
         style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>
      );
  }

  getAnnouncementFrom(){
    var from = this.announcementData.from||""
      return(
        <TextView
       height="wrap_content"
       width="wrap_content"
       padding="0,0,10,10"
       visibility={from==""?"gone":"visible"}
       text={from}
       style={window.__TextStyle.textStyle.HINT.REGULAR}/>
     );
  }

  getAnnouncementTitle(){
    var title = this.announcementData.title||"";
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

  getAnnouncementInfo(){
    var type = this.announcementData.type||"";
    return(<TextView
            width="wrap_content"
            height="wrap_content"
            margin = "0,10,10,10"
            visibility={type==""?"gone":"visible"}
            text= {type}
            padding="5,3,5,3"
            cornerRadius="4"
            background={window.__Colors.PRIMARY_BLACK_66}
            style={window.__TextStyle.textStyle.SYMBOL.STATUSBAR.LABEL}/>
          );
  }

  onBackPressed = () => {
    var event = {tag:"BACK_AnnouncementDetailActivity",contents: []}
    window.__runDuiCallback(event);
  }

  render(){
      this.layout=(
        <LinearLayout
          orientation="vertical"
          root="true"
          background={window.__Colors.WHITE}
          width="match_parent"
          height="match_parent">
          <SimpleToolbar
            title=""
            onBackPress={this.onBackPressed}
            width="match_parent"/>
          <ScrollView
            height="match_parent"
            width="match_parent">
            <LinearLayout
              height="wrap_content"
              width="match_parent"
              orientation="vertical"
              padding="12,0,16,0">
              {this.getAnnouncementInfo()}
              {this.getAnnouncementTitle()}
              {this.getAnnouncementFrom()}
              {this.getDescription()}
              {this.getWeblinks()}
              {this.getAttachment()}
              {this.getLineSeperator()}
              {this.getFooter()}
            </LinearLayout>
          </ScrollView>
       </LinearLayout>
      );
    return this.layout.render();
  }
}


module.exports = Connector(AnnouncementDetailActivity);
