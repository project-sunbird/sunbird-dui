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

var SearchToolbar = require('../Sunbird/core/SearchToolbar');
var SimpleToolbar = require('../Sunbird/core/SimpleToolbar');
var CourseContainer = require('../Sunbird/CourseContainer');
var HomeRecommendedContainer = require('../Sunbird/HomeRecommendedContainer');
var ResourceContainer = require('../Sunbird/ResourceContainer');
var OfflineResourceContainer = require('../Sunbird/OfflineResourceContainer');
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;

var _this;
class ResourceComponent extends View {
  constructor(props, children) {
    super(props, children);

    this.props.appendText = this.props.appendText || "";
    this.setIds([
      "parentContainer",
      "infoContainer",
      "viewallContainer"
    ]);
    _this = this;

    this.myCommunitySelected = "";
    this.popularCommunitySelected = "";
    this.recommendedCommunitySelected = "";

    this.data = [];




    this.getLocalContent();

    this.menuData = {
      url: [
        { imageUrl: "ic_action_filter" },
        { imageUrl: "ic_notification_red" },
        { imageUrl: "ic_action_search" }
      ]
    }


    this.handleResponse();

  }


  handleResponse = () => {


    if (this.props.response) {
      console.log("SERVER GAVE RESPONSE")
      this.details = this.props.response.result.response;

      var cardsContent = this.details.sections.map((item) => {
        return (this.getResourceCardLayout(item))
      })
      this.cards = (<LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical"
          root="true">

            {cardsContent}

          </LinearLayout>)
    } else {
      console.log("SERVER TOLD NULL")
      this.cards = (<LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical"
          root="true">
            
          </LinearLayout>)
    }
  }



  getLocalContent = () => {
    var callback = callbackMapper.map(function(params) {
      console.log("params in resource", JSON.parse(params));
      _this.data = params;

    });

    JBridge.getAllLocalContent(callback);
  }


  getResourceCardLayout = (content) => {

    return (<LinearLayout
        height="wrap_content"
        width="match_parent"
        root="true"
        orientation="vertical">
          {this.getSpaceSeparator()}
            <ResourceContainer
             data = {content.contents}
             title={content.name}/>


        </LinearLayout>)
  }


  getBody = () => {
    return (
      <LinearLayout
        orientation="vertical"
        width="match_parent"
        id={this.idSet.parentContainer}
        height="match_parent">

          <SimpleToolbar
            title=""
            width="match_parent"
            showMenu="true"
            invert="true" 
            hideBack="true" 
            menuData={this.menuData}
            onMenuItemClick={this.handleMenuClick}/>


            <ScrollView
              height="0"
              weight="1"
              width="match_parent">

                <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  background={window.__Colors.WHITE}
                  orientation="vertical">

                   <OfflineResourceContainer
                       onResourceOpenClick = {this.handleResourceOpen}
                       data = {this.data}
                       title="Saved Resources"
                       onViewAllClick = {this.handleViewAllClick}
                       />

                  {this.cards}

                </LinearLayout>

           </ScrollView>
           </LinearLayout>
    )
  }

  handleViewAllClick = () => {
    console.log("dasdasdasdasd", this.data);
    window.__runDuiCallback({ tag: "StartResourceViewAllFlow", contents: { resourceDetails: JSON.stringify(this.data) } });


  }

  handleMenuClick = (url) => {
    console.log("url clicked", url);
    if (url == "ic_notification_red") {
      window.__runDuiCallback({ tag: "StartNotificationFlow", contents: [] });
    }
    if (url == "ic_action_search") {
      window.__runDuiCallback({ tag: "StartSearchFlow", contents: [] });

    }
  }

  handleSearch = (data) => {
    console.log("searched", data);
  }

  handleResourceOpen = (data) => {
    window.__runDuiCallback({ tag: "StartResourceDetailFlow", contents: { resourceDetails: "nothing" } });
  }




  getSpaceSeparator = () => {
    return (<LinearLayout
             height="6"
             orientation="vertical"
             width="match_parent"
             background={window.__Colors.WHITE_F2}/>)
  }

  afterRender() {}


  render() {
    this.layout = (

      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        afterRender={this.afterRender}
        height="match_parent">

        {this.getBody()}
        

        </LinearLayout>
    )

    return this.layout.render();
  }
}



module.exports = ResourceComponent;
