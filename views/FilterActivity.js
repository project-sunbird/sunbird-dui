var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");

var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");

var Space = require("@juspay/mystique-backend/src/android_views/Space");

var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var FilterCard = require('../components/Sunbird/FilterCard');
var DoubleRadioList = require('../components/Sunbird/DoubleRadioList');
var FilterPopup = require('../components/Sunbird/FilterPopup');
var PageOption = require('../components/Sunbird/core/PageOption');

var _this;

class FilterActivity extends View {
  constructor(props, children,state) {
    super(props, children,state);

    _this=this;

    this.screenName = "FilterActivity";
    this.shouldCacheScreen = false;

    this.tempData = JSON.parse(state.data.value0.filterDetails);
    this.searchedFor = this.tempData.filterFor;
    this.searchedType = this.tempData.filterType;
    this.data = JSON.parse(this.tempData.filterDetails);
    this.facetData = this.data.facetFilters;
    this.filterData  = [];

    for(let i in this.facetData){
      if(this.facetData[i].values){
        if(this.facetData[i].values.length != 0){
          this.filterData.push(this.facetData[i]);
        }
      }
    }


  }


  handleFilterChange = (newData) => {
    this.filterData = newData;
  }


  getSortCard = () => {
    return (<LinearLayout
                    height="wrap_content"
                    width="match_parent"
                    padding="0,16,0,25"
                    background={window.__Colors.WHITE}
                    orientation="vertical">

                      <LinearLayout
                        width="match_parent"
                        height="wrap_content">

                          <ImageView
                          width="26"
                          height="21"
                          weight="1"
                          imageUrl="ic_star_ratings_blue"/>

                          <ImageView
                          width="32"
                          height="27"
                          weight="1"
                          imageUrl="ic_action_done"/>

                          <ImageView
                          width="26"
                          height="25"
                          weight="1"
                          imageUrl="ic_action_calendar"/>
                      </LinearLayout>

                      <LinearLayout
                        width="match_parent"
                        height="wrap_content"
                        gravity="center_horizontal"
                        margin="0,10,0,0">

                          <TextView
                          width="match_parent"
                          height="wrap_content"
                          text={window.__S.STAR_RATINGS}
                          gravity="center_horizontal"
                          style={window.__TextStyle.textStyle.FILTER.REGULAR_BLUE}
                          weight="1"/>

                          <TextView
                          width="match_parent"
                          height="wrap_content"
                          text={window.__S.NUMBER_OF_VOTES}
                          gravity="center_horizontal"
                          style={window.__TextStyle.textStyle.FILTER.REGULAR_BLACK}
                          weight="1"/>

                          <TextView
                          width="match_parent"
                          height="wrap_content"
                          text = {window.__S.PUBLISHED_DATE}
                          gravity="center_horizontal"
                          style={window.__TextStyle.textStyle.FILTER.REGULAR_BLACK}
                          weight="1"/>

                      </LinearLayout>
                  </LinearLayout>)
  }


  onBackPressed = () => {
    var data= {
      filterDetails : this.data,
      filterFor : this.searchedFor,
      searcheType : this.searchedType
    }
    console.log("data in filter to search",data)
    var whatToSend = {
        "filterData" : JSON.stringify(data)
      };
    window.__runDuiCallback({ "tag": "OPEN_SearchActivity_FILTER", contents: whatToSend });
  }
  handleFilterClick = () =>{
    var data= {
      filterDetails : this.data,
      filterFor : this.searchedFor,
      searchType : this.searchedType
    }
    console.log("data in filter to search",data)
    var whatToSend = {
        "filterData" : JSON.stringify(data)
      };
    if(JBridge.isNetworkAvailable())
      window.__runDuiCallback({ "tag": "OPEN_SearchActivity_FILTER", contents: whatToSend });
    else
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE)
  }


  render() {
    var btn = {
      text : window.__S.APPLY_FILTER,
      onClick : this.handleFilterClick
    }
    var buttonList = [btn];
    this.layout = (
      <RelativeLayout
      root="true"
      width="match_parent"
      clickable="true"
      root="true"
      height="match_parent">

      <LinearLayout
      root="true"
      width="match_parent"
      height="match_parent">


      <LinearLayout
        background={window.__Colors.WHITE}
        orientation="vertical"
        width="match_parent"
        height="match_parent">

        <SimpleToolbar
          title={window.__S.FILTER}
          onBackPress={this.onBackPressed}
          width="match_parent"/>

            <ScrollView
              height="0"
              weight="1"
              width="match_parent"
              fillViewPort="true">

                <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  gravity="center_vertical"
                  orientation="vertical"
                  padding="0,0,0,80">

                  <LinearLayout
                  width="match_parent"
                  height="wrap_content"
                  visibility="gone"
                  orientation="vertical">

                      <TextView
                      width="match_parent"
                      height="28"
                      padding="16,12,16,8"
                      gravity="center_vertical"
                      style={window.__TextStyle.textStyle.FILTER.REGULAR_BLACK}
                      background={window.__Colors.WHITE_F7}
                      text={window.__S.SORT_BY}/>

                      {this.getSortCard()}

                  </LinearLayout>


                      <TextView
                      width="match_parent"
                      gravity="center_vertical"
                      padding="16,8,16,8"
                      style={window.__TextStyle.textStyle.FILTER.REGULAR_BLACK}
                      background={window.__Colors.WHITE_F7}
                      text={window.__S.FILTER_BY}/>

                      <FilterCard
                      filterData={this.filterData}
                      onItemClick={this.showPopup}
                      onFilterUpdate={this.handleFilterChange}/>


               </LinearLayout>
            </ScrollView>


          <PageOption
             width="match_parent"
             buttonItems={buttonList}/>

      </LinearLayout>

      </LinearLayout>

      <FilterPopup
        height="match_parent"
        width="match_parent"/>


      </RelativeLayout>

    )
    return this.layout.render();
  }
}

module.exports = Connector(FilterActivity);
