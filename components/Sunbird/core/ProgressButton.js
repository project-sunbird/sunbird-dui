var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;

var Button = require('../../Sunbird/Button');

class ProgressButton extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "ProgressButton";
    this.setIds([
      "downloadingText",
      "downloadBarContainer"
      ])
    window.__updateDownload = this.updateProgress;
    this.isDownloaded=false;
  }

  handleClick = () => {
    this.props.onButtonClick();
  }

  

  updateProgress = (pValue) =>{
    var cmd;
    console.log("--->\t\t\t\n\n\n",pValue);

    var data=JSON.parse(pValue);
    
    var textToShow=""
    
    if(parseInt(data.downloadProgress)==100)
    {
      this.isDowloaded=true;
      textToShow="DOWNLOAD COMPLETE"
      

    }else{
      this.isDowloaded=false;
      textToShow="DOWNLOADED " + data.downloadProgress + "%"
      
    }
    this.replaceChild(this.idSet.downloadBarContainer,this.getButtons(data.downloadProgress,textToShow).render(),0);




  }

 getDownloadBackground = (value)=>{

   value =(value<0)?0:value;

   var pLeft= parseFloat(value)/parseFloat(100);
   var pRight=(1-pLeft);

   return(<LinearLayout
        width="match_parent"
        onClick={this.handleClick}
        root="true"
        height="48">

            <LinearLayout
            width="0"
            height="match_parent"
            weight={pLeft}
            multiCorners={"8,0,0,8,"+window.__Colors.THICK_BLUE}/>

            <LinearLayout
            width="0"
            height="match_parent"
            weight={pRight}
            multiCorners={"0,8,8,0,"+window.__Colors.PRIMARY_DARK}/>

        </LinearLayout>)

 }



  getButtons = (value,text) => {
    var _this=this;
  var layout = (
        <RelativeLayout
        width="match_parent"
        height="48"
        root="true">

        
      { this.getDownloadBackground(value)}
        

        <TextView
        width="wrap_content"
        height="wrap_content"
        centerInParent="true,-1"
        id={this.idSet.downloadingText}
        style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
        text={text}/>

        </RelativeLayout> )

        return layout;
  }



  render() {
    var text = this.props.text;


    this.layout = (
      <LinearLayout
        height="wrap_content"
        orientation="vertical"
        width="match_parent"
        background={window.__Colors.WHITE}>
        <LinearLayout
          height="2"
          visibility={this.props.hideDivider?"gone":"visible"}
          width="match_parent"
          background={window.__Colors.PRIMARY_BLACK_22}/>
        <LinearLayout
          height="match_parent"
          width="match_parent"
          margin="16,16,16,16"
          root="true"
          id={this.idSet.downloadBarContainer}>
       
            {this.getButtons(0,"DOWNLOAD COURSE")}
       
         </LinearLayout>     

      </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = ProgressButton;
