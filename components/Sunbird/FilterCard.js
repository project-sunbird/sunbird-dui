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
const filterParams = require('../../FilterParams');

var _this;

class FilterCard extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      'filterCount',
      'rowsContainer'
    ]);
    _this=this;
    this.params = filterParams;
   
   this.EaseOut = transitParams.animParams.EaseOut;

  }

  getFilterRows(data){
    var layout = data.map((item, index) => {

                  var data = filterParams.params.map((elem, i) => { if(elem.type == item.toLowerCase()) return elem });
                    return (<FilterItem
                            data = {data[index]}/>)   

                  })

      return   (
                <LinearLayout
                  width="match_parent"
                  height="wrap_content"
                  orientation="vertical"
                  gravity="center_vertical">

                    {layout}

                </LinearLayout>)

  }




  afterRender = () =>{

    var layout = _this.getFilterRows(_this.props.filterData);

    this.replaceChild(this.idSet.rowsContainer, layout.render(), 0);

  }



  render() {
    this.layout = (
              <LinearLayout
                height="wrap_content"
                width="match_parent"
                afterRender={this.afterRender}
                background={window.__Colors.WHITE}
                orientation="vertical">

                <ScrollView
                width="match_parent"
                height="match_parent">

              
                <LinearLayout
                  width="match_parent"
                  height="wrap_content"
                  id={this.idSet.rowsContainer}
                  gravity="center_vertical"/>


                </ScrollView>

      
              </LinearLayout> 

    )
    return this.layout.render();
  }
}

module.exports = FilterCard;
