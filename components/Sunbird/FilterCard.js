var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var SimpleToolbar = require('../Sunbird/SimpleToolbar');
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var Space = require('@juspay/mystique-backend').androidViews.Space;

class FilterCard extends View {
  constructor(props, children) {
    super(props, children);
  }


  getFilterRows(data){
    var layout = data.map((item, index) => {

                    return (<LinearLayout
                            width="match_parent"
                            height="wrap_content"
                            margin="16,16,16,0"
                            padding="10,10,0,10"
                            gravity="center_vertical"
                            onClick={()=>{this.handleClick(index)}}
                            background={window.__Colors.WHITE_F4}>

                              <TextView
                              width="wrap_content"
                              height="wrap_content"
                              text={item}
                              style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>

                              <ViewWidget 
                              height = "1"
                              width = "0"
                              weight = "1"/>

                              <TextView
                              width="wrap_content"
                              height="wrap_content"
                              text="1 added"
                              style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>

                              <ImageView
                              width="24"
                              height="24"
                              imageUrl="ic_chevron_right"/>

                            </LinearLayout>)
    })

    return layout;

  }

  handleClick(index){
    this.props.handleClick(index);
  }


  render() {
    this.layout = (
              <LinearLayout
                height="400"
                width="match_parent"
                background={window.__Colors.WHITE}
                orientation="vertical">

                {this.getFilterRows(this.props.filterData)}
      
              </LinearLayout> 

    )
    return this.layout.render();
  }
}

module.exports = FilterCard;
