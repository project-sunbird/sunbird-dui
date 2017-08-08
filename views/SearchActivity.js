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
    console.log("state in search activity",state)
    this.tempData = JSON.parse(state.data.value0.filterDetails);
    console.log("tempData in search ^^^^^^^^^^^^^^^^^^", this.tempData);
    
    this.filter=[]
    // if(this.tempData.length>0){
      this.filterData = this.tempData.filterDetails;
      this.searchText = this.tempData.filterDetails.query
      this.searchType = this.tempData.filterType
    // }
    console.log("filter in search ^^^^^^^^^^^^^^^^^^", this.filterData);
    this.temp = state.data;
    console.log("temp in search ^^^^^^^^^^^^^^^^^^", this.temp);
    this.searchType = this.tempData.searchType;
    console.log("type", this.searchType);

    window.searchData = this.logSearch;

    _this = this;
    // this.checkSearchList(this.filterData.length, this.filterData);
  }

  // checkSearchList = (length, data) => {
  //   if (length != 0) {

  //     data = JSON.parse(data)
  //     console.log("query!", data.query)
  //     this.getSearchList(data.query,"true");

      

  //   }
  // }

  afterRender = () => {
    console.log(this.filterData)
    
    if(this.filterData!=undefined && this.filterData.length != 0){
    JBridge.showSnackBar("Loading Search Results Please Wait......")      
       var cmd = "";
        cmd += _this.set({
          id: _this.idSet.filterHolder,
          visibility: "visible"
        })
        Android.runInUI(cmd, 0);

      var searchData 
      if (typeof this.filterData == 'object'){
        searchData=this.filterData
      }else{
        searchData=JSON.parse(this.filter)
      }
      console.log("Loading detials for ")
      this.getSearchList(this.searchText,"true");
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

  logSearch = (data) =>{
    console.log("data from search",data)
  }

  getSearchList=(searchText,flag)=> {
    if(searchText == ""){
      this.renderNoResult();
    }
    else
    {
        console.log("oin get search List",searchText);
        var callback = callbackMapper.map(function(data) {
          console.log("search data from api",data)
          console.log("search results", JSON.parse(data[1]));
          data[0] = utils.decodeBase64(data[0])
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
        // if (searchText.length > 2) {
          if (this.filterData!=undefined && this.filterData.length == 0) {
            status = "false";
          } else {
            status = "true";
            // this.filterData = this.temp;
          }
          console.log("this.filterData in search",this.filterData)
          // console.log("searchtext", searchText);
          // console.log("this.filterData", this.filterData);

          var s = "";
          // if (typeof this.filterData == 'object') {
          //   this.filterData = this.filterData.value0.filterDetails;
          //   console.log("this.filterData", this.filterData);
          //   var s = JSON.parse(this.filterData);
          //   console.log("filterHolder", s.filterDetails);
          //   this.filterData = s.filterDetails;
          // }
          // if(typeof this.filterData == "string" && this.filterData.length >10){
          //   this.filterData = JSON.parse(this.filterData)
          // }


          console.log("this.filterData", this.filterData);
          console.log("this.filterData", typeof(this.filterData));
          if(JBridge.isNetworkAvailable()){
              JBridge.showSnackBar("Loading Search Results Please Wait......")
              JBridge.searchContent(callback, JSON.stringify(this.filterData), searchText, this.searchType, flag,30);
          }
          else{
            JBridge.showSnackBar("No internet connection");
          }
        // }
        this.showFilter();
    }
  }



  onBackPressed = () => {
     JBridge.hideKeyboard();
     var whatToSend = [];
     var event = { tag: "BACK_SearchActivity", contents: whatToSend }
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


  handleSearchClick = (searchText) => {
    JBridge.hideKeyboard();

    
    this.getSearchList(searchText[0],"false");
    
    

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

    var filteredData = { filterDetails: this.filterData,
       filterType: this.searchType ,
       filterFor : this.searchTextValue}
    var whatToSend = { filterDetails: JSON.stringify(filteredData) } 
    var event = { tag: "OPEN_FilterActivity", contents: whatToSend}
    window.__runDuiCallback(event);
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

module.exports = Connector(SearchActivity);
