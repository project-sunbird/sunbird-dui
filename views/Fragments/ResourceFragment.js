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
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
window.R = require("ramda");
var HomeQuestionCardStyle = require('../../components/Sunbird/HomeQuestionCardStyle');
var CircularLoader = require('../../components/Sunbird/core/CircularLoader');
var SearchToolbar = require('../../components/Sunbird/core/SearchToolbar');
var LineSpacer = require('../../components/Sunbird/core/LineSpacer');
var NoInternetCard = require('../../components/Sunbird/NoInternetCard');
var SimpleToolbar = require('../../components/Sunbird/core/SimpleToolbar');
var CourseContainer = require('../../components/Sunbird/CourseContainer');
var HomeRecommendedContainer = require('../../components/Sunbird/HomeRecommendedContainer');
var ResourceContainer = require('../../components/Sunbird/ResourceContainer');
var OfflineResourceContainer = require('../../components/Sunbird/OfflineResourceContainer');
var utils = require('../../utils/GenericFunctions');


var _this;
class ResourceComponent extends View {
  constructor(props, children) {
    super(props, children);
    this.props.appendText = this.props.appendText || "";
    this.screenName = "ResourceFragment";
    this.setIds([
      "parentContainer",
      "infoContainer",
      "viewallContainer",
      "offlineContainer",
      "scrollViewContainer",
      "resourceContentContainer"
    ]);
    _this = this;

    this.data = [];

    if (window.__ResourceFilter) {
      this.menuData = {
        url: [
          { imageUrl: "ic_action_search" },
          { imageUrl: "ic_action_filter_applied" }
        ]
      }
    } else {
      this.menuData = {
        url: [
          { imageUrl: "ic_action_search" },
          { imageUrl: "ic_action_filter" }
        ]
      }
    }
    JBridge.logTabScreenEvent("LIBRARY");
  }

  handlePageApi = (isErr, data) => {
    console.log("data in handlePageApi -> ", data);

    if (isErr) {
      this.cards = (<LinearLayout
        height="wrap_content"
        width="match_parent"
        orientation="vertical"
        root="true">
        {this.getErrorLayout()}
      </LinearLayout>);
    } else {
      window.__PageFilterPopup.resetPopup("Resource", data);
      this.details = data.result.response;
      if (this.details.hasOwnProperty("name")) {

        var cardsContent = this.details.sections.map((item) => {
          return (this.getResourceCardLayout(item))
        })
        this.cards = (<LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical"
          root="true">
          <LineSpacer />
          {cardsContent}
        </LinearLayout>)
      } else {
        this.cards = (<LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical"
          root="true">
          {this.getErrorLayout()}
        </LinearLayout>);
      }
    }
    window.__LoaderDialog.hide();
    this.replaceChild(this.idSet.resourceContentContainer, this.cards.render(), 0);
  }

  handleStateChange = (state) => {
    var res = utils.processResponse(state);
    var status = res.status;
    var responseData = res.data;
    var responseCode = res.code;
    var responseUrl = res.url;
    if (state.hasOwnProperty("filter_to_send")) {
      responseData.filter_to_send = state.filter_to_send;
    }
    var isErr = res.hasOwnProperty("err");

    console.log("responseData -> ", responseData);

    switch(state.responseFor) {
      case "API_ResourceFragment":
        this.handlePageApi(isErr, responseData);
        break;
      case "API_FilterPage":
        window.__ResourceFilter = responseData;
        window.__BNavFlowRestart();
        break;
    }
    utils.addSwipeFunction(this.idSet.scrollViewContainer);
  }


  getResourceCardLayout = (content) => {
    console.log("resource contents", content)

    return (
      <LinearLayout
        height="wrap_content"
        width="match_parent"
        root="true"
        orientation="vertical">

        <ResourceContainer
          data={content.contents}
          title={content.name}
          searchQuery={content.searchQuery}
          onViewAllClick={this.handleResourceViewAllClick} />
      </LinearLayout>)
  }


  handleResourceViewAllClick = (data, title, searchQuery, visibility) => {

    var resourceDetails = {
      "title": title,
      "resourceDetails": data,
      "searchQuery": searchQuery,
      "showViewMore": visibility
    }
    var whatToSend = { "resourceDetails": JSON.stringify(resourceDetails) }
    var event = { tag: "OPEN_ResourceViewAllActivity", contents: whatToSend }

    window.__runDuiCallback(event);
  }

  getErrorLayout = () => {
    console.log("getErrorLayout render");
    
    var layout = (

      <LinearLayout
        background={window.__Colors.WHITE}
        height="400"
        width="match_parent"
        alpha="0.55"
        weight="1"
        orientation="vertical"
        gravity="center_horizontal"
        clickable="true">

        <ImageView
          width="100"
          height="100"
          margin="0,58,0,0"
          gravity="center_horizontal"
          imageUrl="ic_no_internet" />

        <TextView
          width="wrap_content"
          height="wrap_content"
          gravity="center_horizontal"
          padding="0,16,0,0"
          style={window.__TextStyle.textStyle.CARD.HEADING}
          text={window.__S.ERROR_FETCHING_DATA} />


      </LinearLayout>
    )
    return layout;
  }

