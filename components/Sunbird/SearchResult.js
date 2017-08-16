var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var utils = require('../../utils/GenericFunctions');



class SearchResult extends View {
  constructor(props, children) {
    super(props, children);
    console.log(this.props.data);
    
  }
  getData = () => {
    var answerLayout = this.props.data.map((item, index) => {
      var appIcon = item.hasOwnProperty("appIcon") ? item.appIcon : "ic_launcher" ;
     return (<LinearLayout
            width="match_parent"
            height="wrap_content"
            orientation="vertical"
            margin = "16,0,16,0"
            onClick = {()=>{this.handleItemClick(item)}}
            >
              <LinearLayout
                width = "match_parent"
                height = "wrap_content"
              >

              <ImageView
                width="32"
                height="32"
                margin = "10,12,0,12"
                scaleType="fixXY"
                gravity="center"
                circularImageUrl={"0,"+ appIcon }/>

              <LinearLayout
                width = "wrap_content"
                height = "wrap_content"
                orientation = "vertical">
                <LinearLayout
                height = "wrap_content"
                >
                  <TextView
                      height="wrap_content"
                      padding = "10,10,0,0"
                      text= {item.name}
                      style={window.__TextStyle.textStyle.CARD.HEADING}/>
                      <ViewWidget
                          weight="1"
                          height="0"/>
                    <TextView
                      height="wrap_content"
                      padding = "0,10,10,0"
                      text= { item.hasOwnProperty("size") ? utils.formatBytes(item.size) : " "}
                      style={window.__TextStyle.textStyle.HINT.SEMI}/>
                </LinearLayout>
                  <TextView
                      height="wrap_content"
                      padding = "10,3,10,10"
                      width = "wrap_content"
                      text= {item.contentType}
                      style={window.__TextStyle.textStyle.HINT.SEMI}/>



              </LinearLayout>

            </LinearLayout>
          <LinearLayout
             width ="match_parent"
             height = "1"
             background = {window.__Colors.DARK_GRAY_44} />
        </LinearLayout>)
    })

    return answerLayout;
  }




  handleItemClick = (item) =>{


    var itemDetails = JSON.stringify(item);

    if(item.contentType.toLowerCase() == "course"){
      
      var whatToSend={course:itemDetails};
      var event={tag:"OPEN_CourseInfoActivity_SEARCH",contents:whatToSend}
      window.__runDuiCallback(event);
    }
    else if(item.contentType.toLowerCase() == "collection" || item.contentType.toLowerCase() == "TextBook"){
      
      var whatToSend={course:itemDetails};
      var event={tag:"OPEN_CourseEnrolledActivity_SEARCH",contents:whatToSend}
      window.__runDuiCallback(event);
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

      var whatToSend = {resourceDetails:JSON.stringify(resDetails)}
      var event= {tag:"OPEN_ResourceDetailActivity_SEARCH",contents:whatToSend}
      window.__runDuiCallback(event); 
    }

  }

  

  render() {


    this.layout = (

      <LinearLayout
			width="match_parent"
			height="wrap_content"
			orientation="vertical">
        <ScrollView
            height="match_parent"
            width="match_parent"
            fillViewPort="true">
            <LinearLayout
              height="match_parent"
              width="match_parent"
              orientation="vertical">

                  {this.getData()}

            </LinearLayout>
        </ScrollView>
       </LinearLayout>


    )

    return this.layout.render();
  }
}
module.exports = SearchResult;
