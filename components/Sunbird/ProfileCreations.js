
var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var RatingBar = require("@juspay/mystique-backend").androidViews.RatingBar;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;

var _this;
class ProfileCreations extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([

    ]);
    _this=this;
    this.data = this.props.data;

  }


  getHeader = () => {
    return (  <LinearLayout
                margin="0,0,0,16"
                width="match_parent"
                height="wrap_content">

                <TextView
                  width="wrap_content"
                  height="wrap_content"
                  text="Creator of"
                  style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

                <ViewWidget
                  height="0"
                  weight="1"/>

                <TextView
                  width="wrap_content"
                  height="wrap_content"
                  text={window.__S.VIEW_ALL}
                  style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>

              </LinearLayout>)
  }



  getCards = () => {
    var cards = this.data.map((item, i) => {
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              margin="0,0,12,6"
              orientation="vertical">

                <RelativeLayout
                 width="200"
                 height="110">

                  <ImageView
                    height="match_parent"
                    width="match_parent"
                    scaleType="fixXY"
                    gravity="center"
                    circularImageUrl={"10,"+item.imageUrl}/>

                  <LinearLayout
                    width="match_parent"
                    height="match_parent"
                    gravity="center"
                    cornerRadius="4"
                    background={window.__Colors.BLACK}
                    alpha="0.50"/>

                  <TextView
                    width="wrap_content"
                    height="wrap_content"
                    padding = "10,10,10,10"
                    text= {item.contentType}
                    padding="5,3,5,3"
                    cornerRadius="4"
                    background={window.__Colors.PRIMARY_BLACK}
                    style={window.__TextStyle.textStyle.SYMBOL.STATUSBAR.LABEL}/>

                  <TextView
                    width="match_parent"
                    height="wrap_content"
                    padding = "10,10,10,10"
                    alignParentBottom="true,-1"
                    text= {item.name}
                    style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}/>

              </RelativeLayout>

              </LinearLayout>);

            });

      return cards;
  }


  getBody = () =>{
    return (<LinearLayout
            width="wrap_content"
            height="wrap_content"
            margin="0,16,0,0">

              { this.getCards() }

            </LinearLayout>
    )
  }

  getLineSeperator = () => {
    return (<LinearLayout
              width="match_parent"
              height="1"
              margin="0,0,0,24"
              background={window.__Colors.PRIMARY_BLACK_22}/>)
  }


  render() {
    this.layout= (
              <LinearLayout
                margin="0,24,0,0"
                orientation="vertical">

                {this.getLineSeperator()}

                {this.getHeader()}

                <HorizontalScrollView
                 width = "wrap_content"
                 height = "wrap_content"
                 scrollBarX="false"
                 fillViewport="true">

                  {this.getBody()}

                </HorizontalScrollView>

              </LinearLayout>
    )
    return this.layout.render();
  }
}



module.exports = ProfileCreations;
