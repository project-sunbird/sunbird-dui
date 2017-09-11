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

class SearchActivity extends View {
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

    this.screenName = "SearchActivity"

    this.tempData = JSON.parse(state.data.value0.filterDetails);
    this.filterIcon="ic_action_filter";


    this.filter=[]
    this.filterData = this.tempData.filterDetails;
    this.searchText = this.tempData.filterDetails.query
    this.searchType = this.tempData.filterType
    this.temp = state.data;
    this.searchType = this.tempData.searchType;
    window.searchData = this.logSearch;


    _this = this;

  }



  afterRender = () => {

    if(this.filterData!=undefined && this.filterData.length != 0){
      console.log(this.filterData, "filterinsearch");
      var flag=false;
      var facetFilters = this.filterData.facetFilters
      var i=0;
      var j=0;
      for (i=0;i<facetFilters.length;i++)
      {
        for (j=0; j<facetFilters[i].values.length;j++)
        {
            if(facetFilters[i].values[j].apply==true)
                {
                  flag=true;
                  break;
                }

        }
         if(flag)
         {break;}
      }

      if(flag)
      {this.filterIcon="ic_action_filter_applied";}
      else {
        this.filterIcon="ic_action_filter";
      }

       var cmd = "";
        cmd += _this.set({
          id: _this.idSet.filterHolder,
          visibility: "visible",
          imageUrl : this.filterIcon
        })
        Android.runInUI(cmd, 0);

      var searchData
      if (typeof this.filterData == 'object'){
        searchData=this.filterData
      }else{
        searchData=JSON.parse(this.filter)
      }
      this.getSearchList(this.searchText,"true");
      window.__LoaderDialog.show();
    }
    else if(window.searchText!=undefined && window.searchText!=""){
        this.getSearchList(window.searchText,"false");
        window.__LoaderDialog.show();
    }

    var callback = callbackMapper.map(function(data) {
      window.searchText=data[0];
      _this.handleSearchClick(data);

    });

    console.log("VISIBILITY IN AFTERRENDER",window.__LoaderDialog.visibility);

    JBridge.handleImeAction(this.idSet.searchHolder, callback);

  }

  onPop = () => {


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
                  hint={window.__S.SEARCH_HINT}
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
                      imageUrl = {this.filterIcon}/>

                   </LinearLayout>)
    return layout;

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
    window.__LoaderDialog.hide();

  }


  renderResult = (data,searchText) => {
    console.log("data from server",data)
    var layout = (<LinearLayout
                   width="match_parent"
                   height="wrap_content"
                   root="true"
                   background="#ffffff"
                   orientation="vertical">
                    <SearchResult
                      filterData = {_this.filterData}
                      searchType = {this.searchType}
                      searchText = {searchText}
                      data={data} />
                  </LinearLayout>)

    this.replaceChild(this.idSet.searchListContainer, layout.render(), 0);
    window.__LoaderDialog.hide();
  }

  updateSearchText = (data) => {
    this.searchTextValue = data;
  }

  logSearch = (data) =>{
    console.log("data from search",data)
  }

  getSearchList=(searchText,flag)=> {

    if(searchText == ""){
      console.log("empty text"+window.__LoaderDialog.visibility);
      this.renderNoResult();
      window.__LoaderDialog.hide();
    }
    else
    {

        var callback = callbackMapper.map(function(data) {
          data[0] = utils.decodeBase64(data[0])
          _this.filterData = data[1];
                if (searchText == "" || data[0] == "[]") {
                  _this.renderNoResult();
                  window.__LoaderDialog.hide();

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
                  _this.renderResult(JSON.parse(s),searchText);
                  window.__LoaderDialog.hide();

                }
        });

          if (this.filterData!=undefined && this.filterData.length == 0) {
            status = "false";
          } else {
            status = "true";
          }


          var s = "";
          if(JBridge.isNetworkAvailable()){
              console.log(this.filterData," filterData ");
              JBridge.searchContent(callback, JSON.stringify(this.filterData), searchText, this.searchType, flag, 30);
          }
          else{
            window.__LoaderDialog.hide();
            JBridge.showSnackBar(window.__S.ERROR_NO_INTERNET_MESSAGE);
          }

        this.showFilter();
    }
  }



  onBackPressed = () => {
     JBridge.hideKeyboard();
     var whatToSend = [];
     window.searchText="";
     var event = { tag: "BACK_SearchActivity", contents: whatToSend }
     window.__runDuiCallback(event);
     window.__LoaderDialog.hide();
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
    JBridge.hideKeyboard();
    this.filterData = "";

    if(JBridge.isNetworkAvailable()){
      window.__LoaderDialog.show();
      this.getSearchList(searchText[0],"false");
    }
    else
      JBridge.showSnackBar(window.__S.ERROR_NO_INTERNET_MESSAGE)

  }

  handleClearClick = () => {

    // JBridge.showKeyboard();

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

    var filteredData = { filterDetails: this.filterData,
       filterType: this.searchType ,
       filterFor : this.searchTextValue}
    var whatToSend = { filterDetails: JSON.stringify(filteredData) }
    var event = { tag: "OPEN_FilterActivity", contents: whatToSend}
    window.__runDuiCallback(event);
  }

  onItemClick = (params) => {
    console.log("parmas are", params);
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

module.exports = Connector(SearchActivity);
