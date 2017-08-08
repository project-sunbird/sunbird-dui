var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var ProgressBar = require("@juspay/mystique-backend").androidViews.ProgressBar;


class ContentLoaderDialog extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      'parentContainer'
    ]);
    this.state = state;
    window.__ContentLoaderDialog = this;

}

  afterRender = () => {
   
  }


  render() {

    console.log("PROGRESS",this.props.progress);
    var completedProgress = this.props.progress;
    var remainingProgress = (100 - parseInt(this.props.progress))+"";

    this.layout = (
      <LinearLayout
        root = "true"
        orientation="vertical"
        id={this.idSet.parentContainer}
        visibility={this.props.visibility?this.props.visibility:"gone"}
        clickable="true"
        margin="0,100,0,0"
        gravity="center_horizontal"
        width="match_parent"
        height="match_parent">

           <TextView
           width="wrap_content"
           height="wrap_content"
           margin="0,0,0,32"
           text="Loading your course.."/>

             <LinearLayout
             width="250"
             height="wrap_content">

               <LinearLayout
               width="0"
               height="10"
               background={window.__Colors.PRIMARY_DARK}
               weight={completedProgress}/>

               <LinearLayout
               width="0"
               background={window.__Colors.PRIMARY_BLACK_22}
               height="10"
               weight={remainingProgress}/>

             </LinearLayout>

                  
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = ContentLoaderDialog;



