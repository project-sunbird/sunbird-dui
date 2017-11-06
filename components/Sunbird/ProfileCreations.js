
var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var RatingBar = require("@juspay/mystique-backend/src/android_views/RatingBar");;
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var CardComponent = require('../Sunbird/core/CardComponent');
var utils = require('../../utils/GenericFunctions');


var _this;
class ProfileCreations extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([

    ]);
    _this=this;
    this.data = this.props.data || {};

  }


  getHeader = () => {
    return (  <LinearLayout
                margin="0,0,0,16"
                width="match_parent"
                height="wrap_content">

                <TextView
                  width="wrap_content"
                  height="wrap_content"
                  text={window.__S.CREATOR_OF}
                  style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

                <ViewWidget
                  height="0"
                  weight="1"/>

                <TextView
                  width="wrap_content"
                  height="wrap_content"
                  visibility = "gone"
                  text={window.__S.VIEW_ALL}
                  style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>

              </LinearLayout>)
  }

  getCardLayout = (item) => {
    var size = item.hasOwnProperty("size") ? "  "+window.__S.FILE_SIZE.format(utils.formatBytes(item.size)) : "";

    var temp = {
        imageUrl: (item.appIcon ? item.appIcon : "ic_action_course"),
        title: item.name,
        actionText: window.__S.OPEN,
        footerTitle : "",
        stars : item.hasOwnProperty("me_averageRating")? item.me_averageRating+ "" : "0",
        footerSubTitle: size,
        type : item.contentType
    };
      return (<CardComponent
                 data={temp}
                 content={item}
                 onCardClick={this.handleCardClick}/>)

  }

  handleCardClick = (item) => {
    if(this.props.onCardClick){
      this.props.onCardClick(item);
    }
  }

  getCards = () => {
    if (this.data.length && this.data.length > 0){
      var cards = this.data.map((item, i) => {
        return this.getCardLayout(item);
      });
    } else {
      return(
        <LinearLayout
          width="wrap_content"
          height="wrap_content">
        </LinearLayout>
      )
    }

    // return (<LinearLayout
    //           width="wrap_content"
    //           height="wrap_content"
    //           margin="0,0,12,6"
    //           orientation="vertical">
    //
    //             <RelativeLayout
    //              width="200"
    //              height="110">
    //
    //               <ImageView
    //                 height="match_parent"
    //                 width="match_parent"
    //                 scaleType="fixXY"
    //                 gravity="center"
    //                 circularImageUrl={"10,"+item.imageUrl}/>
    //
    //               <LinearLayout
    //                 width="match_parent"
    //                 height="match_parent"
    //                 gravity="center"
    //                 cornerRadius="4"
    //                 background={window.__Colors.BLACK}
    //                 alpha="0.50"/>
    //
    //               <TextView
    //                 width="wrap_content"
    //                 height="wrap_content"
    //                 padding = "10,10,10,10"
    //                 text= {item.contentType}
    //                 padding="5,3,5,3"
    //                 cornerRadius="4"
    //                 background={window.__Colors.PRIMARY_BLACK}
    //                 style={window.__TextStyle.textStyle.SYMBOL.STATUSBAR.LABEL}/>
    //
    //               <TextView
    //                 width="match_parent"
    //                 height="wrap_content"
    //                 padding = "10,10,10,10"
    //                 alignParentBottom="true,-1"
    //                 text= {item.name}
    //                 style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}/>
    //
    //           </RelativeLayout>
    //
    //           </LinearLayout>);
    //
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
              margin="0,16,0,16"
              background={window.__Colors.PRIMARY_BLACK_22}/>)
  }


  render() {
    this.layout= (
              <LinearLayout
                width="match_parent"
                margin="0,15,0,0"
                orientation="vertical"
                visibility = {(this.data.hasOwnProperty("length") && this.data.length > 0) ? "visible" : "gone"}>

                {this.getLineSeperator()}

                {this.getHeader()}

                <HorizontalScrollView
                 width = "match_parent"
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
