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
        footerTitle : "20% remaining",
        footerSubTitle : "(2350) votes",
        actionText : "RESUME",
        isProgress : "true",
      },
      {
        imageUrl : "https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
        type : "COURSE",
        title : "Organic Chemistry",
        footerTitle : "20% remaining",
        footerSubTitle : "(2350) votes",
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
                 onCardClick = {this.handleCardClick}/>)
        
    });

    var layout = (<LinearLayout
                    width="wrap_content"
                    height="wrap_content">

                    {rows}

                  </LinearLayout>);
    return layout;
                    
  }

  handleCardClick = () =>{
    console.log("card clicked");
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
            text="To-Do"
            style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

            <ViewWidget
            weight="1"
            height="0"/>

            <TextView
            width="wrap_content"
            height="wrap_content"
            text="View all"
            onClick={()=>{this.handleViewAllClick()}}
            style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>

            </LinearLayout>)
  }


    handleCardClick = (name)=>{
      console.log("card name",name);
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