  getBody = () => {
    return (
      <LinearLayout
        orientation="vertical"
        width="match_parent"
        id={this.idSet.parentContainer}
        height="match_parent">

        <SimpleToolbar
          title={window.__S.LIBRARY_LW}
          width="match_parent"
          showMenu="true"
          hideBack="true"
          menuData={this.menuData}
          onMenuItemClick={this.handleMenuClick} />

        <ScrollView
          height="0"
          id={this.idSet.scrollViewContainer}
          weight="1"
          width="match_parent">

          <LinearLayout
            height="match_parent"
            width="match_parent"
            background={window.__Colors.WHITE}
            orientation="vertical">

            <LinearLayout
              id={this.idSet.offlineContainer}
              width="match_parent"
              height="wrap_content"
              orientation="vertical"
              layoutTransition="true" />

            <LinearLayout
              id={this.idSet.resourceContentContainer}
              width="match_parent"
              orientation="vertical"
              weight="1"
              layoutTransition="true">

              <CircularLoader 
                margin="0,16,0,0"/>
            </LinearLayout>
            {this.getSignInOverlay()}
          </LinearLayout>
        </ScrollView>
      </LinearLayout>
    )
  }

  handleMenuClick = (url) => {
    if (url == "ic_action_filter" || url == "ic_action_filter_applied") {
      JBridge.explicitSearch("LIBRARY", "FILTER");
      window.__PageFilterPopup.show();

    } else if (url == "ic_action_search") {
      var searchDetails = { filterDetails: "", searchType: "Library" }
      var whatToSend = { filterDetails: JSON.stringify(searchDetails) }
      var event = { tag: "OPEN_SearchActivity", contents: whatToSend }
      window.__runDuiCallback(event);
    }
  }

  handleResourceOpen = (data) => {
    var whatToSend = { resourceDetails: "nothing" }
    var event = { tag: "StartResourceDetailFlow", contents: whatToSend }
    window.whatToSend(event);
  }

  afterRender = () => {
    this.renderOfflineCard();
    if (!window.__ResourceFilter) {
      this.getResourceData();
    } else {
      var responseData = window.__ResourceFilter;
      var isErr = responseData.hasOwnProperty("err");
      this.handlePageApi(isErr, responseData);
      window.__ResourceFilter = undefined;
    }
    utils.addSwipeFunction(this.idSet.scrollViewContainer);
  }

  getResourceData = () => {
    if (!JBridge.isNetworkAvailable()) {
      window.__ContentLoadingComponent.hideLoader();
      window.__LoaderDialog.hide();
      window.timer = setTimeout(this.networkCheck, 5000);
      this.replaceChild(this.idSet.resourceContentContainer, (<NoInternetCard/>).render(), 0);
    } else {
      var whatToSend = {
        user_token: window.__user_accessToken,
        api_token: window.__apiToken
      };
      var event = { tag: "API_ResourceFragment", contents: whatToSend };
      window.__runDuiCallback(event);
    }
  }

  renderOfflineCard = () => {
    var callback = callbackMapper.map(function (params) {

      params[0] = utils.decodeBase64(params[0])
      params[0] = utils.jsonifyData(params[0]);
      _this.data = JSON.parse(params[0]);
      console.log("local data", _this.data)

      var layout = (
        <LinearLayout
          width="match_parent"
          height="wrap_content"
          orientation="vertical">

          <OfflineResourceContainer
            onResourceOpenClick={_this.handleResourceOpen}
            data={_this.data}
            title={window.__S.SAVED_RESOURCES}
            onViewAllClick={_this.handleResourceViewAllClick} />

          <LineSpacer />
        </LinearLayout>
      );

      _this.replaceChild(_this.idSet.offlineContainer, layout.render(), 0);
    });

    JBridge.getAllLocalContent(callback);
    window.__ContentLoadingComponent.hideLoader();
    window.__LoaderDialog.hide();
  }

  getSignInOverlay = () =>{
    if(window.__loggedInState && window.__loggedInState=="GUEST"){
      return (
        <LinearLayout
          background={window.__Colors.WHITE_F2}
          clickable="true"
          padding = "16,16,16,16">
          <HomeQuestionCardStyle
            currComponentLocation={"LIBRARY"}
           headerText = {window.__S.OVERLAY_LABEL_COMMON}
           infoText = {window.__S.OVERLAY_INFO_TEXT_COMMON}
           textSize = "16"
           gravity = "left"/>
        </LinearLayout>)
      }else {
        return (<LinearLayout/>)
      }
  }

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
