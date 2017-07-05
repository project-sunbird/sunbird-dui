var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var EditText = require('@juspay/mystique-backend').androidViews.EditText;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var objectAssign = require('object-assign');
window.R = require("ramda");
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var FilterDialog = require('../components/Sunbird/core/FilterDialog');
var Spinner = require('../components/Sunbird/core/Spinner');
var SearchResult = require('../components/Sunbird/SearchResult');
var Styles = require("../res/Styles");
let IconStyle = Styles.Params.IconStyle;
var _this;

class SearchScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      "searchHolder",
      "searchListContainer",
      "clearHolder",
      "filterHolder",
      "spinner"
    ]);
    this.state = state;
    this.shouldCacheScreen=false;
    this.screenName = "SearchScreen"
     
    _this = this;
  }

  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
  }



  getBack = () => {
    return (
      <ImageView
      margin="0,0,10,0"
      style={IconStyle}
      onClick={this.handleBackPress}
      imageUrl = {"ic_action_arrow_left"}/>)
  }

  getTitle = () => {
    return (<LinearLayout
            height="match_parent"
            layoutTransition="true"
            gravity="center_vertical"
            weight="1">

              <EditText
                  height="match_parent"
                  width="match_parent"
                  maxLines="1"
                  hint="search"
                  layoutTransition="true"
                  gravity="center_vertical"
                  background="#ffffff"
                  onChange = {result=>_this.getSearchList(result)}
                  id={this.idSet.searchHolder}
                  focus="true"
                  style={window.__TextStyle.textStyle.TOOLBAR.HEADING}/>


          </LinearLayout>)

  }

   getMenu = () => {
    var layout = (<LinearLayout
                   width="wrap_content"
                   height="wrap_content">

                   <ImageView
                    onClick={this.handleClearClick}
                    id={this.idSet.clearHolder}
                    style = {IconStyle}
                    imageUrl = "ic_action_close"/>

                    <ImageView
                    onClick={this.handleFilterClick}
                    id={this.idSet.filterHolder}
                    style = {IconStyle}
                    visibility="gone"
                    imageUrl = "ic_action_filter"/>
                   
                   </LinearLayout>)
    return layout;
    
  }

  renderNoResult = () =>{

    var layout = (<LinearLayout
                   width="match_parent"
                   height="wrap_content"
                   root="true"
                   background="#ffffff"
                   gravity="center_horizontal"
                   orientation="vertical">

                    <TextView
                      height="wrap_content"
                      width="wrap_content"
                      gravity="center_horizontal"
                      maxLines="1"
                      margin="16,16,16,16"
                      style={window.__TextStyle.textStyle.TOOLBAR.HEADING}
                      text="No Search Results Found"/>

                  </LinearLayout>);

    this.replaceChild(this.idSet.searchListContainer,layout.render(),0);

  }


  renderResult = (data) =>{

    var layout = (<LinearLayout
                   width="match_parent"
                   height="wrap_content"
                   root="true"
                   background="#ffffff"
                   orientation="vertical">
                    <SearchResult 
                      data={data} />
                  </LinearLayout>)

    this.replaceChild(this.idSet.searchListContainer,layout.render(),0);
  }



  getSearchList(searchText){
    var data = [];
    var listData=[];
    var temp = [];
    var totalJson={};
    var callback = callbackMapper.map(function(data) {
      
      if(searchText == "" || data == "[]"){
        _this.renderNoResult();
      }
      else
      {
           data = JSON.parse(data);
          _this.renderResult(data);                
      }

    });

    if(searchText.length >2){
      JBridge.searchContent(callback,searchText);
    }
  }
 

  handleBackPress = () => {
    window.__changePureScriptFlow();
    window.__runDuiCallback({ action: "showMainFlow" });
  }

  handleMenuClick = (url) => {
   
    if(url=="ic_action_close"){
      this.handleClearClick();
    }
  }

  handleSearchClick = () =>{

    JBridge.hideKeyboard();

    var cmd ="";
    cmd += _this.set({
      id: _this.idSet.filterHolder,
      visibility:"visible"
    })

    Android.runInUI(cmd, 0);
     
  }

  handleClearClick = () =>{

    JBridge.showKeyboard();

    var cmd ="";
    cmd += _this.set({
      id: _this.idSet.searchHolder,
      text: "",
    })

    cmd += _this.set({
      id: _this.idSet.filterHolder,
      visibility:"gone"
    })

    Android.runInUI(cmd, 0);
  }

  handleFilterClick = () =>{

  }

  onItemClick = (params) =>{
    console.log("parmas sare",params);
  }



  afterRender = () => {

      var callback = callbackMapper.map(function(data) {

          _this.handleSearchClick();

      });

      JBridge.handleImeAction(this.idSet.searchHolder,callback);

  }


  render() {

    let back = this.getBack();
    let title = this.getTitle();
    let menu = this.getMenu();
    let spinnerData = "tty,hbhb"

    this.layout = (

      <RelativeLayout
        root = "true"
        width="match_parent"
        height="match_parent">

      <LinearLayout
        orientation="vertical"
        background={window.__Colors.WHITE}
        width="match_parent"
        height="match_parent">

          <LinearLayout
            height="56"
            padding="0,0,0,2"
            gravity="center_vertical"
            background={window.__Colors.PRIMARY_BLACK_22}
            width="match_parent" >
            <LinearLayout
              height="56"
              padding="0,0,0,0"
              gravity="center_vertical"
              root="true"
              background={window.__Colors.WHITE}
              width="match_parent" >

                {back}
                {title}

                <Space width="0" weight="1"/>
                
                {menu}

             </LinearLayout>
          </LinearLayout>
        

              <ScrollView
                height="match_parent"
                width="match_parent"
                fillViewport="true">


                <LinearLayout
                   width="match_parent"
                   height="wrap_content"
                   background="#ffffff"
                   id = {this.idSet.searchListContainer}
                   orientation="vertical"/>


                </ScrollView>
       
      </LinearLayout>

      <LinearLayout
        orientation="vertical"
        visibility="gone"
        background={window.__Colors.PRIMARY_BLACK_66}
        centerInParent = "true,-1"
        width="match_parent"
        height="match_parent">

        <LinearLayout
        width="match_parent"
        height="match_parent"
        gravity="center">

        <FilterDialog/>


        </LinearLayout>

        

      </LinearLayout>

      </RelativeLayout>


    );

    return this.layout.render();
  }
}

module.exports = Connector(SearchScreen);
