var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var Button = require('../Sunbird/Button');
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var _this;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var CardComponent = require('../Sunbird/core/CardComponent');
var utils = require('../../utils/GenericFunctions');



class OfflineResourceContainer extends View {
  constructor(props, children) {
    super(props, children);
    _this = this;

    this.setIds([]);

  }


  afterRender = () => {}



  getRows = () => {
    console.log("OFFLINE CONTENT", this.props.data);
    if (this.props.data == undefined || this.props.data.length == 0)
      this.jsData = []
    else {
      this.jsData = this.props.data;
    }

    console.log("OFFLINE CONTENT", this.jsData);

    var rows = this.jsData.map((item, i) => {

      console.log("item content type", item.contentType);
      if (item.contentType != "course") {

        var size = item.hasOwnProperty("size") ? " [" + utils.formatBytes(item.size) + "]" : "";
        var footerTitle = item.contentType + size;
        var temp = {};
        var fileSavedTime = utils.prettifyDate(item.lastUpdatedTime);
        var fileImageUrl = "file://" + item.basePath + "/" + item.contentData.appIcon;

        temp['imageUrl'] = fileImageUrl;
        temp['title'] = item.contentData.name;
        temp['footerTitle'] = footerTitle;
        temp['footerSubTitle'] = "Saved on " + fileSavedTime;
        temp['actionText'] = "OPEN";
        temp['content'] = item;

        return (<CardComponent 
                     data={temp}
                     content={item}
                     onCardClick = {this.handleCardClick}/>)
      } else {
        return (<LinearLayout
              width="0"
              height="0"/>)
      }
    });

    var layout = (<LinearLayout
                    margin="0,0,16,0"
                    width="wrap_content"
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
            text="VIEW ALL"
            padding="8,8,8,8"
            onClick={this.handleViewAllClick}
            style={window.__TextStyle.textStyle.TABBAR.SELECTED}/>

            </LinearLayout>)
  }


  handleCourseClick = (courseName) => {
    this.props.onCourseOpenClick(courseName);
  }

  handleCardClick = (item, type) => {

    // var headFooterTitle = item.contentType + (item.hasOwnProperty("size") ? " [" + utils.formatBytes(item.size) + "]" : "");
    // var fileImageUrl = "file://" + item.basePath + "/" + item.contentData.appIcon;
    // var resDetails = {};
    // resDetails['imageUrl'] = fileImageUrl;
    // resDetails['title'] = item.contentData.name;
    // resDetails['description'] = item.contentData.description;
    // resDetails['headFooterTitle'] = headFooterTitle;
    // resDetails['identifier'] = item.identifier;
    // resDetails['content'] = item;

    // window.__runDuiCallback({ tag: "StartResourceDetailFlow", contents: { resourceDetails: JSON.stringify(resDetails) } });
     console.log("item",item)
     
     if(item.contentType.toLowerCase() == "course" || item.contentType.toLowerCase() == "collection" || item.contentType.toLowerCase() == "textbook"){
      
      window.__runDuiCallback({tag:"ResourceCourseInfoFlow",contents:{course:JSON.stringify(item)}});
    }
    else
    {
      var headFooterTitle = item.contentType + (item.hasOwnProperty("size") ? " ["+utils.formatBytes(item.size)+"]" : "");      
      var resDetails = {};
      resDetails['imageUrl'] = item.appIcon;
      resDetails['title'] = item.name;
      resDetails['description'] = item.description;
      resDetails['headFooterTitle'] = headFooterTitle;
      resDetails['identifier'] = item.identifier;
      resDetails['content'] = item;
      window.__runDuiCallback({tag:"StartResourceDetailFlow",contents:{resourceDetails:JSON.stringify(resDetails)}}); 
    }

  }

  handleViewAllClick() {
    
    console.log("OFFLINE RESOURCE CONTAINER",_this.props.data)
    _this.props.onViewAllClick(_this.props.data,_this.props.title);
  }

  render() {
    this.layout = (
      <LinearLayout
          height="match_parent"
          width="match_parent"
          orientation="vertical">

          {this.getHeader()}

          <HorizontalScrollView
           width = "wrap_content"
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
