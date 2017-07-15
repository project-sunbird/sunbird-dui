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
var CardComponent = require('../Sunbird/core/CardComponent');


class CourseContainer extends View {
  constructor(props, children) {
    super(props, children);
    _this = this;

    this.setIds([]);
  }


  afterRender = () => {

  }

  getRows = () => {
    var rows = this.props.data.map((item, i) => {

      var temp = {
        imageUrl: (item.appIcon ? item.appIcon : "ic_action_course"),
        title: item.name,
        actionText: "OPEN",
        footerTitle : "Unrated",
        footerSubTitle: "No votes yet",
        actionText: item.status
      };

      return (<CardComponent 
                 data={temp}
                 index={i}
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
            width="0"
            height="0"
            weight="1"/>

            <TextView
            width="wrap_content"
            height="wrap_content"
            visibility={this.props.isViewAllExist?"visible":"gone"}
            text="VIEW ALL"
            style={window.__TextStyle.textStyle.TABBAR.SELECTED}/>
            

            </LinearLayout>)
  }



  handleCardClick = (content, type) => {
    this.props.onCourseClick(content, type);

  }




  render() {
    this.layout = (
      <LinearLayout
      height="match_parent"
      width="match_parent"
      background={this.props.transparent?window.__Colors.WHITE_F2:window.__Colors.WHITE}
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

module.exports = CourseContainer;
