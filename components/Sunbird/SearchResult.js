var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var utils = require('../../utils/GenericFunctions');
var ListView = require("@juspay/mystique-backend/src/android_views/ListView");



class SearchResult extends View {
  constructor(props, children) {
    super(props, children);
    console.log(this.props.data);
    this.type = this.props.type ? this.props.type : "Resource";
    this.jsonArray =[];
    this.setIds([
      'listContainer'
    ]);
  }
  getData = () => {
    return (<ListView
    id={this.idSet.listContainer}
    background="#ffffff"
    width="match_parent"
    height="wrap_content"/>);
  }
  showList=()=>{
     this.props.data.map((item, index) => {
      var appIcon = "ic_launcher";
      if (this.type == "Resource"  || this.type == "Course"){
        appIcon = item.hasOwnProperty("appIcon") ? item.appIcon : "ic_launcher" ;
      } else if (this.type == "Profile"){
        appIcon = (item.data && item.data.avatar) ? item.data.avatar : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR1X3cm5xzR4D1W9oPb2QWioKlrfLVd0DvXFUNqSjZfg-M0bpc";
      }
      var resultLayout = (
        <LinearLayout
          width="match_parent"
          height="warp_content"
          orientation="vertical"
          margin = "16,0,16,0"
          onClick = {()=>{this.handleItemClick(item,index)}}>

          <LinearLayout
            width = "match_parent"
            height = "wrap_content">

            <ImageView
              width="32"
              height="32"
              margin = "10,12,0,12"
              scaleType="fixXY"
              gravity="center"
              circularImageUrl={"0,"+ appIcon }/>

            <LinearLayout
              width = "match_parent"
              height = "wrap_content"
              orientation = "vertical">

              <LinearLayout
                height = "wrap_content"
                width="match_parent">

                <TextView
                  height="wrap_content"
                  width = "0"
                  padding = "10,10,0,0"
                  enableEllipse = "true"
                  text={item.name}
                  weight = "7"
                  style={window.__TextStyle.textStyle.CARD.HEADING}/>

                <LinearLayout
                  width="0"
                  weight="0.5" />

                <TextView
                  height="wrap_content"
                  padding = "0,10,10,0"
                  weight="2"
                  gravity = "right"
                  width="0"
                  visibility = { item.hasOwnProperty("size") ? "visible" : "gone"}
                  text= { item.hasOwnProperty("size") ? utils.formatBytes(item.size) : " "}
                  style={window.__TextStyle.textStyle.HINT.SEMI}/>
              </LinearLayout>

              <TextView
                height="wrap_content"
                padding = "10,3,10,10"
                width = "wrap_content"
                visibility = {item.contentType ? "visible" : "gone"}
                text= {item.contentType}
                style={window.__TextStyle.textStyle.HINT.SEMI}/>

                <LinearLayout
                  width="wrap_content"
                  height="wrap_content"
                  cornerRadius="4"
                  background={"#e8e8e8"}
                  alpha="0.70"
                  visibility = {this.type == "Profile" ? "visible" : "gone"}
                  padding = "5,1,5,1"
                  margin = "10,5,0,10">

                  <TextView
                    height = "wrap_content"
                    width = "wrap_content"
                    visibility = {this.type == "Profile" ? "visible" : "gone"}
                    text = {this.type == "Profile" ? (item.data.status == 1 ? "Active" : "Inactive") : ""}
                    style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK} />
                </LinearLayout>
            </LinearLayout>
          </LinearLayout>
        </LinearLayout>
      );
     this.jsonArray.push({ view: this.getView(resultLayout.render()),value:"",viewType: 0 });
    })
    //console.log(this.jsonArray);
    JBridge.listViewAdapter(
      this.idSet.listContainer,
      JSON.stringify(this.jsonArray),
      1000,
      null,
      "",
      ""
    );
  }

  handleItemClick = (item,index) =>{

    var itemDetails = JSON.stringify(item);
    if(this.props.type.toLowerCase() == "combined")
      JBridge.logContentClickEvent("HOME",index+1,this.props.searchText,item.identifier)
    else if(this.props.type.toLowerCase() == "course")
      JBridge.logContentClickEvent("COURSES",index+1,this.props.searchText,item.identifier)
    else if(this.props.type.toLowerCase() == "resource")
      JBridge.logContentClickEvent("RESOURCES",index+1,this.props.searchText,item.identifier)


    if (item.hasOwnProperty("data") && item.data.hasOwnProperty("education")){
      console.log("item data", item);
       var whatToSend={profile:JSON.stringify(item)};
       var event={tag:"OPEN_ProfileActivity_SEARCH",contents:whatToSend}
       window.__runDuiCallback(event);
   }else if(item.contentType.toLowerCase() == "collection" || item.contentType.toLowerCase() == "textbook" || utils.checkEnrolledCourse(item.identifier)){

      if (JBridge.getKey("isPermissionSetWriteExternalStorage", "false") == "true") {
        var whatToSend={course:itemDetails};
        var event={tag:"OPEN_CourseEnrolledActivity_SEARCH",contents:whatToSend}
        window.__runDuiCallback(event);
      }else{
        this.setPermissions();
      }
    }
    else if(item.contentType.toLowerCase() == "course"){

      if (JBridge.getKey("isPermissionSetWriteExternalStorage", "false") == "true") {
        var whatToSend={course:itemDetails};
        var event={tag:"OPEN_CourseInfoActivity_SEARCH",contents:whatToSend}
        window.__runDuiCallback(event);
      }else{
        this.setPermissions();
      }
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
      resDetails['screenshots'] = item.screenshots || [] ;
      resDetails['content'] = item;

      var whatToSend = {resourceDetails:JSON.stringify(resDetails)}
      var event= {tag:"OPEN_ResourceDetailActivity_SEARCH",contents:whatToSend}
      window.__runDuiCallback(event);
    }
  }

  setPermissions = () => {
   var callback = callbackMapper.map(function(data) {

      if (data == "android.permission.WRITE_EXTERNAL_STORAGE") {
        JBridge.setKey("isPermissionSetWriteExternalStorage", "true");
      }
      if(data == "DeniedPermanently"){
        console.log("DENIED DeniedPermanently");
        JBridge.hideKeyboard();
        window.__PermissionDeniedDialog.show("ic_warning_grey",window.__S.STORAGE);
      }
    });
    JBridge.setPermissions(callback,"android.permission.WRITE_EXTERNAL_STORAGE");
  }

  render() {

    this.layout = (
      <LinearLayout
			width="match_parent"
      afterRender={this.showList}
			height="match_parent"
			orientation="vertical"
      background="#ffffff">

              {this.getData()}

       </LinearLayout>
    )
    return this.layout.render();
  }
}
module.exports = SearchResult;
