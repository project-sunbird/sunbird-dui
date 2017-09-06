var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var Space = require("@juspay/mystique-backend/src/android_views/Space");

var SearchToolbar = require('../../components/Sunbird/core/SearchToolbar');
var MyCommunities = require('../../components/Sunbird/MyCommunities');
var PopularCommunities = require('../../components/Sunbird/PopularCommunities');
var RecommendedCommunities = require('../../components/Sunbird/RecommendedCommunities');

class CommunityFragment extends View {
  constructor(props, children) {
    super(props, children);

    this.props.appendText = this.props.appendText || "";
    this.setIds([
      "parentContainer",
      "infoContainer",
      "viewallContainer"
    ]);

    this.myCommunitySelected = "";
    this.popularCommunitySelected = "";
    this.recommendedCommunitySelected = "";

    this.menuData = {
      url: [
        { imageUrl: "ic_action_plus" },
        { imageUrl: "ic_action_filter" },
        { imageUrl: "ic_action_search" }
      ]
    }
    JBridge.logTabScreenEvent("GROUPS");
  }


  getParentBody = () => {
    return (
      <LinearLayout
        orientation="vertical"
        width="match_parent"
        id={this.idSet.parentContainer}
        height="match_parent">

          <SearchToolbar
            hint="Enter your search"
            invert="true"
            hideBack="true"
            title={window.__S.GROUPS}
            onMenuItemClick={this.handleMenuClick}
            menuData={this.menuData}
            onSearch={this.handleSearch}/>


            <ScrollView
              height="0"
              weight="1"
              width="match_parent">

                <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  background={window.__Colors.WHITE_F2}
                  orientation="vertical">

                  <MyCommunities
                    onMyCommunityClick={this.handleMyCommunityClick}
                    onViewAllClick={this.handleMyViewAllClick}/>

                  <PopularCommunities
                  onPopularCommunityClick={this.handlePopularCommunityClick}/>

                  {this.getLineSeperator()}

                  <RecommendedCommunities
                  onRecommendedCommunityClick={this.handleRecommendedCommunityClick}/>

                </LinearLayout>

           </ScrollView>
           </LinearLayout>
    )
  }


  showParent = () => {
    var cmd = "";
    cmd += this.set({
      id: this.idSet.parentContainer,
      visibility: "visible"
    })
    cmd += this.set({
      id: this.idSet.infoContainer,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.viewallContainer,
      visibility: "gone"
    })
    Android.runInUI(cmd, 0);
  }

  handleMenuClick = (url) => {}

  handleSearch = (data) => {}
  handleBackPress = () => {
    this.showParent();
  }

  handleMyCommunityClick = (communityName) => {
    var whatToSend = {"community":communityName}
    var event = { tag: 'OPEN_CommunityInfoActivity',contents: whatToSend}
    window.__runDuiCallback(event);
  }

  handlePopularCommunityClick = (communityName) => {
    var whatToSend = {"community":communityName}
    var event = { tag: 'OPEN_CommunityActivity',contents: whatToSend}
    
    window.__runDuiCallback(event);
  }

  handleRecommendedCommunityClick = (communityName) => {

    var whatToSend = {"community":communityName}
    var event = { tag: 'OPEN_CommunityInfo',contents: whatToSend}
    
    window.__runDuiCallback(tEvent);
  }

  handleMyViewAllClick = () => {
    var whatToSend = []
    var event = {tag : "OPEN_CommunityViewAllActivity", contents:whatToSend}
    window.__runDuiCallback(event);
  }

  getLineSeperator() {
    return (<LinearLayout
             height="1"
             width="match_parent"
             margin="16,0,16,0"
             background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  afterRender() {
    
  }


  render() {
    this.layout = (

      <RelativeLayout
      root="true"
      clickable="false"
      width="match_parent"
      height="match_parent">


      <LinearLayout
        orientation="vertical"
        width="match_parent"
        clickable="false"
        afterRender={this.afterRender}
        height="match_parent">

        {this.getParentBody()}


        </LinearLayout>



        <LinearLayout
        gravity="center"
        centerInParent="true,-1"
        clickable="true"
        width="match_parent"
        height="match_parent">

        <LinearLayout
        width="match_parent"
        background={window.__Colors.WHITE}
        alpha = "0.9"
        gravity="center"
        clickable="false"
        height="match_parent">

          <TextView
          gravity="center"
          width="match_parent"
          height="match_parent"
          style ={window.__TextStyle.textStyle.NOTHING}
          text={window.__S.COMING_SOON}/>

       </LinearLayout>



        </LinearLayout>


      </RelativeLayout>

    )

    return this.layout.render();
  }
}



module.exports = CommunityFragment;
