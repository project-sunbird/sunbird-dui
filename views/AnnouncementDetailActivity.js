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
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var utils = require('../utils/GenericFunctions');
var Styles = require("../res/Styles");
let IconStyle = Styles.Params.IconStyle;

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
    console.log(state,"AnnouncementDetailActivity");
    this.data = JSON.parse(state.data.value0.announcementData); //data Recieved from intent
    console.log("Recieved data in AnnouncementDetailActivity ", this.data);


    var announcementList = []; //list of announcementData in local storage
    if (JBridge.getSavedData("savedAnnouncements") != "__failed"){
      announcementList = JSON.parse(utils.decodeBase64(JBridge.getSavedData("savedAnnouncements")));
    }

    this.announcementData = {};
    announcementList.map((item) => {
      if (item.id == this.data.announcementID) {
        this.announcementData = item; //setting current announcement details
      }
    });

    //TODO handle no announcement data in this.announcementData

    console.log("Info State", this.data);
    this.screenName = "AnnouncementViewAllActivity";
    this.shouldCacheScreen = false;

    // this.data1={
    //   "labelText":"Announcement",
    //   "announcementBy":"National Council for teacehers education (NCTE )",
    //   "labelIcon":"ic_action_horn",
    //   "date":"Wed Jun 7, 2017",
    //   "bodyIcon":"ic_action_exam",
    //   "bodyHeading":"Exam dates announced for CBSE and state board exams.",
    //   "bodyContent":"",
    //   "read":true,
    //   "footerTitle":"See in Calendar >",
    //   "attachments":[
    //      {
    //         "type":"pdf",
    //         "size":"1011",
    //         "text":"1"
    //      },
    //      {
    //         "type":undefined,
    //         "size":"123",
    //         "text":"2"
    //      }]
    //   }

  }

  initData = () => {
    var cmd = this.set({
      id: this.idSet.announcementType,
      text: this.data.labelText
    })

    if(this.data.announcementBy==undefined)
     cmd += this.set({
      id: this.idSet.announcementFrom,
      visibility: "gone"
     })
    else
    cmd += this.set({
      id: this.idSet.announcementFrom,
      text: this.data.announcementBy
    })

    cmd += this.set({
      id: this.idSet.announcementHeading,
      text: this.data.bodyHeading
    })

    if(this.data.bodyContent!=""){
      cmd += this.set({
        id: this.idSet.announcementBody,
        text: this.data.bodyContent,
        visibility : "visible"
      })
    }
    else {
      cmd += this.set({
        id: this.idSet.announcementBody,
        visibility: "gone"
      })
    }

    if(this.data.weblinks!="")
    {
      cmd += this.set({
        id: this.idSet.webLinkSection,
        visibility : "visible"
      })
      cmd += this.set({
        id: this.idSet.webLink,
        text: this.data.weblinks,
      })

    }
    else{
      cmd += this.set({
        id: this.idSet.webLinkSection,
        visibility : "gone"
      })
    }

    if(this.data.attachments.length==0)
    {
      cmd += this.set({
        id: this.idSet.attachmentSection,
        visibility : "gone"
      })
    }
    else{
      this.populateAttachments();
    }

    cmd += this.set({
      id: this.idSet.updateInfo,
      text: this.data.footerTitle
    })

    Android.runInUI(cmd,0);

  }


  afterRender = () => {
  //  this.initData();
  }

  getFooter(){
    return (
      <LinearLayout
      width="match_parent"
      height="wrap_content"
      orientation="horizontal"
      margin="0,0,0,20">
        <TextView
        height="wrap_content"
        width="wrap_content"
        text="Updated on 16th May ‘17"
        id={this.idSet.updateInfo}
        style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>
        <ViewWidget
        height="0"
        weight="1"/>
        <ImageView
        height="14"
        width="14"
        imageUrl="ic_action_share_black"/>
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
    var cards = this.data.attachments.map((item)=>{
      return _this.getAttachmentCard(item);
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

  getAttachmentCard = (item) => {
    if(item==undefined)
    return(
      <LinearLayout
      height="wrap_content"
      width="wrap_content">
      </LinearLayout>
    )

    return (
      <LinearLayout
      onClick={()=>{this.openLink(item.link)}}
      height="wrap_content"
      width="match_parent">
      <LinearLayout
      height="wrap_content"
      width="match_parent"
      orientation="horizontal"
      padding="8,8,16,8"
      margin="0,0,0,16"
      stroke = {"2," + window.__Colors.PRIMARY_BLACK_44}
      gravity="center_vertical"
      cornerRadius="4">
        <ImageView
        height="56"
        width="60"
        margin="0,0,5,0"
        cornerRadius="4,4,4,4"
        background={window.__Colors.PRIMARY_BLACK_44}/>
        <LinearLayout
        height="match_parent"
        width="wrap_content"
        orientation="vertical"
        gravity="center_vertical">
          <TextView
          height="wrap_content"
          width="wrap_content"
          text={item.type}
          style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>
          <TextView
          height="wrap_content"
          width="wrap_content"
          text={item.size}
          style={window.__TextStyle.textStyle.CARD.BODY.FADED}/>
        </LinearLayout>
        <ViewWidget
        height="0"
        weight="1"/>
        <LinearLayout
         height="30"
         width="wrap_content"
         stroke = {"4," + window.__Colors.PRIMARY_DARK}
         cornerRadius="4,4,4,4"
         padding="16,0,16,0"
         gravity="center_vertical">
           <TextView
           width="wrap_content"
           height="wrap_content"
           gravity="center"
           style={window.__TextStyle.textStyle.CARD.ACTION.DARK}
           text="View"/>
         </LinearLayout>
      </LinearLayout>
    </LinearLayout>
    )
  }

  getAttachment(){
     console.log("get Attachments", this.data);
     if(this.data.hasOwnProperty("attachments") && this.data.attachments.length>0)
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
             style={window.__TextStyle.textStyle.TOOLBAR.HEADING}
             />
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
    <LinearLayout
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
  }

  getLinks(){
    var links = this.data.links.map((item)=>{
      if(item==undefined)
        return(
          <LinearLayout
          height="wrap_content"
          width="wrap_content"/>
        )
       return(
         getSingleLink(item)
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
    if (this.data.hasOwnProperty("links")&& this.data.links.length>0)
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
           {this.getSingleLink()}
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
    if(this.data.hasOwnProperty("details")&& this.data.details.hasOwnProperty("title"))
      return(
        <TextView
         height="wrap_content"
         width="match_parent"
         id={this.idSet.announcementBody}
         text={this.data.details.title}
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
    if(this.data.hasOwnProperty("details")&& this.data.details.hasOwnProperty("from"))
      return(
        <TextView
       height="wrap_content"
       width="wrap_content"
       padding="0,0,10,10"
       id={this.idSet.announcementFrom}
       text={this.announcementData.from}
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
    if(this.data.hasOwnProperty("details")&& this.data.details.hasOwnProperty("title"))
    return (
      <TextView
       height="wrap_content"
       width="match_parent"
       text={this.data.details.title}
       id={this.idSet.announcementHeading}
       margin="0,0,0,10"
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

    if(this.data.hasOwnProperty("details") && this.data.details.hasOwnProperty("type"))
    return(
        <TextView
            width="wrap_content"
            height="wrap_content"
            margin = "0,0,10,10"
            text= {this.data.details.type}
            id={this.idSet.announcementType}
            padding="5,3,5,3"
            cornerRadius="4"
            background={window.__Colors.PRIMARY_BLACK_66}
            style={window.__TextStyle.textStyle.SYMBOL.STATUSBAR.LABEL}/>
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
