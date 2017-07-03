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


class ResourceViewAllCard extends View {
  constructor(props, children) {
    super(props, children);
    _this=this;

    this.setIds([
    ]);
    console.log("download card contetn",this.props.content);

    
  }




  afterRender = () => {

  }

formatBytes = (bytes)=> {
    if(bytes < 1024) return bytes + " Bytes";
    else if(bytes < 1048576) return(bytes / 1024).toFixed(2) + " KB";
    else if(bytes < 1073741824) return(bytes / 1048576).toFixed(2) + " MB";
    else return(bytes / 1073741824).toFixed(3) + " GB";
};


  getBody = () =>{
    console.log("data in card content",this.props.data);
    return(
            <LinearLayout
            width = "match_parent"
            height = "match_parent"
            margin = "16,16,16,0"
            padding = "1,1,1,1"
            multiCorners={"10,10,10,10,"+window.__Colors.SHADOW_BLACK}
            >
            
            <LinearLayout
            width="match_parent"
            height="match_parent"
            multiCorners={"10,10,10,10,"+window.__Colors.WHITE}
            >
            <LinearLayout
              onClick={()=>this.handleCardClick()}
              >

              <LinearLayout
              width = "100"
              height = "100"
              alpha="0.50"
              multiCorners={"10,0,0,10,"+window.__Colors.BLACK}
              >
                    
                    <ImageView
                      width="100"
                      height="100"
                      gravity="center"
                      circularImageUrl={"10,"+ this.props.data.imageUrl}/>
              </LinearLayout>
              <LinearLayout
              orientation = "vertical"
              >
                      <LinearLayout
                      width = "wrap_content"
                      height = "wrap_content"
                      orientation = "vertical"
                      >
                        <TextView
                          width="wrap_content"
                          height="wrap_content"
                          text={this.props.data.name}
                          margin = "12,12,12,0"
                          style={window.__TextStyle.textStyle.CARD.HEADING}/>
                      </LinearLayout>

                      <LinearLayout
                        margin = "12,35,16,0"
                      >
                        <TextView
                          width="wrap_content"
                          height="wrap_content"
                          style={window.__TextStyle.textStyle.HINT.REGULAR}
                          text={ this.props.data.label2 + " [" + this.formatBytes(this.props.data.label1) + "]"}/>
                        <ViewWidget
                            height="0"
                            weight="1"/>

                          <Button
                          type="SmallButton_Secondary_BT"
                          width="wrap_content"
                          height="wrap_content"
                          onClick={()=>this.handleCardClick()}
                          text={this.props.data.actionText? this.props.data.actionText : "OPEN"}/>


                      </LinearLayout>
            </LinearLayout>

            </LinearLayout>
            </LinearLayout>
            </LinearLayout>)

  }


  
    handleCardClick = () =>{
      console.log("click card",this.props.content);
        this.props.onResourceClick(this.props.content);
    }

   

   

  render() {
      this.layout = (
        <LinearLayout
          height="wrap_content"
          width="match_parent"
          orientation="vertical"
          >

          
           {this.getBody()}

         </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = ResourceViewAllCard;
