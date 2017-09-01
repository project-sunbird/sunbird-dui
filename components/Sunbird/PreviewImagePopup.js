const View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");

var dom = require("@juspay/mystique-backend/src/doms/android");

var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");

class PreviewImagePopup extends View {
    constructor(props, childern) {
        super(props, childern);
        this.setIds([
            "popUpParent",
            "previewImageContainer",
            "skillLayout"
        ]);
        window.__PreviewImagePopup = this;
        this.props = props;
        this.visibility=false;

    }

    show = (imageUrl) => {
        this.visibility=true;
        this.setVisibility("visible");
        if(imageUrl==undefined)
          imageUrl=this.props.defaultImage;
        console.log("-->",imageUrl)
        this.replaceChild(this.idSet.previewImageContainer,this.getImage(imageUrl).render(),0)
    }

    hide = () => {
        this.visibility=false;
        this.setVisibility("gone");
    }

    getVisibility = () => {
      return this.visibility;
    }

    setVisibility = (data) => {
        var cmd = this.set({
            id: this.idSet.popUpParent,
            visibility: data
        });

        Android.runInUI(cmd, 0);
    }

    getImage = (imageUrl) => {
      return(
      <LinearLayout
        height="match_parent"
        root="true"
        width="match_parent"
        orientation="vertical">
      
       <ImageView
              height="match_parent"
              width="match_parent"
              imageFromUrl={imageUrl}/>
      
      </LinearLayout>);
    }


    /*******************************
     *  UI Code is defined here
     *******************************/
    render = () => {
        this.layout = (
          <RelativeLayout
              height={this.props.height || "match_parent"}
              width={this.props.width || "match_parent"}
              root="true"
              clickable="true"
              visibility="gone"
              id={this.idSet.popUpParent}
              background={window.__Colors.PRIMARY_BLACK_DD}
              gravity="center">
                  

                  <LinearLayout
                    height="match_parent"
                    width="match_parent"
                    onClick={this.hide}/>
                 

                  <LinearLayout
                    height="match_parent"
                    width="match_parent"
                    id={this.idSet.previewImageContainer}
                    orientation="vertical"
                    margin="20,20,20,20"/>
  
          </RelativeLayout>
        );
        return this.layout.render();
    }

}

module.exports = PreviewImagePopup;