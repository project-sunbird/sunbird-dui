var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var Button = require('../Sunbird/Button');
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var _this;
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var CardComponent = require('../Sunbird/core/CardComponent');
var utils = require('../../utils/GenericFunctions');



class OfflineResourceContainer extends View {
  constructor(props, children) {
    super(props, children);
    _this = this;

    this.setIds(["viewAllContainer"]);
    this.offlineCount=0;
  }


  afterRender = () => {
     var cmd = this.set({
        id: this.idSet.viewAllContainer,
        visibility : (this.offlineCount==0?"gone":"visible")
      })

    Android.runInUI(cmd, 0);

  }



  getRows = () => {

    if (this.props.data == undefined || this.props.data.length == 0){
      this.jsData = []

    }else {
      this.jsData = this.props.data;
    }



    var rows = this.jsData.map((item, i) => {


      if (item.contentType != "course") {

        console.log("item in offline container",item)
        this.offlineCount++;
        var size = item.hasOwnProperty("size") ? " [" + utils.formatBytes(item.size) + "]" : "";
        var footerTitle = item.contentType + size;
        var temp = {};
        var fileSavedTime = utils.prettifyDate(item.lastUpdatedTime);
        var fileImageUrl = item.contentData.hasOwnProperty("appIcon")?("file://"+item.basePath+"/"+item.contentData.appIcon):"ic_action_resource";

        temp['imageUrl'] = fileImageUrl;
        temp['title'] = item.contentData.name;
        temp['footerTitle'] = footerTitle;
        temp['screenshots'] = item.screenshots || [] ;
        temp['footerSubTitle'] = window.__S.SAVED_ON + " " + fileSavedTime;
        temp['actionText'] = window.__S.OPEN;
        temp['content'] = item;





        return (<CardComponent
                     data={temp}
                     content={item}
                     index = {i}
                     onCardClick = {this.handleCardClick}/>)
      } else {
        return (<LinearLayout
              width="0"
              height="0">


              </LinearLayout>)
      }
    });

    if(this.offlineCount==0){
      rows =( <TextView
              width="match_parent"
              height="50"
              gravity="center"
              text={window.__S.ERROR_NO_OFFLINE_RESOURCE}
              style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>)
    }

    var layout = (<LinearLayout
                    margin="0,0,16,0"
                    width="match_parent"
                    height="wrap_content">

                    {rows}

                  </LinearLayout>);
    return layout;

  }



  getHeader() {
    return (<LinearLayout
              width="match_parent"
              height="wrap_content"
              margin="16,16,16,16"
              orientation="horizontal">

              <TextView
                width="wrap_content"
                height="wrap_content"
                text={this.props.title}
                style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

              <ViewWidget
                weight="1"
                height="0"/>

              <TextView
                width="wrap_content"
                height="wrap_content"
                text={window.__S.VIEW_ALL}
                id={this.idSet.viewAllContainer}
                padding="8,8,8,8"
                onClick={this.handleViewAllClick}
                style={window.__TextStyle.textStyle.TABBAR.SELECTED}/>

            </LinearLayout>)
  }


  handleCourseClick = (courseName) => {
    this.props.onCourseOpenClick(courseName);
  }

  handleCardClick = (item, type, index) => {
    console.log(index)
     JBridge.logCardClickEvent("RESOURCES",index+1,"SAVED_RESOURCES",item.identifier)
     if(item.contentType.toLowerCase() == "course" || item.contentType.toLowerCase() == "collection" || item.contentType.toLowerCase() == "textbook"){
      var whatToSend= {course:JSON.stringify(item)};
      var event ={tag:"OPEN_CourseInfoActivity",contents:whatToSend}
      window.__runDuiCallback(event);
    }
    else
    {
      var headFooterTitle = item.contentType + (item.hasOwnProperty("size") ? " ["+utils.formatBytes(item.size)+"]" : "");
      var resDetails = {};

      resDetails['imageUrl'] = "file://"+item.basePath+"/"+item.contentData.appIcon;
      resDetails['title'] = item.contentData.name;
      resDetails['description'] = item.contentData.description;
      resDetails['headFooterTitle'] = headFooterTitle;
      resDetails['identifier'] = item.identifier;
      resDetails['screenshots'] = item.screenshots || [] ;
      resDetails['content'] = item;


      var whatToSend= {resourceDetails:JSON.stringify(resDetails)}
      var event ={tag:"OPEN_ResourceDetailActivity",contents:whatToSend}
      window.__runDuiCallback(event);
    }

  }

  handleViewAllClick() {
    JBridge.logViewAllClickEvent("RESOURCES",_this.props.title);
    _this.props.onViewAllClick(_this.props.data,_this.props.title,"","gone");
  }

  render() {
    this.layout = (
      <LinearLayout
          height="match_parent"
          width="match_parent"
          afterRender={this.afterRender}
          orientation="vertical">

          {this.getHeader()}

          <HorizontalScrollView
           width = "match_parent"
           height = "wrap_content"
           scrollBarX="false"
           fillViewport="true">

              <LinearLayout
                width="match_parent"
                height="wrap_content">

                 {this.getRows()}

              </LinearLayout>



          </HorizontalScrollView>

         </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = OfflineResourceContainer;
