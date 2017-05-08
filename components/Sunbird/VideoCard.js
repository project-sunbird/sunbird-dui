var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;

var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

class VideoCard extends View {
  constructor(props, children) {
    super(props, children);

    this.props.appendText = this.props.appendText || "";


  }


  render() {


    this.layout = (

      <LinearLayout
			width="match_parent"
      maxWidth="500"
			height="190"
      cornerRadius="5"
			onClick={this.handleVideoClick}
      orientation="vertical"
			gravity="center"
			>
					
              <ImageView
              	height="match_parent"
              	width="match_parent"
                margin = "0,0,0,8"
              	imageUrl={this.props.item.videoPlaceholder ? this.props.item.videoPlaceholder : "ic_video_placeholder"}
              /> 

              
                    		
	                	
       </LinearLayout>


    )

    return this.layout.render();
  }
}

module.exports = VideoCard;
