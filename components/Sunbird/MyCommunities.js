
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
var RatingBar = require("@juspay/mystique-backend/src/android_views/RatingBar");;


class MyCommunities extends View {
  constructor(props, children) {
    super(props, children);
    _this=this;

    this.setIds([
    ]);

    this.data = [
      {
        "imageUrl":"https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
        "moduleText":"All India Teachers Association",
        "members":"(250 members)",
        "lastSeen":"4 unread posts"
      },
      {
        "imageUrl":"https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
        "moduleText":"All India Teachers Association",
        "members":"(250 members)",
        "lastSeen":"4 unread posts"
      },
      {
        "imageUrl":"https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
        "moduleText":"All India Teachers Association",
        "members":"(250 members)",
        "lastSeen":"4 unread posts"
      }
    ]
  }


  

  getRows(){
    var rows = this.data.map((item, i) => {
              return(
                    <LinearLayout
                    width="wrap_content"
                    height="wrap_content"
                    margin="16,0,0,22"
                    onClick={()=>{this.handleMyCommunityClick(item.moduleText)}}
                    orientation="vertical">

                      <RelativeLayout
                       width="wrap_content"
                       height="wrap_content">

                      <ImageView
                        height="110"
                        width="200"
                        scaleType="fixXY"
                        gravity="center"
                        circularImageUrl={"10,"+item.imageUrl}/>

                      <LinearLayout
                        width="200"
                        height="110"
                        gravity="center"
                        cornerRadius="4"
                        background={window.__Colors.BLACK}
                        alpha="0.50"/>

                      <TextView
                        gravity="center"
                        width="150"
                        height="wrap_content"
                        padding = "10,10,10,10"
                        centerInParent="true,-1"
                        text= {item.moduleText}
                        style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}/>

                    </RelativeLayout>

                    {this.getFooter(item)}

                    </LinearLayout>

                  )
    });

    var layout =  (<LinearLayout
            width="match_parent"
            height="wrap_content"
            orientation="horizontal">

            {rows}

          </LinearLayout>)

    return layout;

  }

  getFooter(item){
    return (<LinearLayout
            margin="0,8,0,0"
            width="200"
            height="wrap_content">

            <LinearLayout
            width="wrap_content"
            height="wrap_content"
            orientation="vertical">

            <TextView
            width="wrap_content"
            height="wrap_content"
            text={item.members}
            style={window.__TextStyle.textStyle.HINT.REGULAR}/>            

            <TextView
            width="wrap_content"
            height="wrap_content"
            text={item.lastSeen}
            style={window.__TextStyle.textStyle.HINT.REGULAR}/>

            </LinearLayout>

            <ViewWidget
            height="0"
            weight="1"/>

            <Button
            type="SmallButton_Secondary_WB"
            width="wrap_content"
            height="wrap_content"
            onClick={this.handleAnswerSubmit}
            text={window.__S.VIEW}/>


            </LinearLayout>
        )
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
            text={window.__S.MY_COMMUNITIES}
            style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

            <ViewWidget
            weight="1"
            height="0"/>

            <TextView
            width="wrap_content"
            height="wrap_content"
            text={window.__S.VIEW_ALL}
            onClick={()=>{this.handleViewAllClick()}}
            style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>

            </LinearLayout>)
  }


    handleMyCommunityClick (communityName){
        this.props.onMyCommunityClick(communityName);
        console.log("community selected",communityName);
    }

    handleViewAllClick(){
        this.props.onViewAllClick();
    }


  

  render() {
      this.layout = (
        <LinearLayout
          height="match_parent"
          width="match_parent"
          afterRender={this.afterRender}
          orientation="vertical">

          {this.getHeader()}

          <HorizontalScrollView
           width = "wrap_content"
           height = "wrap_content"
           scrollBarX="false"
           fillViewport="true">

           {this.getRows()}


          </HorizontalScrollView>

         </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = MyCommunities;
