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
    // this.searchType = this.tempData.filterType;
    this.keywords = this.tempData.keywords;
    // this.temp = state.data;
    this.searchType = this.tempData.searchType;


    _this = this;

  }



  afterRender = () => {

    if (this.filterData && this.filterData.length != 0 && this.filterData.facetFilters) {
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

      // var searchData
      // if (typeof this.filterData == 'object') {
      //   searchData = this.filterData
      // } else {
      //   searchData = JSON.parse(this.filter)
      // }
      window.__LoaderDialog.show();
      if (window.search && window.search.etb && window.search.keywords) {
        this.handleSearchClick(null, window.search.keywords);
        // this.getSearchList(this.searchText, "false", window.search.keywords);
      } else {
        this.getSearchList(this.searchText, "true");
      }
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

  handleItemClick = (item, index, searchText) => {
    console.log("itemClicked ", item);

    var itemDetails = JSON.stringify(item);
    if (this.searchType.toLowerCase() == "combined")
      JBridge.logContentClickEvent("HOME", index + 1, searchText, item.identifier, item.pkgVersion)
    else if (this.searchType.toLowerCase() == "course")
      JBridge.logContentClickEvent("COURSES", index + 1, searchText, item.identifier, item.pkgVersion)
    else if (this.searchType.toLowerCase() == "resource")
      JBridge.logContentClickEvent("LIBRARY", index + 1, searchText, item.identifier, item.pkgVersion)


    if (item.hasOwnProperty("data") && item.data.hasOwnProperty("education")) {
      console.log("item data", item);
      var whatToSend = { profile: JSON.stringify(item) };
      var event = { tag: "OPEN_ProfileActivity_SEARCH", contents: whatToSend }
      window.__runDuiCallback(event);
    } else if (item.contentType.toLowerCase() == "course") {

      if (JBridge.getKey("isPermissionSetWriteExternalStorage", "false") == "true") {
        var whatToSend = { course: itemDetails };
        var event = { tag: "OPEN_CourseInfoActivity_SEARCH", contents: whatToSend }
        window.__runDuiCallback(event);
      } else {
        utils.setPermissions();
      }
    } else if (item.mimeType.toLowerCase() == "application/vnd.ekstep.content-collection" || utils.checkEnrolledCourse(item.identifier)) {

      if (JBridge.getKey("isPermissionSetWriteExternalStorage", "false") == "true") {
        var whatToSend = { course: itemDetails };
        var event = { tag: "OPEN_CourseEnrolledActivity_SEARCH", contents: whatToSend }
        window.__runDuiCallback(event);
      } else {
        utils.setPermissions();
      }
    } else {
      var headFooterTitle = item.contentType + (item.hasOwnProperty("size") ? " [" + utils.formatBytes(item.size) + "]" : "");
      var resDetails = {};
      resDetails['imageUrl'] = item.appIcon;
      resDetails['title'] = item.name;
      resDetails['description'] = item.description;
      resDetails['headFooterTitle'] = headFooterTitle;
      resDetails['identifier'] = item.identifier;
      resDetails['screenshots'] = item.screenshots || [];
      resDetails['content'] = item;

      var whatToSend = { resourceDetails: JSON.stringify(resDetails) }
      var event = { tag: "OPEN_ResourceDetailActivity_SEARCH", contents: whatToSend }
      window.__runDuiCallback(event);
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

  getContents = (content, index, searchText) => {
    return (
      <LinearLayout
        width= "match_parent"
        height="wrap_content"
        padding="16,16,16,16"
        margin = "0,0,0,0"
        onClick = {() => {this.handleItemClick(content, index, searchText)}}>

        <LinearLayout
          width= "wrap_content"
          height= "wrap_content"
          gravity= "center">

          <ImageView
            width = "37"
            height = "37"
            margin = "0,0,8,0"
            circularImageUrl={"0," + "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR1X3cm5xzR4D1W9oPb2QWioKlrfLVd0DvXFUNqSjZfg-M0bpc"} />
        </LinearLayout>

        <LinearLayout
          width = "0"
          weight = "1"
          height = "wrap_content"
          orientation = "vertical">

          <TextView
            width = "match_parent"
            height = "wrap_content"
            text={content.name}
            style={window.__TextStyle.textStyle.CARD.HEADING} />

          <LinearLayout
            width = "match_parent"
            height = "wrap_content"
            gravity = "center_vertical">

            <TextView
              width="wrap_content"
              height="wrap_content"
              text={content.contentType}
              style={window.__TextStyle.textStyle.HINT.SEMI}  />

            <ImageView
              width="10"
              height="10"
              margin="4,0,4,0"
              imageUrl="ic_dot_lightgrey" />

            <TextView
              width="wrap_content"
              height="wrap_content"
              text={content.hasOwnProperty("size") ? utils.formatBytes(content.size) : " "}
              style={window.__TextStyle.textStyle.HINT.SEMI} />
          </LinearLayout>

          <LinearLayout
            orientation="horizontal"
            padding="10,0,0,0">

            <TextView
              height="wrap_content"
              id={this.idSet.gradeTextView}
              width={content.gradeLevel && content.gradeLevel.length > 2 && content.subject ? halfWidth + "" : "wrap_content"}
              padding={content.subject ? "0,4,0,10" : "0,4,16,10"}
              gravity="left"
              enableEllipse="true"
              singleLine="true"
              scrollHorizontally="true"
              visibility={content.gradeLevel ? "visible" : "gone"}
              text={content.gradeLevel ? content.gradeLevel.toString().replace(/,/g, ", ") : ""}
              style={window.__TextStyle.textStyle.HINT.SEMI} />


            <ImageView
              width="10"
              height="10"
              visibility={content.gradeLevel && content.subject ? "visible" : "gone"}
              gravity="left"
              margin="4,7,0,0"
              imageUrl="ic_dot_lightgrey" />

            <TextView
              height="wrap_content"
              padding="4,3,16,10"
              gravity="left"
              width="wrap_content"
              enableEllipse="true"
              singleLine="true"
              visibility={content.subject ? "visible" : "gone"}
              text={content.subject ? content.subject.toString() : ""}
              style={window.__TextStyle.textStyle.HINT.SEMI} />
          </LinearLayout>
        </LinearLayout>
      </LinearLayout>
    );
  }

  getGroup = (collection, contents, index, searchText) => {
    let contentsList = [];
    console.log("creating grp for -> ", collection);
    
    collection.childNodes.map((item) => {
      var content = utils.findObjOnProp(contents, "identifier", item);
      if (content) {
        contentsList.push(content);
      }
    });
    let contentsLayout = contentsList.map((item, i) => {
      var dividerVisibility = (contents.length - 1 == i) ? "gone" : "visible";
      return (
        <LinearLayout
          width = "match_parent"
          height = "wrap_content"
          orientation="vertical">
          {this.getContents(item, i, searchText)}
          <LinearLayout
            width="match_parent"
            height="5"
            margin = "16,0,16,0"
            visibility={dividerVisibility} />
        </LinearLayout>
      );
    });
    return (
      <LinearLayout
        width = "match_parent"
        height = "wrap_content"
        orientation = "vertical">

        <LinearLayout
          width="match_parent"
          height="wrap_content"
          orientation="vertical"
          onClick={() => { this.handleItemClick(collection, index, searchText) }}> 

          <LinearLayout
            width="match_parent"
            height="wrap_content"
            margin="16,16,16,0">

            <TextView
              width="wrap_content"
              height="wrap_content"
              textSize = "14"
              text={"From "} />

            <TextView
              width="wrap_content"
              height="wrap_content"
              style={window.__TextStyle.textStyle.CARD.HEADING}
              text={collection.name} />
          </LinearLayout>
          <TextView
            width="match_parent"
            height="wrap_content"
            text={"View " + collection.contentType + " >"}
            style={window.__TextStyle.textStyle.TABBAR.SELECTED}
            margin = "16,0,16,0" />
        </LinearLayout>
        {contentsLayout}
        <LinearLayout
          height="5"
          width="match_parent"
          background="#f2f2f2" />
      </LinearLayout>
    );
  }

  renderEtbContent = (collection, contents, searchText) => {
    var groups = collection.map((item, i) => {
      return this.getGroup(item, contents, i, searchText);
    });
    let contentsLayout = contents.map((item, i) => {
      return this.getContents(item, i, searchText);
    });
    var layout = (<LinearLayout
      width="match_parent"
      height="wrap_content"
      root="true"
      background="#ffffff"
      orientation="vertical">
      {groups}
      <LinearLayout
        width = "match_parent"
        height = "wrap_content">
        {contentsLayout}
      </LinearLayout>
    </LinearLayout>)

    this.replaceChild(this.idSet.searchListContainer, layout.render(), 0);
    window.__LoaderDialog.hide();
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
        data={data}
        onClick={(item, index) => { this.handleItemClick(item, index, searchText)}} />
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
        console.log("callback data", JSON.parse(utils.decodeBase64(data[2])));
        if (data[0] == "error") {
          console.log("Error at callback", data[1]);
          window.__Snackbar.show("" + data[1])
          _this.renderNoResult();
          window.__LoaderDialog.hide();

        } else if (JSON.parse(utils.decodeBase64(data[2]))){ 
          console.log("inside collectiondata");
          var collection = JSON.parse(utils.decodeBase64(data[2]));
          _this.filterData = data[1];
          window.search = {};
          window.search.etb = collection;
          window.search.keywords = keywords;
          window.search.text = searchText;
          window.search.type = _this.searchType;
          data[0] = utils.decodeBase64(data[0]);
          var s = utils.formatJSON(data[0]);
          var contents = JSON.parse(s);
          console.log("contents -> ", contents);
          
          // _this.renderResult(JSON.parse(s), searchText);
          _this.renderEtbContent(collection, contents, searchText);
          window.__LoaderDialog.hide();

        } else {
          data[0] = utils.decodeBase64(data[0]);
          _this.filterData = data[1];
          if (searchText == "" || data[0] == "[]") {
            _this.renderNoResult();
            window.__LoaderDialog.hide();
          } else {
            _this.filterData = data[1];
            if (searchText == "" || data[0] == "[]") {
              _this.renderNoResult();
              window.__LoaderDialog.hide();

            } else {
              var s = utils.formatJSON(data[0]);
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

      // if (this.filterData != undefined && this.filterData.length == 0) {
      //   status = "false";
      // } else {
      //   status = "true";
      // }

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
