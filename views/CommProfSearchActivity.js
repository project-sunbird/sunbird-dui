var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var objectAssign = require('object-assign');
window.R = require("ramda");
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var FilterDialog = require('../components/Sunbird/core/FilterDialog');
var Spinner = require('../components/Sunbird/core/Spinner');
var SearchResult = require('../components/Sunbird/SearchResult');
var Styles = require("../res/Styles");
let IconStyle = Styles.Params.IconStyle;
var _this;
var utils = require('../utils/GenericFunctions');

class CommProfSearchActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.setIds([
      "searchEditHolder",
      "searchListContainer",
      "clearHolder",
      "filterHolder",
      "spinner"
    ]);
    this.state = state;
    console.log(this.state, "CommProfSearchActivity state");
    this.shouldCacheScreen = false;

    this.screenName = "CommProfSearchActivity"

    this.tempData = JSON.parse(state.data.value0.filterDetails);

    // this.filter=[]
    // this.filterData = this.tempData.filterDetails;
    // this.searchText = this.tempData.filterDetails.query
    // this.searchType = this.tempData.filterType
    // this.temp = state.data;
    // this.searchType = this.tempData.searchType;
    window.searchData = this.logSearch;
    // window.searchProf = "";
    _this = this;
  }

  handleStateChange = (state) => {
    var res = utils.processResponse(state);

    // if (state.response.status[0]){
    var status = res.status;
    var responseData = res.data;
    var responseCode = res.code;
    var responseUrl = res.url;
    // } else if (state.response.hasOwnProperty("status")){
    //   var status = state.response.status;
    //   var responseData = "";
    //   var responseCode = state.response.statusCode;
    //   var responseUrl = "";
    // }

    // if(responseCode == 401){
    //   window.__LoaderDialog.hide();
    //   var callback  = callbackMapper.map(function(token){
    //     window.__apiToken = token;
    //     var whatToSend = {"user_token":window.__userToken,"api_token": window.__apiToken}
    //     var event = { "tag": state.responseFor, contents: whatToSend };
    //     window.__runDuiCallback(event);
    //   });
    //   JBridge.getApiToken(callback);
    //   return;
    // }else if(responseCode == 501 || status === "failure" || status=="f" || responseCode == 504 || status == "failed") {
    //   window.__LoaderDialog.hide();
    //   window.__Snackbar.show(window.__S.ERROR_SERVER_CONNECTION)
    // } else {
    //   responseData = utils.decodeBase64(responseData);
    //   window.__LoaderDialog.hide();
    //   responseData = JSON.parse(responseData);
    // }

    if(state.responseFor == "API_SearchProfile"){
      if(responseData.result.response.content && responseData.result.response.content.length > 0){
        var content = responseData.result.response.content;
        console.log(responseData, "res after parse");
        var data = [];
        content.map((item, i) => {
          data.push({
            name: item.firstName + (item.lastName?" " + item.lastName : ""),
            data: item
          })
        })
        this.renderResult(data);
        window.__LoaderDialog.hide();
      }else{
        this.renderNoResult();
        window.__LoaderDialog.hide();
      }
    }else {
      window.__Snackbar.show(window.__S.ERROR_FETCHING_DATA);
    }

    var callback = callbackMapper.map(function(data) {
      window.searchProf=data[0];
      _this.handleSearchClick(data);
    });

    JBridge.handleImeAction(this.idSet.searchEditHolder, callback);
  }

  afterRender = () => {
    console.log("afterRender - CommProfSearchActivity");
    if(this.filterData!=undefined && this.filterData.length != 0){

      var cmd = "";
      cmd += _this.set({
        id: _this.idSet.filterHolder,
        visibility: "visible"
      })
      Android.runInUI(cmd, 0);

      var searchData;
      if (typeof this.filterData == 'object'){
        searchData=this.filterData
      }else{
        searchData=JSON.parse(this.filter)
      }
      this.getSearchList(this.searchText,"true");
      window.__LoaderDialog.show();

    } else if(window.searchProf!=undefined && window.searchProf!=""){
        this.getSearchList(window.searchProf,"false");
        window.__LoaderDialog.show();

    }

    var callback = callbackMapper.map(function(data) {
      window.searchProf=data[0];
      _this.handleSearchClick(data);
    });

    JBridge.handleImeAction(this.idSet.searchEditHolder, callback);
  }

  onPop = () => {
    console.log("Inside onPop - CommProfSearchActivity");
    Android.runInUI(
      _this.animateView(),
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
    return (
      <LinearLayout
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
                hint={window.__S.SEARCH_HINT}
                layoutTransition="true"
                gravity="center_vertical"
                background="#ffffff"
                id={this.idSet.searchEditHolder}
                style={window.__TextStyle.textStyle.TOOLBAR.HEADING}/>

        </LinearLayout>)

  }

  getMenu = () => {
    var layout = (
      <LinearLayout
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

  getToolbar = () => {
    return (
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

              {this.getBack()}
              {this.getTitle()}
              {this.getMenu()}

           </LinearLayout>

         </LinearLayout>)
  }

  renderNoResult = () => {
    var cmd = "";
        cmd += _this.set({
          id: _this.idSet.filterHolder,
          visibility: "gone"
        })
    Android.runInUI(cmd, 0);

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
                      text={window.__S.EMPTY_SEARCH_RESULTS}/>

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
                      data={data}
                      type = "Profile" />
                  </LinearLayout>)

    this.replaceChild(this.idSet.searchListContainer, layout.render(), 0);
  }

  updateSearchText = (data) => {
    this.searchTextValue = data;
  }

  logSearch = (data) =>{
    console.log("data from search",data)
  }

  onBackPressed = () => {
     JBridge.hideKeyboard();
     var whatToSend = [];
     window.searchProf="";
     var event = { tag: "BACK_CommProfSearchActivity", contents: whatToSend }
     window.__runDuiCallback(event);
  }

  showFilter = () =>{
     var cmd = "";
     cmd += _this.set({
      id: _this.idSet.filterHolder,
      visibility: "visible"
     });

    Android.runInUI(cmd, 0);

  }

  getSearchList=(searchText,flag)=> {

    if (searchText == ""){
      this.renderNoResult();
      window.__LoaderDialog.hide();
    }
    var req = {
       "query": searchText,
       "filters":{

       },
       "offset": 0,
       "limit": 30
   }

    var whatToSend = {
      user_token: window.__user_accessToken,
      api_token: window.__apiToken,
      filter_to_send: JSON.stringify(req)
    };

    var event = { tag: "API_SearchProfile", contents: whatToSend }
    window.__runDuiCallback(event);
  }

  handleSearchClick = (searchText) => {
    JBridge.hideKeyboard();
    if(JBridge.isNetworkAvailable()){
      window.__LoaderDialog.show();
      this.getSearchList(searchText[0],"false");
    } else {
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
    }
  }

  handleClearClick = () => {

    JBridge.showKeyboard();

    var cmd = "";
    cmd += _this.set({
      id: _this.idSet.searchEditHolder,
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

    var filteredData = { filterDetails: this.filterData,
       filterType: this.searchType ,
       filterFor : this.searchTextValue}
    var whatToSend = { filterDetails: JSON.stringify(filteredData) }
    var event = { tag: "OPEN_FilterActivity", contents: whatToSend}
    window.__runDuiCallback(event);
  }

  render() {
    this.layout = (
      <RelativeLayout
        root = "true"
        clickable="true"
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
module.exports = Connector(CommProfSearchActivity);
