

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
var CourseProgressCard = require('../Sunbird/CourseProgressCard');
var CardComponent = require('../Sunbird/core/CardComponent');
var DownloadedCard = require('../Sunbird/DownloadedCard');


class HomeTodoContainer extends View {
  constructor(props, children) {
    super(props, children);
    _this=this;

    this.setIds([
    ]);

    this.data = 
      [{
        imageUrl : "https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
        type : "COURSE",
        title : "Organic Chemistry",
        footerTitle : "20% done",
        footerSubTitle : "20 hrs remaining",
        actionText : "RESUME",
        isProgress : "true",
      },
      {
        imageUrl : "https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
        type : "COURSE",
        title : "Organic Chemistry",
        footerTitle : "20% done",
        footerSubTitle : "20 hrs remaining",
        actionText : "RESUME",
        isProgress : "true",
      }
      ];
    
  }


  afterRender = () => {

  }


 getRows = () =>{
    var rows = this.data.map((item,i) => {   
         return (<CardComponent 
                 data={item}
                 content={item}
                 onCardClick = {this.handleCardClick}/>)
        
    });

    var layout = (<LinearLayout
                    width="wrap_content"
                    height="wrap_content">

                    {rows}

                  </LinearLayout>);
    return layout;
                    
  }

  
  
  getHeader(){
    return (<LinearLayout
              width="match_parent"
              height="wrap_content"
              margin="16,16,16,16"
              orientation="horizontal">

              <TextView
                width="wrap_content"
                height="wrap_content"
                text={window.__S.TO_DO}
                style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

              <ViewWidget
                weight="1"
                height="0"/>

              <TextView
                width="wrap_content"
                height="wrap_content"
                text={window.__S.VIEW_ALL}
                visibility="gone"
                onClick={()=>{this.handleViewAllClick()}}
                style={window.__TextStyle.textStyle.TABBAR.SELECTED}/>

            </LinearLayout>)
  }


    handleCardClick = (content,type) =>{
     console.log("content is",content);
     console.log("type is ",type);
  }

    handleViewAllClick(){
        this.props.onViewAllClick();
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
                    padding="0,0,16,0"
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

module.exports = HomeTodoContainer;
