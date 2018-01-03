var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var ListView = require("@juspay/mystique-backend/src/android_views/ListView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var AnnouncementCard = require('../components/Sunbird/AnnouncementCard');

var utils = require('../utils/GenericFunctions');
var _this;
class AnnouncementViewAllActivity extends View {
    constructor(props, children, state) {
      super(props, children, state);
      this.jsonArray=[];
      this.setIds([
          "announcementListContainer",
          "viewMoreButton",
      ]);
      window.__LoaderDialog.show();         
      try{
        this.details = JSON.parse(utils.decodeBase64(JBridge.getSavedData("savedAnnouncements")));
      }catch(e){
        this.details="";
        console.log("Failed to get announcement Data from shared preferences :",e);
      }
      //this.details=this.details.announcements;
      console.log("AnnouncementViewAllActivity -->:",this.details);
      this.screenName = "AnnouncementViewAllActivity";
      this.shouldCacheScreen = false;
      this.limitForNumberOfAnnouncements=10;
      this.offset=0;
      this.list=this.details.announcements;      
      _this = this;
  }
    
  onBackPressed = () => {
    var event = { tag: "BACK_AnnouncementViewAllActivity", contents: []};
    window.__runDuiCallback(event);
  }

  getRows = () =>
    {
      return (<ListView
        id={this.idSet.announcementListContainer}
        width="match_parent"
        height="match_parent"/>);
    }

  showList = () =>{
      console.log("showlist",this.details);
      this.jsonArray=[]
      this.list.map((item, i) => {
          var card = (
            <AnnouncementCard
              params={item}
              tag="OPEN_AnnouncementDetailActivityFromViewAll"
              onClick={()=>this.handleAnnouncementClick(item.id,this.offset+i)}/>
          )
          this.jsonArray.push({ view: this.getView(card.render()),value:"",viewType:0});
        });
        var callback = callbackMapper.map(function() {
          console.log("view more button pressed");  
          _this.handleViewMoreClick();
        });
        console.log("in showlist");
        if(this.offset<this.limitForNumberOfAnnouncements){
          var buttonText = this.details.count>10?window.__S.VIEW_MORE:"";
          var buttonCallback = this.details.count>10?callback:""; 
          JBridge.listViewAdapter(
            this.idSet.announcementListContainer,
            JSON.stringify(this.jsonArray),
            1000,
            buttonText,
            buttonCallback,
            this.idSet.viewMoreButton,
            10
          );
        }else{
          JBridge.appendToListView(
          this.idSet.announcementListContainer,
          JSON.stringify(this.jsonArray),
          1000);
        }
        console.log("end of showlist");
        window.__LoaderDialog.hide();
  }

  handleViewMoreClick=()=>{
    if (!JBridge.isNetworkAvailable()){
      window.__Snackbar.show(window.__S.ERROR_NO_INTERNET_MESSAGE);
      return;
    } 
    window.__LoaderDialog.show();  
    this.offset +=this.limitForNumberOfAnnouncements;
    var request = {
      "offset": this.offset,
      "limit" : this.limitForNumberOfAnnouncements
    };
    var whatToSend = {
      user_token: window.__user_accessToken,
      api_token: window.__apiToken,
      requestBody: JSON.stringify(request)
    };
    var event = {tag: "API_GetMoreAnnouncementData", contents: whatToSend};
    this.announcementResponseCame=false;
    setTimeout(() => {
      if (this.announcementResponseCame) return;
      this.announcementResponseCame = true;
      window.__LoaderDialog.hide();
      window.__Snackbar.show("Unable to fetch more announcements");
    }, window.__API_TIMEOUT);
    window.__runDuiCallback(event);
  }

  changeViewMoreButtonStatus(){
    JBridge.hideFooterView(
      this.idSet.announcementListContainer,
      this.idSet.viewMoreButton
    );
  }

  handleStateChange = (state) =>{
    if(this.announcementResponseCame)
      return;
    this.announcementResponseCame=true;
    var res = utils.processResponse(state);
    console.log("response",res);        
    if(res.code=="200"&&res.data.responseCode=="OK"){
    this.list=res.data.result.announcements||"";
    if(this.list.length<this.limitForNumberOfAnnouncements){
      this.changeViewMoreButtonStatus();
    }
    this.showList();
    }else{
      window.__Snackbar.show("Unable to fetch more announcements");      
    }
    window.__LoaderDialog.hide();       
  }

  handleAnnouncementClick = (id,index) => {
    JBridge.logAnnouncementClicked("ANNOUNCEMENT_LIST",id, index + 1);
  }

  afterRender(){
    _this.showList();      
    JBridge.logAnnouncementListShow();
  }

  render(){
      this.layout=(
      <LinearLayout
        width="match_parent"
        height="match_parent"
        root = "true"
        clickable="true"
        background="#ffffff"
        orientation="vertical">
        <SimpleToolbar
          title={window.__S.ALL_ANNOUNCEMENTS}
          onBackPress={this.onBackPressed}
          width="match_parent"/>
        {this.getRows()}
      </LinearLayout>
      );
      return this.layout.render()
  }
}
module.exports = Connector(AnnouncementViewAllActivity);
