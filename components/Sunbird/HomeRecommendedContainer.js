

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
var CourseCard = require('../Sunbird/CourseCard');
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var DownloadedCard = require('../Sunbird/DownloadedCard');

var CardComponent = require('../Sunbird/core/CardComponent');



class HomeRecommendedContainer extends View {
  constructor(props, children) {
    super(props, children);
    _this=this;

    this.setIds([
    ]);

      this.data = 
      [{
        imageUrl : "https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
        type : "COURSE",
        title : "Organic Chemistry for Std VII",
        footerTitle : "",
        footerSubTitle : "(2350) votes",
        stars:"4",
        actionText : "OPEN",
      },
      {
        imageUrl : "https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
        type : "RESOURCE",
        title : "Physics",
        footerTitle : "PDF file [207 KB]",
        footerSubTitle : "Saved on 10 May ‘17",
        actionText : "OPEN"
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
              text={this.props.title}
              style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

            </LinearLayout>)
  }


    handleCardClick  = (content,type) =>{
     

    }



    handleViewAllClick(){
        this.props.onViewAllClick();
    }

  render() {
      this.layout = (
        <RelativeLayout
          root="true"
          clickable="false"
          width="match_parent"
          height="250">

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

             <LinearLayout
                width="match_parent"
                background={window.__Colors.WHITE}
                alpha = "0.9"
                gravity="center"
                height="match_parent">

                  <TextView
                  gravity="center"
                  width="match_parent"
                  height="match_parent"
                  style ={window.__TextStyle.textStyle.NOTHING}
                  text={window.__S.COMING_SOON}/>

               </LinearLayout>

        </RelativeLayout>
    )

    return this.layout.render();
  }
}

module.exports = HomeRecommendedContainer;
