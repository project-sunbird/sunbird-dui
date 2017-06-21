var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var RatingBar = require("@juspay/mystique-backend").androidViews.RatingBar;
var Button = require('../Sunbird/Button');
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var StarComponent = require('../Sunbird/StarComponent');
var _this;


class CardTodo extends View {
  constructor(props, children) {
    super(props, children);
    _this=this;

    this.setIds([
      "leftProgress",
      "rightProgress"
    ]);

    
  }



  getRemainingProgress = (progress) =>{
    var remainingProgress = 100 - parseInt(progress);
    return remainingProgress;
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


              <LinearLayout
                width="200"
                cornerRadius="4"
                height="4">

                <LinearLayout
                  width="0"
                  weight={this.props.data.progress}
                  id={this.idSet.leftProgress}
                  height="match_parent"
                  background={window.__Colors.SAFFRON}/>

                <LinearLayout
                  width="0"
                  id={this.idSet.rightProgress}
                  alpha="0.3"
                  weight={this.getRemainingProgress(this.props.data.progress)}
                  height="match_parent"
                  background={window.__Colors.PRIMARY_BLACK}/>

              </LinearLayout>

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
                text= "COURSE"
                padding="5,3,5,3"
                cornerRadius="4"
                background={window.__Colors.PRIMARY_BLACK}
                alignParentRight="true,-1"
                style={window.__TextStyle.textStyle.SYMBOL.STATUSBAR.LABEL}/>

            </RelativeLayout>

            {this.getFooter()}

            </LinearLayout>)

  }


  afterRender = () => {
    JBridge.makeLeftRounded(this.idSet.leftProgress);
    JBridge.makeRightRounded(this.idSet.rightProgress);
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
            text={this.props.data.progress+"% done"}
            style={window.__TextStyle.textStyle.CARD.SEMI_DARK}/>

            <TextView
            width="wrap_content"
            height="wrap_content"
            text={this.props.data.timeLeft}
            style={window.__TextStyle.textStyle.HINT.REGULAR}/>

            </LinearLayout>

            <ViewWidget
            height="0"
            weight="1"/>

            <Button
            type="SmallButton_Secondary_BT"
            width="wrap_content"
            height="wrap_content"
             onClick={()=>{this.handleOpenClick(this.props.data.moduleText)}}
            text="RESUME"/>


            </LinearLayout>
        )
    }

  
    handleCardClick = (courseName) =>{
        this.props.onCourseClick(courseName);
    }

    handleOpenClick = (courseName) =>{
      this.props.onCourseOpenClick(courseName);
    }

   

  render() {
      this.layout = (
        <LinearLayout
          height="wrap_content"
          width="match_parent"
          afterRender={this.afterRender}
          orientation="vertical">

          
           {this.getBody()}

         </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = CardTodo;
