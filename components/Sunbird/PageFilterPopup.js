const dom = require("@juspay/mystique-backend").doms.android;
const View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;

var Space = require("@juspay/mystique-backend").androidViews.Space;
var ViewWidget = require('@juspay/mystique-backend').androidViews.ViewWidget;
var FeatureButton = require('../../components/Sunbird/FeatureButton');
var PageFilterChooser = require('../Sunbird/PageFilterChooser');

var FilterItem = require('../Sunbird/FilterItem')

var Styles = require("../../res/Styles");
var FilterParams = require("../../FilterParams")
let IconStyle = Styles.Params.IconStyle;

class PageFilterPopup extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "chooseItemContainer",
      "featureContainer",
      "parentContainer",
      "contentContainer"
    ]);


    window.__PageFilterPopup = this;
    this.filterList=FilterParams.filterParams;

  }


  show = () => {
    this.setVisibility("visible");
  }

  hide = () => {
    this.setVisibility("gone");
  }

  setVisibility = (data) => {
    var cmd = this.set({
      id: this.idSet.parentContainer,
      visibility: data
    })

    Android.runInUI(cmd, 0)
  }



  getFeatureButton = (text,invert,action) => {
    return (<LinearLayout
                  width = "0"
                  weight="1"
                  orientation="vertical"
                  height="52"
                  padding = "3,3,3,0"
                  cornerRadius="5"
                  gravity = "center">
                  <FeatureButton
                    typeface = "bold"
                    clickable="true"
                    width = "match_parent"
                    height = "46"
                    stroke = {"3," + (invert?window.__Colors.PRIMARY_ACCENT:window.__Colors.WHITE)}
                    background = {invert?window.__Colors.WHITE:window.__Colors.PRIMARY_ACCENT}
                    text = {text}
                    buttonClick = {action}
                    textColor = {invert?window.__Colors.PRIMARY_ACCENT:window.__Colors.WHITE}
                    textSize = "18"/>
                </LinearLayout>)


  }

 

  setValues = (item,values) => {
    console.log("SELECTED ",values);
    console.log("FOR ->",item);

    this.filter[item]=values;
    console.log("MODIFIED ",this.filter)
  }

  


  getFilterList = () => {

    var listItem=this.filterList.map((item,index)=>{
      return (

                  <FilterItem
                    height="match_parent"
                    width="match_parent"
                    gravity="center_vertical"
                    data={item}
                    onUpdate={this.setValues}
                    forPage={true}/>


              )
    });

    

     return (
      <ScrollView
        height="0"
        weight="1"
        width="match_parent"
        fillViewPort="true">
            <LinearLayout
              height="wrap_content"
              width="match_parent"
              orientation="vertical"
              padding="0,10,0,60">

                {listItem}

              </LinearLayout>
        </ScrollView>)

  }


  

  getHeader = () => {
    return (
      <LinearLayout
      width="match_parent"
      height="wrap_content"
      margin="16,0,16,0">

          <TextView
           width = "match_parent"
           height = "wrap_content"
           text = "Available filters"
           style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

      </LinearLayout>
    )
  }

  getOptions = () => {
    return (<LinearLayout
          height="wrap_content"
          width="match_parent"
          padding="16,0,16,0">

            {this.getFeatureButton("DISMISS",true,this.hide)}

            {this.getFeatureButton("APPLY",false,this.onConfirm)}


          </LinearLayout>)
  }

  
  getBody = () => {
    return (<LinearLayout
              cornerRadius = "2"
              width = "match_parent"
              height = "450"
              root="true"
              orientation= "vertical"
              clickable = "true"
              padding="0,18,0,6"
              background="#ffffff">
              
             {this.getHeader()}

             {this.getFilterList()}

             {this.getOptions()}

            </LinearLayout>)
  }

  resetPopup = () => {
    this.filter={};
    this.replaceChild(this.idSet.contentContainer, this.getBody().render(), 0)
  }


  onConfirm = () => {
    // if (this.propsOnConfirm != undefined) {
    //   console.log("CALL PARENT FUNCTION")
    //   this.propsOnConfirm(this.dataToChooseFrom);
    // } else {
    //   this.props.onConfirm(this.dataToChooseFrom);
    // }
  }

  handleDismissClick = () => {
    this.hide();
  }


  render() {

    this.layout = (
      <RelativeLayout
        height = "match_parent"
        width = "match_parent"
        id={this.idSet.parentContainer}
        visibility="gone"
        root="true"
        background = { window.__Colors.PRIMARY_BLACK_44}>
          <LinearLayout 
            height = "match_parent"
            width = "match_parent"
            background = { window.__Colors.PRIMARY_BLACK_44}
            orientation="vertical">
              <LinearLayout
                height="0"
                width="match_parent"
                onClick={this.handleDismissClick}
                weight="1"/>

              <LinearLayout
                height="wrap_content"
                width="match_parent"
                orientation="vertical"
                root="true"
                id={this.idSet.contentContainer}/>
          </LinearLayout>
          <PageFilterChooser/>
      </RelativeLayout>

    )

    return this.layout.render();
  }
}

module.exports = PageFilterPopup;
