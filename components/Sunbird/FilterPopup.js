

const dom = require("@juspay/mystique-backend/src/doms/android");
const View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var FeatureButton = require("../../components/Sunbird/FeatureButton");
var RadioListItem = require('../Sunbird/RadioListItem');

var Styles = require("../../res/Styles");

let IconStyle = Styles.Params.IconStyle;

class FilterPopup extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "chooseItemContainer",
      "featureContainer",
      "parentContainer",
      "contentContainer"
    ]);
    this.chosenItem;
    this.selectedList = [];
    window.__FilterPopup = this;
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



  getFeatureButton = () => {
    return (<LinearLayout
                  width = "match_parent"
                  orientation="vertical"
                  height="0"
                  alignParentBottom="true,-1"
                  id={this.idSet.featureContainer}
                  padding = "3,3,3,3"
                  cornerRadius="5"
                  weight="20"
                  gravity = "center">
                  <FeatureButton
                    typeface = "bold"
                    clickable="true"
                    width = "match_parent"
                    height = "56"
                    stroke = {"3," + window.__Colors.WHITE}
                    background = {window.__Colors.PRIMARY_ACCENT}
                    text = {window.__S.CONFIRM}
                    buttonClick = {this.onConfirm}
                    textColor = {window.__Colors.WHITE}
                    textSize = "18"/>
                </LinearLayout>)


  }


  getList = () => {
    var lengthOfMenu = this.dataToChooseFrom.length;

    var leftItems = [];
    var rightItems = [];

    this.dataToChooseFrom.map((item, i) => {
      if (i % 2 == 0) {
        leftItems.push(item);
      } else {
        rightItems.push(item);
      }
    })

    console.log("DATA :", this.dataToChooseFrom)
    console.log("leftItems :", leftItems)
    console.log("rightItems :", rightItems)

    var leftBar = "";
    var rightBar = "";
    leftBar = leftItems.map((item, index) => {
      return (<RadioListItem
                  onItemClick={this.handleItemClick}
                  isSelected={item.apply}
                  title={item.name}
                  index={index}/>)
    });
    rightBar = rightItems.map((item, index) => {
      return (<RadioListItem
                  onItemClick={this.handleItemClick}
                  title={item.name}
                  isSelected={item.apply}
                  index={index}/>)
    });
    this.totalBar = (
      <LinearLayout
          orientation = "horizontal"
          width = "match_parent"
          root="true"
          height = "match_parent">
          <LinearLayout
            orientation = "vertical"
            width = "0"
            weight="1"
            height = "match_parent">
              {leftBar}
          </LinearLayout>
          <LinearLayout
            orientation = "vertical"
            width = "0"
            weight="1"
            height = "match_parent"
            margin = "0,0,0,0">
             {rightBar}
          </LinearLayout>
      </LinearLayout>
    )

    return this.totalBar;
  }



  getRadioList = () => {
    return (<LinearLayout
            width = "match_parent"
            height = "0"
            weight="70"
            margin = "0,0,0,0"
            padding = "0,0,10,10"
            orientation = "vertical">

             <ScrollView
              height="wrap_content"
              width="match_parent">

              {this.getList()}

              </ScrollView>

            </LinearLayout>)
  }

  getHeader = () => {
    return (
      <LinearLayout
      width="match_parent"
      height="0"
      weight="10"
      margin="0,0,16,0">

          <TextView
           width = "wrap_content"
           height = "wrap_content"
           text = {window.__S.CHOOSE_FROM_FOLLOWING}
           style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

      </LinearLayout>
    )
  }
  getSelectedCount = () => {
    var count = 0;
    this.dataToChooseFrom.map((item) => {
      if (item.apply == true)
        count++;
    })
    console.log(">>>>", count)
    return count;

  }

  checkStatus = (data) => {
    console.log("APPLY VALUE")
    if (data.apply == true) {
      return true;
    }
    return false;
  }


  handleItemClick = (title, checked) => {

    var newList = [];
    this.dataToChooseFrom.map((item) => {
      var tmpVar = item;
      if (tmpVar.name === title) {
        tmpVar.apply = checked
      }
      newList.push(tmpVar)
    })

    this.dataToChooseFrom = newList;


    this.replaceChild(this.idSet.featureContainer, this.getFeatureButton().render(), 0);


  }

  getBody = () => {
    return (<LinearLayout
              cornerRadius = "2"
              width = "match_parent"
              height = "450"
              root="true"
              orientation= "vertical"
              clickable = "true"
              padding="16,18,16,16"
              background="#ffffff">

             {this.getHeader()}

             {this.getRadioList()}

             {this.getFeatureButton()}

            </LinearLayout>)
  }

  setContent = (dataToChooseFrom, onSelection) => {


    this.propsOnConfirm = onSelection;
    this.dataToChooseFrom = dataToChooseFrom;

    this.replaceChild(this.idSet.contentContainer, this.getBody().render(), 0)



  }


  onConfirm = () => {
    if (this.propsOnConfirm != undefined) {
      console.log("CALL PARENT FUNCTION")
      this.propsOnConfirm(this.dataToChooseFrom);
    } else {
      this.props.onConfirm(this.dataToChooseFrom);
    }
  }

  handleDismissClick = () => {
    this.hide();
  }


  render() {

    this.layout = (
      <LinearLayout
        height = "match_parent"
        width = "match_parent"
        id={this.idSet.parentContainer}
        visibility="gone"
        root="true"
        background = { window.__Colors.PRIMARY_BLACK_44}
        orientation="vertical">
          <LinearLayout
            height="0"
            width="match_parent"
            onClick={this.handleDismissClick}
            weight="1"/>

          <LinearLayout
            height="450"
            width="match_parent"
            orientation="vertical"
            root="true"
            id={this.idSet.contentContainer}/>
      </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = FilterPopup;
