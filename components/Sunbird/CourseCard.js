
var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var RatingBar = require("@juspay/mystique-backend/src/android_views/RatingBar");;
var Button = require('../Sunbird/Button');
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var StarComponent = require('../Sunbird/StarComponent');
var _this;


class CardRecommended extends View {
  constructor(props, children) {
    super(props, children);
    _this=this;

    this.setIds([
    ]);

    
  }


  afterRender = () => {

  }

  getBody = () =>{
    return(
            <LinearLayout
              width="wrap_content"
              height="wrap_content"
              margin="16,0,0,22"
              onClick={()=>{this.handleCardClick(this.props.data.moduleText)}}
              orientation="vertical">

              <RelativeLayout
               width="200"
               height="wrap_content">

                <ImageView
                  width="200"
                  height="110"
                  scaleType="fixXY"
                  gravity="center"
                  circularImageUrl={"10,"+this.props.data.imageUrl}/>

                <LinearLayout
                  width="200"
                  height="110"
                  gravity="center"
                  cornerRadius="4"
                  background={window.__Colors.BLACK}
                  alpha="0.50"/>

                <TextView
                  width="200"
                  height="wrap_content"
                  padding = "10,10,10,10"
                  alignParentBottom="true,-1"
                  text= {this.props.data.moduleText}
                  style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}/>

                <TextView
                  width="wrap_content"
                  height="wrap_content"
                  margin = "10,10,10,10"
                  text= {window.__S.COURSE}
                  padding="5,3,5,3"
                  cornerRadius="4"
                  background={window.__Colors.PRIMARY_BLACK}
                  alignParentRight="true,-1"
                  style={window.__TextStyle.textStyle.SYMBOL.STATUSBAR.LABEL}/>

              </RelativeLayout>

              {this.getFooter()}

            </LinearLayout>)

  }

  getFooter= ()=>{
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
                  text={this.props.data.stars}
                  style={window.__TextStyle.textStyle.HINT.REGULAR}/>

                <TextView
                  width="wrap_content"
                  height="wrap_content"
                  text={this.props.data.votes}
                  style={window.__TextStyle.textStyle.HINT.REGULAR}/>

              </LinearLayout>

              <ViewWidget
                height="0"
                weight="1"/>

              <Button
                type="SmallButton_Secondary_BT"
                width="wrap_content"
                height="wrap_content"
                onClick={()=>{this.handleCardClick(this.props.data.moduleText)}}
                text={window.__S.OPEN}/>


            </LinearLayout>
        )
    }

  
    handleCardClick = (courseName) =>{
        this.props.onCourseClick(courseName);
    }

   
  render() {
      this.layout = (
        <LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical">

          
           {this.getBody()}

         </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = CardRecommended;
