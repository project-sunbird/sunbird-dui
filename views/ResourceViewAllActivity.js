var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var ListView = require("@juspay/mystique-backend/src/android_views/ListView");
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var LargeCardComponent = require('../components/Sunbird/core/LargeCardComponent');
var utils = require('../utils/GenericFunctions');

var _this;

class ResourceViewAllActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);
    window.__LoaderDialog.show();
    this.setIds([
      "viewMoreButton",
       "listContainer"
    ]);
    this.state = state;
    this.jsonArray=[];
    this.screenName = "ResourceViewAllActivity";
      this.menuData = {
      url: []
      }
    this.shouldCacheScreen = false;
    this.totalDetails = JSON.parse(state.data.value0.resourceDetails);
    this.btnStatus=this.totalDetails.showViewMore;
    _this = this;
    this.start_index = 0;
    this.details = this.totalDetails.resourceDetails;
    console.log("data in view all",this.totalDetails)
    this.appbarTitle = this.totalDetails.title;
    this.displayContent = [];
    JBridge.logListViewScreenEvent("RESOURCES",this.details.length,this.totalDetails.searchQuery)
  }

showList = () =>{
    var data = this.details;
    this.jsonArray=[];
    var layout;
    var rows = data.map((item,i) => {
      console.log("item date",item.createdOn)
      if(item.contentType != "course"){
        if(item.hasOwnProperty("contentData")){
          var appIconExist = item.contentData.hasOwnProperty("appIcon");
          this.fileImageUrl = appIconExist?("file://"+item.basePath + "/" +item.contentData.appIcon):"ic_action_resource";
          this.size = item.hasOwnProperty("sizeOnDevice") ? " ["+ utils.formatBytes(item.sizeOnDevice)+"]" : "";
          this.cType = item.contentData.contentType;
          this.name = item.contentData.name;
          if(item.contentData.hasOwnProperty("lastPublishedOn")){
            var d =  new Date(item.contentData.lastPublishedOn);
            this.time = utils.prettifyDate(d);
          }else if(item.contentData.hasOwnProperty("createdOn")){
            var d =  new Date(item.contentData.createdOn);
            this.time = utils.prettifyDate(d);
          }
          else{
            this.time="";
          }
        }else{
          this.size = " [" + utils.formatBytes(item.size) + "]";
          this.fileImageUrl = item.appIcon?item.appIcon:"ic_action_resource";
          this.cType = item.contentType
          this.name = item.name;
          if(item.hasOwnProperty("lastPublishedOn")){
            var d =  new Date(item.lastPublishedOn);
            this.time = utils.prettifyDate(d);
          }else if(item.hasOwnProperty("createdOn")){
            var d =  new Date(item.createdOn);
            this.time = utils.prettifyDate(d);
          }
          else{
            this.time="";
          }
          this.time = utils.prettifyDate(d);
          console.log(this.time)
        }
        var temp = {};
        temp['imageUrl'] = this.fileImageUrl;
        temp['name'] = this.name;
        temp['progress'];
        temp['footerTitle'] = this.time;
        temp['actionText'] = window.__S.OPEN ;
        temp["footerSubTitle"] = this.cType + this.size;
        temp['type'] = null;
        layout = (<LargeCardComponent
                 data={temp}
                 content={item}
                 index = {i}
                 onResourceClick = {this.handleResourceClick}/>);
                 this.jsonArray.push({ view: this.getView(layout.render()),value:"",viewType:0});
     }
    });
    var callback1 = callbackMapper.map(function() {
      console.log("button pressed");
      _this.handleViewMoreClick();
    });
    if(this.start_index==0){
      var buttonCallback="";
      var buttonText="";
      if(this.btnStatus=="visible"&&(this.jsonArray.length)>=10){
        buttonText = window.__S.VIEW_MORE;
        buttonCallback = callback1;
      }
      JBridge.listViewAdapter(
        this.idSet.listContainer,
        JSON.stringify(this.jsonArray),
        1000,
        buttonText,
        buttonCallback,
        this.idSet.viewMoreButton,
        0
      );
    }else
      {
        JBridge.appendToListView(
        this.idSet.listContainer,
        JSON.stringify(this.jsonArray),
        1000);
      }
      window.__LoaderDialog.hide();
  }

  handleResourceClick = (item,index)=>{
    var index_click = this.start_index <1 ? index+1 : index+(this.start_index*10)+1;
    JBridge.logContentClickEvent("RESOURCES",index_click,"",item.identifier)
    console.log(item)
    if(item.mimeType.toLowerCase() == "application/vnd.ekstep.content-collection"){
      var whatToSend={course:JSON.stringify(item)};
      var event={tag:"OPEN_CourseEnrolled",contents:whatToSend}
      window.__runDuiCallback(event);
    }else{
      var name = "",description = "";
      if(item.hasOwnProperty("name")){
        name = item.name;
        description = item.description
      }else if(item.hasOwnProperty("contentData")){
        name = item.contentData.name;
        description = item.contentData.description;
      }
      var headFooterTitle = item.contentType + (item.hasOwnProperty("size") ? " ["+utils.formatBytes(item.size)+"]" : "");
      var resDetails = {};
      resDetails['imageUrl'] = item.hasOwnProperty("contentData") ?"file://"+item.basePath+"/"+item.contentData.appIcon : item.appIcon;
      resDetails['title'] = name;
      resDetails['description'] = description;
      resDetails['headFooterTitle'] = headFooterTitle;
      resDetails['identifier'] = item.identifier;
      resDetails['content'] = item;

      var whatToSend = {resourceDetails:JSON.stringify(resDetails)}
      var event = {tag:"OPEN_ResourceInfo",contents:whatToSend}
      window.__runDuiCallback(event);
    }
  }

  afterRender= () => {
      this.showList();
  }

  onBackPressed = () => {
    var event = {tag:"BACK_ResourceViewAllActivity",contents: []}
    window.__runDuiCallback(event);
  }

  handleViewMoreClick = () =>{
    window.__LoaderDialog.show();
    if(JBridge.isNetworkAvailable()){
      var callback = callbackMapper.map(function(data){
        _this.details = [];
        data[0] = JSON.parse(utils.decodeBase64(data[0]));
        _this.displayContent=data[0];
        for(var i = _this.start_index*10;i<_this.displayContent.length;i++){
          _this.details.push(_this.displayContent[i]);
        }
        _this.start_index++;
        _this.showList();
      if((_this.start_index*10>=_this.displayContent.length)
        ||(_this.displayContent.length>=999)){
          _this.changeViewMoreButtonStatus();
        }
      });
      JBridge.searchContent(callback, JSON.stringify(this.details.searchQuery), "", "Resource", false,(_this.start_index+2)*10);
    }else{
      window.__LoaderDialog.hide();
      window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE)
    }
  }

  changeViewMoreButtonStatus(){
    JBridge.hideFooterView(
      this.idSet.listContainer,
      this.idSet.viewMoreButton
    );
  }


  render() {
    this.layout = (
      <LinearLayout
        root = "true"
        background={window.__Colors.WHITE}
        clickable="true"
        orientation="vertical"
        width="match_parent"
        height="match_parent">
        <SimpleToolbar
          width="match_parent"
          menuData={this.menuData}
          onBackPress={this.onBackPressed}
          showMenu="true"
          title= {this.appbarTitle}/>
        <ListView
          id={this.idSet.listContainer}
          width="match_parent"
          height="match_parent"/>
      </LinearLayout>
    );
    return this.layout.render();
  }
}

module.exports = Connector(ResourceViewAllActivity);
