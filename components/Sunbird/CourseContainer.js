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
var CourseCard = require('../Sunbird/CourseCard');
var CardComponent = require('../Sunbird/core/CardComponent');


class CourseContainer extends View {
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
        footerTitle : "(4 stars)",
        footerSubTitle : "(2350) votes",
        actionText : "RESUME",
      },
      {
        imageUrl : "https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
        type : "COURSE",
        title : "Organic Chemistry",
        footerTitle : "(4 stars)",
        footerSubTitle : "(2350) votes",
        actionText : "RESUME",
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
                 onCardClick={this.handleCardClick}/>)
                 
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


    handleCourseClick = (courseName)=>{
      // not used

      this.state = { tag: 'StartCourseInfoFlow',contents: {"course":courseName}}
      window.__runDuiCallback(this.state);
      console.log("course selected",courseName);
    }

    handleCardClick = (content,type) =>{
      console.log("content is",content);
      console.log("type is",type);
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

module.exports = CourseContainer;
