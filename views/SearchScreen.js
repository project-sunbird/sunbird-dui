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
    this.shouldCacheScreen = false;
    this.screenName = "SearchScreen"
    this.tempData = JSON.parse(state.data.value0.filterDetails);
    this.filterData = this.tempData.filterDetails;
    console.log("filter in search ^^^^^^^^^^^^^^^^^^", state.data);
    this.temp = state.data;
    this.searchType = this.tempData.searchType;
    console.log("type", this.searchType);

    _this = this;
    // this.checkSearchList(this.filterData.length, this.filterData);
  }

  checkSearchList = (length, data) => {
    if (length != 0) {

      data = JSON.parse(data)
      console.log("query!", data.query)
      this.getSearchList(data.query);

      

    }
  }

  afterRender = () => {

    if(this.filterData.length != 0){
    JBridge.showSnackBar("Loading Search Results Please Wait......")      
       var cmd = "";
        cmd += _this.set({
          id: _this.idSet.filterHolder,
          visibility: "visible"
        })
      Android.runInUI(cmd, 0);
      var searchData = JSON.parse(this.filterData)
      this.getSearchList(searchData.query);
    }

    var callback = callbackMapper.map(function(data) {

      _this.handleSearchClick(data);

    });

    JBridge.handleImeAction(this.idSet.searchHolder, callback);

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
      onClick={this.onBackPressed}
      imageUrl = {"ic_action_arrow_left"}/>)
  }

  getTitle = () => {
    return (<LinearLayout
            height="match_parent"
            width="0"
            layoutTransition="true"
            gravity="center_vertical"
            weight="1">

              <EditText
                  height="match_parent"
                  width="0"
                  weight="1"

                  maxLines="1"
                  hint="Search"
                  layoutTransition="true"
                  gravity="center_vertical"
                  background="#ffffff"
                  id={this.idSet.searchHolder}
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

  renderNoResult = () => {

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

    this.replaceChild(this.idSet.searchListContainer, layout.render(), 0);

  }


  renderResult = (data) => {

    var layout = (<LinearLayout
                   width="match_parent"
                   height="wrap_content"
                   root="true"
                   background="#ffffff"
                   orientation="vertical">
                    <SearchResult 
                      data={data} />
                  </LinearLayout>)

    this.replaceChild(this.idSet.searchListContainer, layout.render(), 0);
  }

  updateSearchText = (data) => {
    this.searchTextValue = data;
  }


  getSearchList(searchText) {
    console.log("oin get search List",searchText);
    var callback = callbackMapper.map(function(data) {
      console.log("search results", JSON.parse(data[1]));
      _this.filterData = data[1];
      if (searchText == "" || data[0] == "[]") {
        _this.renderNoResult();
      } else {
        var s = data[0];
        s = s.replace(/\\n/g, "\\n")
          .replace(/\\'/g, "\\'")
          .replace(/\\"/g, '\\"')
          .replace(/\\&/g, "\\&")
          .replace(/\\r/g, "\\r")
          .replace(/\\t/g, "\\t")
          .replace(/\\b/g, "\\b")
          .replace(/\\f/g, "\\f");
        s = s.replace(/[\u0000-\u0019]+/g, "");
        _this.renderResult(JSON.parse(s));
      }

    });
    console.log("searchText",searchText)
    if (searchText.length > 2) {
      if (this.filterData.length == 0) {
        status = "false";
      } else {
        status = "true";
        this.filterData = this.temp;
      }
      console.log("searchtext", searchText);
      console.log("this.filterData", this.filterData);

      var s = "";
      if (typeof this.filterData == 'object') {
        this.filterData = this.filterData.value0.filterDetails;
        var s = JSON.parse(this.filterData);
        console.log("filterHolder", s.filterDetails);
        this.filterData = s.filterDetails;
      }

      console.log("this.filterData", this.filterData.length);
      console.log("this.filterData", this.filterData);

      JBridge.searchContent(callback, this.filterData, searchText, this.searchType, status);
    }
    this.showFilter();
  }



  onBackPressed = () => {
     JBridge.hideKeyboard();
     window.__changePureScriptFlow();
  }

  showFilter = () =>{
     var cmd = "";
     cmd += _this.set({
      id: _this.idSet.filterHolder,
      visibility: "visible"
     });

    Android.runInUI(cmd, 0);

  }


  handleSearchClick = (searchText) => {
    JBridge.showSnackBar("Loading Search Results Please Wait......")
    this.getSearchList(searchText[0]);
    
    if (searchText != "") {
      JBridge.hideKeyboard();
    }

  }

  handleClearClick = () => {

    JBridge.showKeyboard();

    var cmd = "";
    cmd += _this.set({
      id: _this.idSet.searchHolder,
      text: "",
    })

    cmd += _this.set({
      id: _this.idSet.filterHolder,
      visibility: "gone"
    })

    Android.runInUI(cmd, 0);
  }

  handleFilterClick = () => {
    JBridge.hideKeyboard();
    console.log("fdata!!!!!!!!!!!!!!!!!!", _this.filterData);

    // window.__runDuiCallback({ tag: "StartFilterFlow",contents:{filterDetails:JSON.stringify(this.filterData)} });
    var filteredData = { filterDetails: _this.filterData, filterType: _this.searchType }
    window.__runDuiCallback({ tag: "StartFilterFlow", contents: { filterDetails: JSON.stringify(filteredData) } });
  }

  onItemClick = (params) => {
    console.log("parmas sare", params);
  }



  
  getToolbar = () => {
    return (<LinearLayout
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

                    {this.getBack()}
                    {this.getTitle()}

                    
                    {this.getMenu()}

                 </LinearLayout>

             </LinearLayout>)
  }

  render() {

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

         
            {this.getToolbar()}
        

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
