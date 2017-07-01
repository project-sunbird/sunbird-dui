var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var SimpleToolbar = require('../Sunbird/core/SimpleToolbar');
var ChooseItem = require('../Sunbird/ChooseItem');
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var Space = require('@juspay/mystique-backend').androidViews.Space;
const transitParams = require('../../transitions');

var _this;
class FilterCard extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      'filterCount'
    ]);
    _this=this;
   
  this.EaseOut = transitParams.animParams.EaseOut;

  }


  getFilterRows(data){
    var layout = data.map((item, index) => {

                    return (
                          <LinearLayout
                            width="match_parent"
                            height="wrap_content"
                            margin="16,16,16,0"
                            gravity="center_vertical"
                            onClick={()=>{this.handleClick(index)}}>
                          
                           <LinearLayout
                            width="match_parent"
                            height="match_parent"
                            padding="10,10,0,10"
                            gravity="center_vertical"
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
                              id={this.idSet.filterCount}
                              style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>

                              <ImageView
                              width="24"
                              height="24"
                              imageUrl="ic_chevron_right"/>

                            </LinearLayout>
                          </LinearLayout>
                            )
    })

    return layout;

  }

  handleClick(index){
   this.showFilterDialog();
  }

  handleSelection(index){
    console.log("selected"+index);

    let cmd = _this.set({
    id: _this.idSet.filterCount,
      text:"1 added"
    });

  Android.runInUI(cmd,null);

  }

  showFilterDialog = () =>{

    this.listData ={
              confirmText:"SUBMIT",
              items: ["class I",
                      "class II",
                      "class III",
                      "class IV",
                      "class V",
                      "class VI",
                      "class VII",
                      "class VIII",
                      "class IX",
                      "class X" ],
              heading: "Please choose the Standard"
            }

    var layout = ( <LinearLayout
                    width="match_parent"
                    height="wrap_content"
                    visibility="visible"
                    alignParentBottom = "true,-1"
                    weight="1"
                    orientation="vertical"
                    background={window.__Colors.WHITE}
                    >

                    <ChooseItem
                    data={this.listData}
                    onSelect={this.handleSelection}
                    />

                  </LinearLayout>);
    window.__RootScreen.showFilterDialog(layout,this.EaseOut);
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
