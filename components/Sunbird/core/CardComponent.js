var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var RatingBar = require("@juspay/mystique-backend").androidViews.RatingBar;
var Button = require('../../Sunbird/Button');
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var StarComponent = require('../../Sunbird/StarComponent');
var _this;


class CardComponent extends View {
  constructor(props, children) {
    super(props, children);
    _this=this;

    this.setIds([
      "leftProgress",
      "rightProgress",
      "ratingBar"
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
            onClick={this.handleCardClick}
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
                visibility={this.props.data.isProgress ? "visible" : "gone"}
                height="4">


                <LinearLayout
                  width="0"
                  weight={this.props.data.isProgress?this.props.data.footerTitle.split('%')[0]:"0"}
                  id={this.idSet.leftProgress}
                  height="match_parent"
                  multiCorners={"6,0,0,0,"+window.__Colors.SAFFRON} />
                 

                <LinearLayout
                  width="0"
                  id={this.idSet.rightProgress}
                  alpha="0.3"
                  multiCorners={"0,6,0,0,"+window.__Colors.PRIMARY_BLACK}
                  weight={this.props.data.isProgress?this.getRemainingProgress(this.props.data.footerTitle.split('%')[0]):"0"}
                  height="match_parent"/>

              </LinearLayout>

              <TextView
                width="200"
                height="wrap_content"
                padding = "10,10,10,10"
                alignParentBottom="true,-1"
                text= {this.props.data.title}
                style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}/>

              <TextView
                width="wrap_content"
                height="wrap_content"
                margin = "10,10,10,10"
                visibility={this.props.data.type?"visible":"gone"}
                text= {this.props.data.type}
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
      JBridge.setRating(this.idSet.ratingBar,this.props.data.stars);
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
            text={this.props.data.footerTitle}
            visibility={this.props.data.stars?"gone":"visible"}
            style={window.__TextStyle.textStyle.CARD.SEMI_DARK}/>

            <LinearLayout
            visibility={this.props.data.stars?"visible":"gone"}
            width="wrap_content"
            height="wrap_content">

                <RatingBar
                width="wrap_content"
                height="wrap_content"
                id={this.idSet.ratingBar}/>

            </LinearLayout>

            <TextView
            width="wrap_content"
            height="wrap_content"
            text={this.props.data.footerSubTitle}
            style={window.__TextStyle.textStyle.HINT.REGULAR}/>

            </LinearLayout>

            <ViewWidget
            height="0"
            weight="1"/>

            <Button
            type="SmallButton_Secondary_BT"
            width="wrap_content"
            height="wrap_content"
            onClick={this.handleCardClick}
            text={this.props.data.actionText? this.props.data.actionText : "OPEN"}/>


            </LinearLayout>
        )
    }

  
    handleCardClick = () =>{
      this.props.onCardClick(this.props.content,this.props.data.type);
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

module.exports = CardComponent;
