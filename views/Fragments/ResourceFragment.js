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
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
window.R = require("ramda");
var SearchToolbar = require('../../components/Sunbird/core/SearchToolbar');
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
    this.setIds([
      "parentContainer",
      "infoContainer",
      "viewallContainer",
      "offlineContainer",
      "scrollViewContainer"
    ]);
    _this = this;

    this.data = [];

    this.menuData = {
      url: [
        { imageUrl: "ic_action_search" },
        { imageUrl: "ic_action_filter" }
      ]
    }


    window.__UpdateOfflineContent =this.renderOfflineCard;
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

      this.cards = (<LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical"
          root="true">
            
          </LinearLayout>)
    }
  }


  getResourceCardLayout = (content) => {
    console.log("content in resource card layout\n\n\n\n\n\n\n\n",content)
    return (<LinearLayout
        height="wrap_content"
        width="match_parent"
        root="true"
        orientation="vertical">
          {this.getSpaceSeparator()}
            <ResourceContainer
             data = {content.contents}
             title={content.name}
             searchQuery = {content.searchQuery}
             onViewAllClick = {this.handleResourceViewAllClick}/>

        </LinearLayout>)
  }


handleResourceViewAllClick= (data,title,searchQuery) =>{

   var resourceDetails = {
                            "title" : title,
                            "resourceDetails" : data,
                            "searchQuery": searchQuery
                         }
   var whatToSend ={ "resourceDetails": JSON.stringify(resourceDetails)}
   var event ={ tag: "OPEN_ResourceViewAllActivity", contents:  whatToSend}

   window.__runDuiCallback(event);
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
              id={this.idSet.scrollViewContainer}
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

    var whatToSend = { "resourceDetails": JSON.stringify(this.data) }
    var event ={ tag: "OPEN_ResourceViewAllActivity", contents: whatToSend }
    window.__runDuiCallback(event);

  }

  handleMenuClick = (url) => {
    console.log("url clicked", url);
    if (url == "ic_action_filter") {
      window.__PageFilterPopup.resetPopup("Resource");
      window.__PageFilterPopup.show();
    }else if (url == "ic_notification_red") {
      var whatToSend = []
      var event = { tag: "OPEN_NotificationActivity", contents: [] }
      window.__runDuiCallback(event);
    }else if (url == "ic_action_search") {
      var searchDetails = { filterDetails: "", searchType: "Resource" }
      var whatToSend = { filterDetails: JSON.stringify(searchDetails) }
      var event = { tag: "OPEN_SearchActivity", contents: whatToSend }
      window.__runDuiCallback(event);


    }
  }


  handleResourceOpen = (data) => {
    var whatToSend = { resourceDetails: "nothing" } 
    var event = { tag: "StartResourceDetailFlow", contents: whatToSend}
    window.whatToSend(event);
  }




  getSpaceSeparator = () => {
    return (<LinearLayout
             height="6"
             orientation="vertical"
             width="match_parent"
             background={window.__Colors.WHITE_F2}/>)
  }

  afterRender = () => {
      
     this.renderOfflineCard();


     var callbackRefresh = callbackMapper.map(function(params) {
        window.__BNavFlowRestart();         
    });

      JBridge.addSwipeRefreshScrollView(this.idSet.scrollViewContainer,callbackRefresh);
  }

  renderOfflineCard =()=>{
    var callback = callbackMapper.map(function(params) {
      console.log("data from offline",params);
      params[0] = utils.decodeBase64(params[0])
      params[0] = utils.jsonifyData(params[0]);
      _this.data = JSON.parse(params[0]);
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
