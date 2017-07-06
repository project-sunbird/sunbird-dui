var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var SimpleToolbar = require('../Sunbird/core/SimpleToolbar');
var ChooseItem = require('../Sunbird/ChooseItem');
var FilterItem = require('../Sunbird/FilterItem');
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var Space = require('@juspay/mystique-backend').androidViews.Space;
const transitParams = require('../../transitions');

var _this;

class FilterCard extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      'filterCount',
      'rowsContainer'
    ]);
    _this = this;
    this.listOfFilters = this.props.filterData;
    this.EaseOut = transitParams.animParams.EaseOut;

  }

  handleUpdate = (newList) => {
    var newList = [];
    this.listOfFilters.map((item) => {
      var tmpVar = item;
      if (tmpVar.name === newList.name) {
        tmpVar = newList
      }
      newList.push(tmpVar)
    })
    this.updateFilterList = newList;
    this.props.onFilterUpdate(this.updateFilterList)
  }

  getFilterRows = () => {
    var layout = this.listOfFilters.map((item, index) => {


      return (<FilterItem
                  data = {item}
                  onUpdate={this.handleUpdate}/>)

    })

    return (
      <LinearLayout
                  width="match_parent"
                  height="wrap_content"
                  orientation="vertical"
                  gravity="center_vertical">

                    {layout}

                </LinearLayout>)

  }


  render() {
    this.layout = (
      <LinearLayout
                height="wrap_content"
                width="match_parent"
                background={window.__Colors.WHITE}
                orientation="vertical">

                <ScrollView
                width="match_parent"
                height="match_parent">

              
                <LinearLayout
                  width="match_parent"
                  height="wrap_content"
                  id={this.idSet.rowsContainer}
                  gravity="center_vertical">


                    {this.getFilterRows()}
                
                </LinearLayout>  


                </ScrollView>

      
              </LinearLayout>

    )
    return this.layout.render();
  }
}

module.exports = FilterCard;
