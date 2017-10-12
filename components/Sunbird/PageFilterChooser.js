const dom = require("@juspay/mystique-backend/src/doms/android");
const View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var CheckBox = require("@juspay/mystique-backend/src/android_views/CheckBox");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var FeatureButton = require("../../components/Sunbird/FeatureButton");

var Styles = require("../../res/Styles");

let IconStyle = Styles.Params.IconStyle;

class PageFilterChooser extends View {
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
    window.__PageFilterChooser = this;
  }


  show = () => {
    this.visible=true;
    this.setVisibility("visible");
  }

  getVisibility = () => {
    return this.visible;
  }

  hide = () => {
    this.visible=false;
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
              id={this.idSet.featureContainer}
              width = "match_parent"
              height="0"
              orientation="vertical"
              alignParentBottom="true,-1"
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
                text = {window.__S.SELECT}
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


    var leftBar = "";
    var rightBar = "";
    leftBar = leftItems.map((item, index) => {
      return (<CheckBox
                  onCheckChange={(value)=>{this.handleItemClick(item,value)}}
                  checked={this.checkStatus(item)}
                  text={item}
                  index={index}/>)
    });
    rightBar = rightItems.map((item, index) => {
      return (<CheckBox
                  onCheckChange={(value)=>{this.handleItemClick(item,value)}}
                  text={item}
                  checked={this.checkStatus(item)}
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

  checkStatus = (data) => {
   
    if (this.selectedList.indexOf(data) > -1) {
      return true;
    }
    return false;
  }



  handleItemClick = (title,checked) => {
    if(checked=="true"){
      var newList=[];
      this.selectedList.map((item)=>{
        if(title!=item)
          newList.push(item)
      })
      newList.push(title)
      this.selectedList=newList;

    }else{
      var newList=[];
      this.selectedList.map((item)=>{
        if(title!=item)
          newList.push(item)
      })
      this.selectedList=newList;
    }
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

  setContent = (dataToChooseFrom, onSelection,prevList) => {


    this.propsOnConfirm = onSelection;
    this.dataToChooseFrom = dataToChooseFrom;

    if(prevList){
      this.selectedList=prevList;
    }else{
      this.selectedList=[]
    }

    this.replaceChild(this.idSet.contentContainer, this.getBody().render(), 0)



  }


  onConfirm = () => {
    if (this.propsOnConfirm != undefined) {
      this.propsOnConfirm(this.selectedList);
      this.hide();
    } else {
        this.hide();
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

module.exports = PageFilterChooser;
