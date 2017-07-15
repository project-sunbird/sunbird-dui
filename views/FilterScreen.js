var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var FilterCard = require('../components/Sunbird/FilterCard');
var DoubleRadioList = require('../components/Sunbird/DoubleRadioList');
var FilterPopup = require('../components/Sunbird/FilterPopup');
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var PageOption = require('../components/Sunbird/core/PageOption');
var Space = require('@juspay/mystique-backend').androidViews.Space;
var _this;

const filterParams = require('../FilterParams');


class FilterScreen extends View {
  constructor(props, children,state) {
    super(props, children,state);

    this.tempData = JSON.parse(state.data.value0.filterDetails);
    this.data = JSON.parse(this.tempData.filterDetails);
    this.facetData = this.data.facetFilters;
    this.screenName = "FilterScreen";
    this.shouldCacheScreen = false;
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
                          text="Star ratings"
                          gravity="center_horizontal"
                          style={window.__TextStyle.textStyle.FILTER.REGULAR_BLUE}
                          weight="1"/>
                        
                          <TextView
                          width="match_parent"
                          height="wrap_content"
                          text="Number of votes"
                          gravity="center_horizontal"
                          style={window.__TextStyle.textStyle.FILTER.REGULAR_BLACK}
                          weight="1"/>
                          
                          <TextView
                          width="match_parent"
                          height="wrap_content"
                          text = "Published date"
                          gravity="center_horizontal"
                          style={window.__TextStyle.textStyle.FILTER.REGULAR_BLACK}
                          weight="1"/>

                      </LinearLayout>
                  </LinearLayout>)
  }


  onBackPressed = () => {
    var searchDetails = {filterDetails: JSON.stringify(this.data),searchType: this.tempData.filterType}
    window.__runDuiCallback( {filterData:JSON.stringify(searchDetails)} );

  }
  handleFilterClick = () =>{
    var searchDetails = {filterDetails: JSON.stringify(this.data),searchType: this.tempData.filterType}
    window.__runDuiCallback( {filterData:JSON.stringify(searchDetails)} );    
  }


  render() {
    var buttonList = ["APPLY FILTER"];
    this.layout = (
      <RelativeLayout
      root="true"
      width="match_parent"
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
          title="Filter"
          onBackPress={this.onBackPressed}
          invert="true"
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
                      <TextView
                      width="match_parent"
                      height="28"
                      padding="16,12,16,8"
                      gravity="center_vertical"
                      style={window.__TextStyle.textStyle.FILTER.REGULAR_BLACK}
                      background={window.__Colors.WHITE_F7}
                      text="SORT BY"/>

                      {this.getSortCard()}
                      
                        
                      <TextView
                      width="match_parent"
                      height="28"
                      gravity="center_vertical"
                      padding="16,8,16,8"
                      style={window.__TextStyle.textStyle.FILTER.REGULAR_BLACK}
                      background={window.__Colors.WHITE_F7}
                      text="FILTER BY"/>

                      <FilterCard
                      filterData={this.filterData}
                      onItemClick={this.showPopup}
                      onFilterUpdate={this.handleFilterChange}/>

                    
               </LinearLayout>
            </ScrollView>


          <PageOption
             width="match_parent"
             buttonItems={buttonList}
             onButtonClick={this.handleFilterClick}/>

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

module.exports = Connector(FilterScreen);
