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
    this.isEditable = this.props.editable;
    this.data=[
      {
        "name":"VYASA",
        "imageUrl":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR1X3cm5xzR4D1W9oPb2QWioKlrfLVd0DvXFUNqSjZfg-M0bpc"
      },
      {
        "name":"IITE",
        "imageUrl":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR1X3cm5xzR4D1W9oPb2QWioKlrfLVd0DvXFUNqSjZfg-M0bpc"
      },
      {
        "name":"NCTE",
        "imageUrl":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR1X3cm5xzR4D1W9oPb2QWioKlrfLVd0DvXFUNqSjZfg-M0bpc"
      },
      {
        "name":"Teach for India",
        "imageUrl":"ic_launcher"
      }
    ]

  }


  getHeader = () => {
    return (  <LinearLayout
              margin="0,0,0,16"
              width="match_parent"
              height="wrap_content">

              <TextView
              width="wrap_content"
              height="wrap_content"
              text="Affiliations"
              style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

              <ViewWidget
              height="0"
              weight="1"/>

              <TextView
              width="wrap_content"
              height="wrap_content"
              text="Add"
              visibility = {(this.isEditable == "true") ? "visible" : "gone"}
              style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>

              </LinearLayout>)
  }



  getCards = () => {
    var cards = this.data.map((item, i) => {
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              margin="0,0,12,6"
              orientation="vertical"
              gravity = "center">

              <ImageView
                height="80"
                width="80"
                gravity="center"
                circularImageUrl={"0,"+item.imageUrl}/>

              <TextView
                width="wrap_content"
                height="wrap_content"
                text= {item.name}
                padding="5,3,5,3"
                style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>
              </LinearLayout>);

            });

      return cards;
  }


  getBody = () =>{
    return (<LinearLayout
            width="wrap_content"
            height="wrap_content"
            margin="0,16,0,0"
            >

            {this.getCards()}

            </LinearLayout>
    )
  }

  getLineSeperator() {
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
