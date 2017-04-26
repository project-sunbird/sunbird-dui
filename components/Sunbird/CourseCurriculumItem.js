var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;

var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;

class ChapterItem extends View {
  constructor(props, children) {
    super(props, children);
  }

  render() {

    this.layout = (

      <LinearLayout
       height="match_parent"
       width="match_parent">


       <LinearLayout
         orientation="vertical"
         gravity="center"
         height="match_parent"
         width="24">
         <ViewWidget 
            width="2"
            height="24"
            background={window.__Colors.DARK_GRAY_44} />
           <ImageView
            width="24"
            height="24"
            imageUrl="ic_date_range"/>
       </LinearLayout>
        
        <TextView
          text={this.props.item.name}
          margin="24,24,0,0"
          style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>



        

       </LinearLayout>

    )
    return this.layout.render();
  }
}

class CourseCurriculumItem extends View {
  constructor(props, children) {
    super(props, children);

  }

  getChapterContent = () => {
    console.log("IN CHP CONTENT", this.props.item.chapterContent);

    var items = this.props.item.chapterContent.map((item) => {
      return (<ChapterItem height="wrap_content"
                width="match_parent"
                item={item}/>)
    })



    return (
      <LinearLayout
        height="wrap_content"
        width="match_parent"
        orientation="vertical">
        {items}
      </LinearLayout>);
  }

  render() {


    this.layout = (

      <LinearLayout
       height="match_parent"
       orientation="vertical"
       width="match_parent">
        <TextView
          text={this.props.item.chapterName}
          style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

          {this.getChapterContent()}  

        

       </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = CourseCurriculumItem;
