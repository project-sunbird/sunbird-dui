var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
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
    console.log("SA filterDetails: ", this.tempData);

    this.filterIcon = "ic_action_filter";


    this.filter = []
    this.filterData = this.tempData.filterDetails;
    this.searchText = this.tempData.filterDetails.query;
    this.searchType = this.tempData.filterType;
    this.keywords = this.tempData.keywords;
    this.temp = state.data;
    this.searchType = this.tempData.searchType;


    _this = this;

  }



  afterRender = () => {

    if (this.filterData != undefined && this.filterData.length != 0 && this.filterData.facetFilters) {
      console.log(this.filterData, "filterinsearch");
      var flag = false;
      var facetFilters = this.filterData.facetFilters
      var i = 0;
      var j = 0;
      for (i = 0; i < facetFilters.length; i++) {
        for (j = 0; j < facetFilters[i].values.length; j++) {
          if (facetFilters[i].values[j].apply == true) {
            flag = true;
            break;
          }
        }
        if (flag) { break; }
      }

      if (flag) {
        this.filterIcon = "ic_action_filter_applied";
      } else {
        this.filterIcon = "ic_action_filter";
      }

      var cmd = _this.set({
        id: _this.idSet.filterHolder,
        visibility: "visible",
        imageUrl: this.filterIcon
      });
      Android.runInUI(cmd, 0);
      // this.getSearchList(this.searchText);

      var searchData
      if (typeof this.filterData == 'object') {
        searchData = this.filterData
      } else {
        searchData = JSON.parse(this.filter)
      }
      window.__LoaderDialog.show();

      this.getSearchList(this.searchText, "true");
    } else if (window.search && window.search.type == this.searchType && window.search.res != undefined && window.search.res != "" && window.search.text != undefined && window.search.text != "") {
      console.log("prev res");
      _this.renderResult(JSON.parse(window.search.res), window.search.text);
      // window.__LoaderDialog.show();
    } else if (this.searchText && this.searchText != "") {
      console.log("handleSeachClick ", this.searchText);

      var cmd = this.set({
        id: this.idSet.searchHolder,
        text: this.searchText
      })
      Android.runInUI(cmd, 0);

      this.handleSearchClick(this.searchText);
    } else if (this.keywords) {
      this.handleSearchClick(null, this.keywords);
    }

    var callback = callbackMapper.map(function (data) {
      window.searchText = data[0];
      _this.handleSearchClick(data);
    });
    JBridge.handleImeAction(this.idSet.searchHolder, callback);
    if (!this.keywords && (window.searchText == undefined || window.searchText == "" || (window.search.type != this.searchType && window.searchText != ""))) {
      JBridge.getFocus(this.idSet.searchHolder);
    }
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
        imageUrl={"ic_action_arrow_left"} />)
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
        style={window.__TextStyle.textStyle.TOOLBAR.HEADING} />


    </LinearLayout>)

  }

  getMenu = () => {
    var layout = (<LinearLayout
      width="wrap_content"
      height="wrap_content">

      <ImageView
        onClick={this.handleClearClick}
        id={this.idSet.clearHolder}
        style={IconStyle}
        imageUrl="ic_action_close" />

      <ImageView
        onClick={this.handleFilterClick}
        id={this.idSet.filterHolder}
        style={IconStyle}
        visibility="gone"
        imageUrl={this.filterIcon} />

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
        text={window.__S.EMPTY_SEARCH_RESULTS} />

    </LinearLayout>);

    this.replaceChild(this.idSet.searchListContainer, layout.render(), 0);
    window.__LoaderDialog.hide();
    JBridge.hideKeyboard();
  }


  renderResult = (data, searchText) => {
    console.log("data from server", data)
    var layout = (<LinearLayout
      width="match_parent"
      height="wrap_content"
      root="true"
      background="#ffffff"
      orientation="vertical">
      <SearchResult
        filterData={_this.filterData}
        type={this.searchType}
        searchText={searchText}
        data={data} />
    </LinearLayout>)

    this.replaceChild(this.idSet.searchListContainer, layout.render(), 0);
    window.__LoaderDialog.hide();
  }

  updateSearchText = (data) => {
    this.searchTextValue = data;
  }

  getSearchList = (searchText, flag, keywords) => {

    if (searchText == "") {
      this.renderNoResult();
      window.__LoaderDialog.hide();
    } else {
      var callback = callbackMapper.map(function (data) {
        console.log("callback data", data);
        if (data[0] == "error") {
          console.log("Error at callback", data[1]);
          window.__Snackbar.show("" + data[1])
          _this.renderNoResult();
          window.__LoaderDialog.hide();
        } else {
          data[0] = utils.decodeBase64(data[0]);
          _this.filterData = data[1];
          if (searchText == "" || data[0] == "[]") {
            _this.renderNoResult();
            window.__LoaderDialog.hide();
          } else {
            // data[0] = utils.decodeBase64(data[0])
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
              window.search = {};
              window.search.res = s;
              window.search.text = searchText;
              window.search.type = _this.searchType;
              _this.renderResult(JSON.parse(s), searchText);
              window.__LoaderDialog.hide();

            }
          }
        }
      }); //end of callback

      if (this.filterData != undefined && this.filterData.length == 0) {
        status = "false";
      } else {
        status = "true";
      }

      if (JBridge.isNetworkAvailable()) {
        console.log(this.filterData, " filterData ");
        var filterParams = null;
        if (this.filterData != "") { filterParams = JSON.stringify(this.filterData) }
        JBridge.searchContent(callback, filterParams, searchText, this.searchType, 100, (keywords ? keywords : null), false);
      } else {
        window.__LoaderDialog.hide();
        window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE);
      }

      this.showFilter();
    }
  }



  onBackPressed = () => {
    JBridge.hideKeyboard();
    var whatToSend = [];
    window.search = {};
    var event = { tag: "BACK_SearchActivity", contents: whatToSend }
    window.__runDuiCallback(event);
    window.__LoaderDialog.hide();
  }

  showFilter = () => {
    var cmd = "";
    cmd += _this.set({
      id: _this.idSet.filterHolder,
      visibility: "visible"
    });

    Android.runInUI(cmd, 0);

  }


  handleSearchClick = (searchText, keywords) => {
    JBridge.hideKeyboard();
    this.filterData = "";
    console.log("handlesearchClick: ", this.searchType.toUpperCase());
    JBridge.explicitSearch(this.searchType.toUpperCase(), "SEARCH");

    if (JBridge.isNetworkAvailable()) {
      window.__LoaderDialog.show();
      this.getSearchList(searchText ? searchText[0] : null, "false", keywords);
    } else {
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE)
      window.__LoaderDialog.hide();
    }
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
    JBridge.explicitSearch(this.searchType.toUpperCase(), "FILTER");
    var filteredData = {
      filterDetails: this.filterData,
      filterType: this.searchType,
      filterFor: this.searchTextValue
    }
    var whatToSend = { filterDetails: JSON.stringify(filteredData) }
    var event = { tag: "OPEN_FilterActivity", contents: whatToSend }
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
        root="true"
        clickable="true"
        width="match_parent"
        height="match_parent">

        <LinearLayout
          orientation="vertical"
          background={window.__Colors.WHITE}
          width="match_parent"
          height="match_parent">

          {this.getToolbar()}

          <LinearLayout
            width="match_parent"
            height="wrap_content"
            background="#ffffff"
            id={this.idSet.searchListContainer}
            orientation="vertical" />
        </LinearLayout>

      </RelativeLayout>
    );
    return this.layout.render();
  }
}

module.exports = Connector(SearchActivity);
