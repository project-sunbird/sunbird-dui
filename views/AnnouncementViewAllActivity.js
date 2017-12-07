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
      this.details.announcements.map((item, i) => {
          var card = (
            <AnnouncementCard
              params={item}
              tag="OPEN_AnnouncementDetailActivityFromViewAll"
              onClick={()=>this.handleAnnouncementClick(item.id,i)}/>
          )
          this.jsonArray.push({ view: this.getView(card.render()),value:"",viewType:0});
        });
        console.log("in showlist");
        JBridge.listViewAdapter(
          this.idSet.announcementListContainer,
          JSON.stringify(this.jsonArray),
          1000,
          null,
          "",
          "",
          10
        );
        console.log("end of showlist");
        window.__LoaderDialog.hide();
  }

  handleAnnouncementClick = (id,index) => {
    JBridge.logAnnouncementClicked(id, index);
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
