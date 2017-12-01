var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var ListView = require("@juspay/mystique-backend/src/android_views/ListView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");

var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");

var AnnouncementCard = require('../components/Sunbird/AnnouncementCard');
const CommunityParams = require('../CommunityParams');

var utils = require('../utils/GenericFunctions');
var Styles = require("../res/Styles");

let IconStyle = Styles.Params.IconStyle;
window.R = require("ramda");
var _this;
class AnnouncementViewAllActivity extends View {
    constructor(props, children, state) {
      super(props, children, state);
      this.jsonArray=[];
      this.setIds([
          "announcementListContainer",
      ]);
      this.details=JSON.parse(utils.decodeBase64(JBridge.getSavedData("savedAnnouncements")));
      //this.details=this.details.announcements;
      console.log("AnnouncementViewAllActivity -->:",this.details);
      this.screenName = "AnnouncementViewAllActivity";
      this.shouldCacheScreen = false;
      _this = this;
      window.__LoaderDialog.show();
    }
    getToolbar  = () =>{
        return( <LinearLayout
                height="56"
                padding="0,0,0,2"
                background={window.__Colors.PRIMARY_BLACK_22}
                width="match_parent" >
                    <LinearLayout
                      height="56"
                      padding="0,0,0,0"
                      gravity="center_vertical"
                      orientation="horizontal"
                      background={window.__Colors.WHITE}
                      width="match_parent" >
                       <ImageView
                        margin="0,0,10,0"
                        style={IconStyle}
                        height="48"
                        width="48"
                        onClick={this.onBackPressed}
                        imageUrl = {"ic_action_arrow_left"}/>
                       <TextView
                        width="wrap_content"
                        height="wrap_content"
                        text="All Announcements"
                        style={window.__TextStyle.textStyle.TOOLBAR.HEADING}/>
                    </LinearLayout>
                </LinearLayout>);
      }
    onBackPressed = () => {
        var whatToSend = []
        var event = { tag: "BACK_AnnouncementViewAllActivity", contents: whatToSend};
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
               onClick={this.handleAnnouncementClick}
               index={i}/>
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
    handleAnnouncementClick = (item,whereFrom,details ,index) => {
      JBridge.logAnnouncementClicked(item, index);
      var whatToSend = {
                        "announcementData": JSON.stringify({
                          "announcementId" : item,
                          "whereFrom": whereFrom,
                          "details" : details
                        })
                       }
      var event ={ tag: "OPEN_AnnouncementDetailActivityFromViewAll", contents: whatToSend }
      window.__runDuiCallback(event);

      }
    afterRender(){
      JBridge.logAnnouncementListShow();
      console.log("AnnouncementViewAllActivity after render");
      _this.showList();
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
        {this.getToolbar()}
        {this.getRows()}
      </LinearLayout>
        );
        return this.layout.render()
    }
}
module.exports = Connector(AnnouncementViewAllActivity);
