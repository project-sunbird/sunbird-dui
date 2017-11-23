
var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var RatingBar = require("@juspay/mystique-backend/src/android_views/RatingBar");;
var Button = require('../../Sunbird/Button');
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var _this;


class ResourceViewAllCard extends View {
  constructor(props, children) {
    super(props, children);
    _this=this;

    this.setIds([
      'leftProgress',
      'rightProgress'
    ]);


  }


  afterRender = () => {

  }

  getRemainingProgress = (progress) =>{
    return (100 - parseInt(progress));
  }

 shortenText =(data) =>{
   if(((data+"").length)>17)
      {

        return ((data+"").substr(0,15)+"...");
      }
  return data;
 }

  getFooter = () =>{
    this.props.data.footerSubTitle = this.shortenText(this.props.data.footerSubTitle);
    return (    <LinearLayout
                  width="match_parent"
                  height="wrap_content"
                  padding = "12,27,16,12">


                  <LinearLayout
                    width="wrap_content"
                    height="wrap_content"
                    orientation="vertical">

                    <TextView
                      width="wrap_content"
                      height="wrap_content"
                      style={window.__TextStyle.textStyle.FILTER.REGULAR_BLACK}
                      enableEllipse="true"
                      visibility={this.props.data.footerSubTitle==""?"gone":"visible"}
                      text={this.props.data.footerTitle}/>

                    <TextView
                      width="wrap_content"
                      height="wrap_content"
                      style={window.__TextStyle.textStyle.HINT.REGULAR}
                      enableEllipse="true"
                      text={this.props.data.footerSubTitle}/>

                  </LinearLayout>
                  <LinearLayout
                  width="0"
                  weight="1"
                  />

                  <Button
                    type="SmallButton_Secondary_BT"
                    width="wrap_content"
                    height="wrap_content"
                    gravity="right"
                    onClick={()=>this.handleCardClick()}
                    text={this.props.data.actionText? this.props.data.actionText : window.__S.OPEN}/>

                </LinearLayout>);
  }




  getBody = () =>{
    console.log("imageUrl",this.props.data.imageUrl)
    var myProgress = this.props.data.isProgress?this.props.data.footerTitle.split('%')[0]:"0" ;
    var myProgressColor = myProgress==100 ? window.__Colors.SUCCESS_GREEN : window.__Colors.SAFFRON

    return(
      <LinearLayout
        width = "match_parent"
        height = "wrap_content"
        margin = "16,16,16,0"
        padding = "1,1,1,1"
        multiCorners={"10,10,10,10,"+window.__Colors.SHADOW_BLACK}>


        <LinearLayout
          width="match_parent"
          height="wrap_content"
          multiCorners={"10,10,10,10,"+window.__Colors.WHITE}
          onClick={this.handleCardClick}>

          <RelativeLayout
            width = "100"
            height = "match_parent">


            <LinearLayout
              width="match_parent"
              height="match_parent"
              scaleType="fixXY"
              alpha="0.5"
              multiCorners={"10,0,0,10,"+window.__Colors.BLACK}/>

            <ImageView
              width="100"
              height="100"
              gravity="center"
              circularImageUrl={"5,"+this.props.data.imageUrl}/>
            <TextView
                  width="wrap_content"
                  height="wrap_content"
                  margin = "10,8,5,10"
                  visibility={this.props.data.type?"visible":"gone"}
                  text= {this.props.data.type}
                  letterSpacing="0.07"
                  padding="5,3,5,3"
                  cornerRadius="4"
                  background={window.__Colors.PRIMARY_BLACK}
                  alignParentRight="true,-1"
                  style={window.__TextStyle.textStyle.SYMBOL.STATUSBAR.LABEL}/>

          </RelativeLayout>

          <LinearLayout
            width="0"
            weight="1"
            background={window.__Colors.WHITE}
            height="wrap_content"
            orientation = "vertical">

            <LinearLayout
              visibility={this.props.data.isProgress?"visible":"gone"}
              width="match_parent"
              height="wrap_content">

              <LinearLayout
                width="0"
                weight={myProgress}
                height="3"
                id={this.idSet.leftProgress}
                multiCorners={"6,0,0,0,"+ myProgressColor} />

                <LinearLayout
                  width="0"
                  weight={this.props.data.isProgress?this.getRemainingProgress(this.props.data.footerTitle.split('%')[0]):"0"}
                  height="3"
                  alpha="0.5"
                  id={this.idSet.rightProgress}
                  multiCorners={"0,6,0,0,"+window.__Colors.PRIMARY_BLACK}/>

              </LinearLayout>

              <TextView
                width="wrap_content"
                height="wrap_content"
                text={this.props.data.name}
                enableEllipse="true"
                maxLines="1"
                margin = "12,9,12,0"
                style={window.__TextStyle.textStyle.CARD.HEADING}/>

              {this.getFooter()}

            </LinearLayout>



        </LinearLayout>
    </LinearLayout> )

  }



  handleCardClick = () =>{

    this.props.onResourceClick(this.props.content,this.props.index);
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

module.exports = ResourceViewAllCard;
