var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var Space = require('@juspay/mystique-backend').androidViews.Space;

var SearchToolbar = require('../Sunbird/SearchToolbar');
var MyCommunities = require('../Sunbird/MyCommunities');
var PopularCommunities = require('../Sunbird/PopularCommunities');
var RecommendedCommunities = require('../Sunbird/RecommendedCommunities');
var CommunityViewallList = require('../Sunbird/CommunityViewallList');
var CommunityInfoComponent = require('../Sunbird/CommunityInfoComponent');
var _this;
class CommunityComponent extends View {
  constructor(props, children) {
    super(props, children);

    this.props.appendText = this.props.appendText || "";
    this.setIds([
      "parentContainer",
    ]);
    _this=this;

    this.menuData = {
      url: [
        { imageUrl: "ic_action_plus" },
        { imageUrl: "ic_action_filter" },
        { imageUrl: "ic_action_search"}
      ]
    }
  }


  getParentBody(){
    return (
      <LinearLayout
        orientation="vertical"
        width="match_parent"
        height="match_parent">

      <SearchToolbar
            hint="Enter your search"
            invert="true"
            hideBack="true"
            title="Communities"
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
                  onViewAllClick={this.handleMyViewAllClick}
                  />

                  <PopularCommunities
                  onPopularCommunityClick={this.handlePopularCommunityClick}
                  />

                  {this.getLineSeperator()}

                  <RecommendedCommunities
                  onRecommendedCommunityClick={this.handleRecommendedCommunityClick}
                  />

                </LinearLayout>

           </ScrollView>
           </LinearLayout>
      )
  }



  handleMenuClick = (url) =>{
    console.log("url clicked",url);
  }

  handleSearch=(data)=>{
    console.log("searched",data);
  }
  handleBackPress=()=>{
    console.log("came to backpress");
  }

  handleMyCommunityClick=(communityName) =>{
    var layout= (<CommunityInfoComponent name={communityName} onBackPress={this.handleBackPress}/>)
    this.replaceChild(this.idSet.parentContainer,layout.render(),null);
  }
  handlePopularCommunityClick=(communityName) =>{
    var layout= (<CommunityInfoComponent name={communityName} onBackPress={this.handleBackPress}/>)
    this.replaceChild(this.idSet.parentContainer,layout.render(),null);
  }
  handleRecommendedCommunityClick=(communityName) =>{
    var layout= (<CommunityInfoComponent name={communityName} onBackPress={this.handleBackPress}/>)
    this.replaceChild(this.idSet.parentContainer,layout.render(),null);
  }
  handleMyViewAllClick=()=>{
    this.replaceChild(this.idSet.parentContainer,(<CommunityViewallList/>).render(),null);
  }

  getLineSeperator(){
    return (<LinearLayout
             height="1"
             width="match_parent"
             margin="16,0,16,0"
             background={window.__Colors.PRIMARY_BLACK_22}/>
            )
  }

  afterRender(){
  }


  render() {
    this.layout = (
      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        afterRender={this.afterRender}
        id={this.idSet.parentContainer}
        height="match_parent">

        {this.getParentBody()}

        </LinearLayout>
    )

    return this.layout.render();
  }
}



module.exports = CommunityComponent;
