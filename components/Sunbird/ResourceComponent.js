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
window.R = require("ramda");
var SearchToolbar = require('../Sunbird/core/SearchToolbar');
var SimpleToolbar = require('../Sunbird/core/SimpleToolbar');
var CourseContainer = require('../Sunbird/CourseContainer');
var HomeRecommendedContainer = require('../Sunbird/HomeRecommendedContainer');
var ResourceContainer = require('../Sunbird/ResourceContainer');
var OfflineResourceContainer = require('../Sunbird/OfflineResourceContainer');
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var utils = require('../../utils/GenericFunctions');


var _this;
class ResourceComponent extends View {
  constructor(props, children) {
    super(props, children);

    this.props.appendText = this.props.appendText || "";
    this.setIds([
      "parentContainer",
      "infoContainer",
      "viewallContainer",
      "offlineContainer"
    ]);
    _this = this;

    this.myCommunitySelected = "";
    this.popularCommunitySelected = "";
    this.recommendedCommunitySelected = "";

    this.data = [];

    this.menuData = {
      url: [
        { imageUrl: "ic_action_search" }
      ]
    }



    this.handleResponse();

  }


  handleResponse = () => {


    console.log("response in RC",this.props.response)
    if (this.props.response) {
      console.log("SERVER GAVE RESPONSE")
      this.details = this.props.response.result.response;
      if(this.details.hasOwnProperty("name")){

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
      }
      else
      {
        JBridge.showSnackBar("No internet. Offline Mode.")
        this.cards = (<LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical"
          root="true">
            
          </LinearLayout>)
      }
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


  getResourceCardLayout = (content) => {

    return (<LinearLayout
        height="wrap_content"
        width="match_parent"
        root="true"
        orientation="vertical">
          {this.getSpaceSeparator()}
            <ResourceContainer
             data = {content.contents}
             title={content.name}
             onViewAllClick = {this.handleResourceViewAllClick}/>

        </LinearLayout>)
  }


handleResourceViewAllClick= (data,title) =>{

   var resourceDetails = {
                            "title" : title,
                            "resourceDetails" : data
                         }

   window.__runDuiCallback({ tag: "StartResourceViewAllFlow", contents: { "resourceDetails": JSON.stringify(resourceDetails)} });
}



  getNoInternetLayout = () => {

    var layout = (

      <LinearLayout
          background={window.__Colors.WHITE}
          width="match_parent"
          alpha="0.9"
          weight="1"
          orientation="vertical"
          gravity="center_horizontal"
          clickable="true"
          visibility={JBridge.isNetworkAvailable()==false?"visible":"gone"}
          height="400">

            <ImageView
            width="100"
            height="100"
            margin="0,58,0,0"
            gravity="center_horizontal"
            imageUrl="ic_no_internet"/>

            <TextView
            width="wrap_content"
            height="wrap_content"
            gravity="center_horizontal"
            padding="0,16,0,0"
            style={window.__TextStyle.textStyle.CARD.HEADING}
            text="You’re not connected to the internet."/>


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
            title="Resources"
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


                  <LinearLayout
                  width="match_parent"
                  height="wrap_content"
                  orientation="vertical"
                  id={this.idSet.offlineContainer}/>

                  {this.cards}

                </LinearLayout>

           </ScrollView>
           </LinearLayout>
    )
  }


  handleViewAllClick = () => {
    console.log("dasdasdasdasd", this.data);
    window.__runDuiCallback({ tag: "StartResourceViewAllFlow", contents: { "resourceDetails": JSON.stringify(this.data) } });

  }

  handleMenuClick = (url) => {
    console.log("url clicked", url);
    if (url == "ic_notification_red") {
      window.__runDuiCallback({ tag: "StartNotificationFlow", contents: [] });
    }
    if (url == "ic_action_search") {
      var searchDetails = { filterDetails: "", searchType: "Resource" }
      window.__runDuiCallback({ tag: "StartSearchFlow", contents: { filterDetails: JSON.stringify(searchDetails) } });
      // window.__runDuiCallback({tag:"StartSearchFlow",contents:{filterDetails:""}});

    }
  }

  handleSearch = (data) => {
    console.log("searched", data);
  }

  handleResourceOpen = (data) => {
    console.log("data",data);
    window.__runDuiCallback({ tag: "StartResourceDetailFlow", contents: { resourceDetails: "nothing" } });
  }




  getSpaceSeparator = () => {
    return (<LinearLayout
             height="6"
             orientation="vertical"
             width="match_parent"
             background={window.__Colors.WHITE_F2}/>)
  }

  afterRender = () => {
  
     var callback = callbackMapper.map(function(params) {
      params = params.toString();
      params = utils.jsonifyData(params);
      _this.data = JSON.parse(params);
      console.log("OFFLINE RESOURCE CONTENT ",_this.data);

         var layout = (<OfflineResourceContainer
                       onResourceOpenClick = {_this.handleResourceOpen}
                       data = {_this.data}
                       title="Saved Resources"
                       onViewAllClick = {_this.handleResourceViewAllClick}/>)

        _this.replaceChild(_this.idSet.offlineContainer,layout.render(),0);            


    });

    JBridge.getAllLocalContent(callback);

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
