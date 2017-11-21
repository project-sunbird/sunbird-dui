const dom = require("@juspay/mystique-backend/src/doms/android");
const View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");

var Space = require("@juspay/mystique-backend/src/android_views/Space");
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var FeatureButton = require("../../components/Sunbird/FeatureButton");
var PageFilterChooser = require('../Sunbird/PageFilterChooser');
var PageOption = require("../../components/Sunbird/core/PageOption")

var FilterItem = require('../Sunbird/FilterItem')

var Styles = require("../../res/Styles");
var FilterParamsCource = require("../../FilterParamsCource")
var FilterParamsResource = require("../../FilterParamsResource")
var utils = require("../../src/Utils")

let IconStyle = Styles.Params.IconStyle;

class PageFilterPopup extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "chooseItemContainer",
      "featureContainer",
      "parentContainer",
      "contentContainer",
      "cancelBtn",
      "applyBtn"
    ]);


    window.__PageFilterPopup = this;
    this.filterListCource=FilterParamsCource.filterParamsCource;
    this.filterListResource=FilterParamsResource.filterParamsResource;
    this.isForResouce=false;
    this.cancelBtnState = {
      text : window.__S.CANCEL,
      id : this.idSet.cancelBtn,
      isClickable : "true",
      onClick : this.hide,
      visibility : "visible",
    };
    this.applyBtnState = {
      text : window.__S.APPLY,
      id : this.idSet.applyBtn,
      isClickable : "true",
      onClick : this.onConfirm,
      visibility : "visible",
    };

  }


  show = () => {
    this.visible=true;
    this.setVisibility("visible");
  }

  hide = () => {
    this.visible=false;
    this.setVisibility("gone");
    if(this.isForResouce){
      JBridge.logPageFilterClickEvent("RESOURCES");
    }else{
      JBridge.logPageFilterClickEvent("COURSES");
    }
  }

  getVisibility = () => {
    return this.visible;
  }

  setVisibility = (data) => {
    var cmd = this.set({
      id: this.idSet.parentContainer,
      visibility: data
    })

    Android.runInUI(cmd, 0)
  }


  setValues = (item,values) => {
    this.filter[item]=values;
  }




  getFilterList = () => {
    var listToUse;

    if(this.isForResouce){
      listToUse = this.filterListResource
      JBridge.logPageFilterScreenEvent("RESOURCES");
    }else{
      listToUse = this.filterListCource
      JBridge.logPageFilterScreenEvent("COURSES");
    }

    listToUse.map((item)=>{

      item.selected=this.filter[item.name];
    });

    console.log(listToUse,"listToUse" );

    var listItem=listToUse.map((item,index)=>{
      return (
                  <FilterItem
                    height="match_parent"
                    width="match_parent"
                    gravity="center_vertical"
                    background="#000000"
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
           text = {window.__S.AVAILABLE_FILTERS}
           style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

      </LinearLayout>
    )
  }

  getOptions = () => {
    var buttonList = [this.cancelBtnState, this.applyBtnState];
    return (<LinearLayout
          height="wrap_content"
          width="match_parent"
          alignParentBottom = "true, -1">
          <PageOption
            width="match_parent"
            buttonItems={buttonList}
            hideDivider={false}
            onButtonClick={this.handlePageOption}/>
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

  resetPopup = (isFor,response) => {
    if(isFor=="Cource"){
      this.isForResouce=false;
    }else{
      this.isForResouce=true;
    }

    this.filter={};
    if(response!=undefined && response.hasOwnProperty("filter_to_send") && response.filter_to_send!=null)
      {
        this.filter=JSON.parse(response.filter_to_send);
        console.log("fiter to send reached",this.filter);

      }

    //     window.__PageFilterChooser.handleItemClick(item,false);

    this.replaceChild(this.idSet.contentContainer, this.getBody().render(), 0)


  }

  isEmpty = (obj) => {
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          return false;
        }
    }
    return true;
  }

  onConfirm = () => {

    if(this.isEmpty(this.filter)){
      window.__Snackbar.show(window.__S.NO_FILTERS_SELECTED);
      this.hide();
      return;
    }
    this.hide();

    if (JBridge.isChannelIdSet() == true){
      this.filter.channel = utils.getChannelId();
    }
    var sendFilter=JSON.stringify(this.filter);

    console.log("sendFilter : ", sendFilter);

    var whatToSend = {"user_token":window.__user_accessToken,"api_token": window.__apiToken,"filter_to_send":sendFilter}
    var event = { "tag": "API_FilterPage", contents: whatToSend};

    if(JBridge.isNetworkAvailable())
      window.__runDuiCallback(event);
    else
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE)

  }

  handleDismissClick = () => {
    console.log("is resource",this.isForResouce)
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
