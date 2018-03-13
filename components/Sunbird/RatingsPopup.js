const dom = require("@juspay/mystique-backend/src/doms/android");
const View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var FeatureButton = require("./FeatureButton");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var _this;

class RatingsPopup extends View {
    constructor(props, children) {
        super(props, children);
        this.setIds([
            "parentContainer",
            "starsContainer"
        ]);
        this.parentId = this.props.id || this.idSet.parentContainer;
        _this = this;
        this.starArr = [0,0,0,0,0];
        window.__RatingsPopup = this;

        //data to send for the feedback
        this.contentId = "";
        this.comment = "";
        this.commentHint = ""
        this.rating = 0;
        this.pageId = "";
        this.contentVersion = "";
        this.visibility = false;
    }


    show = (id) => {
        this.setVisibility("visible", id);
        this.visibility = true;
    }

    hide = (id) => {
        this.setVisibility("gone", id);
        this.visibility = false;
    }

    getVisibility = () => {
      return this.visibility;
    }

    initData = (contentId, pageId, contentVersion, rating, comment) => {
        this.contentId = contentId;
        this.pageId = pageId;
        this.contentVersion = contentVersion;
        this.comment = comment ? comment : "";
        this.rating = Math.floor(rating ? rating : 0);
        this.commentHint = this.rating == 0 ? window.__S.FEEDBACK_HINT : window.__S.FEEDBACK_HINT_1;
        this.updateStars(this.rating - 1);
    }

    isRatingsAvailable = () => {
        if (this.comment != "" || this.rating != 0) return true;
        else return false;
    }

    setVisibility = (data, id) => {
        var cmd = this.set({
            id: id || this.parentId,
            visibility: data
        })
        Android.runInUI(cmd, 0)
    }

    handleDismissClick = () => {
        this.hide();
    }

    submitFeedback = () => {
        this.rating = this.totalRatedStars();
        this.commentHint = this.rating == 0 ? window.__S.FEEDBACK_HINT : window.__S.FEEDBACK_HINT_1;
        var successCb = callbackMapper.map(() => {
            window.__Snackbar.show("Thank you for rating.");
        });
        JBridge.sendFeedback(successCb, this.contentId, this.comment, this.rating, this.pageId, this.contentVersion);
        this.hide();
    }

    totalRatedStars = () => {
        var totalStars = 0;
        this.starArr.map((item) => { if (item == 1) totalStars++ });
        return totalStars;
    }

    updateStars = (index) => {
        var nArr = [0,0,0,0,0];
        this.starArr.map((item, i) => {
            if (i <= index) {
                nArr[i] = 1;
            }
        });
        this.starArr = nArr;
        var newLayout = (
            <LinearLayout
                width="match_parent"
                height="wrap_content"
                orientation="vertical"
                layouTransition="true"
                margin="0, 16, 0, 0">
                {this.getStars()}
                {this.getFeedbackSection()}
                {this.getSubmitButton()}
            </LinearLayout>
        );
        this.replaceChild(this.idSet.starsContainer, newLayout.render(), 0);
    }

    getStars = () => {
        var stars = this.starArr.map((item, i) => {
            if (item == 0){
                return (<ImageView
                    height = "30"
                    width = "30"
                    imageUrl = "ic_grey_star"
                    onClick = {()=>{ this.updateStars(i)}}/>)
            } else {
                return (<ImageView
                    height="30"
                    width="30"
                    imageUrl="ic_blue_star"
                    onClick={() => { this.updateStars(i) }} />)
            }
        });
        return (
            <LinearLayout
                height = "wrap_content"
                width = "match_parent"
                orientation = "horizontal"
                margin="0, 16, 0, 0">
                {stars}
            </LinearLayout>
        );
    }

    updateFeedbackText = (text) => {
        this.comment = text;
        console.log("feedbacktext -> ", this.feedBack);
    }

    getFeedbackSection = () => {
        var flag = this.totalRatedStars();
        return (
            <EditText
                width = "match_parent"
                text={this.comment != "" ? this.comment : null}
                hint={this.commentHint}
                margin="0, 16, 0, 0"
                visibility = {flag == 0? "gone" : "visible"}
                onChange = {this.updateFeedbackText} />
        );
    }

    getSubmitButton = () => {
        var flag = this.totalRatedStars();
        console.log("getSubmitButton -> ", flag);

        if (flag == 0) {
            return (
                <FeatureButton
                    alpha="0.5"
                    typeface="bold"
                    clickable="false"
                    width="match_parent"
                    height="56"
                    stroke={"3," + window.__Colors.WHITE}
                    background={window.__Colors.PRIMARY_ACCENT}
                    text={window.__S.BTN_SUBMIT}
                    buttonClick={()=>{}}
                    margin="0, 16, 0, 0"
                    textColor={window.__Colors.WHITE}
                    textSize="18" />
            );
        }else {
            return (
                <FeatureButton
                    typeface="bold"
                    clickable="true"
                    width="match_parent"
                    height="56"
                    stroke={"3," + window.__Colors.WHITE}
                    background={window.__Colors.PRIMARY_ACCENT}
                    text={window.__S.BTN_SUBMIT}
                    buttonClick={this.submitFeedback}
                    margin="0, 16, 0, 0"
                    textColor={window.__Colors.WHITE}
                    textSize="18" />
            );
        }
    }

    getHeader = () => {
        return (
            <LinearLayout
                width="match_parent"
                height="wrap_content"
                gravity="center_vertical"
                margin="0,0,0,0">

                <LinearLayout
                    orientation = "vertical"
                    width="wrap_content"
                    height="wrap_content"
                    gravity="center_vertical">

                    <TextView
                        width="wrap_content"
                        height="wrap_content"
                        gravity="center_vertical"
                        text={window.__S.ENJOYED_THIS_CONTENT}
                        style={window.__TextStyle.textStyle.CARD.TITLE.DARK} />

                    <TextView
                        width="wrap_content"
                        height="wrap_content"
                        gravity="center_vertical"
                        text={window.__S.HELP_US_BY_RATING} />
                </LinearLayout>

                <ViewWidget
                    width="0"
                    weight="1"
                    height="0" />

                <ImageView
                    width="18"
                    height="18"
                    onClick={this.handleDismissClick}
                    gravity="top"
                    imageUrl="ic_action_close" />
            </LinearLayout>
        );
    }

    getContent = () => {
        return (
            <LinearLayout
                width = "match_parent"
                height = "wrap_content"
                orientation = "vertical"
                id = {this.idSet.starsContainer}
                layouTransition="true"/>
        );
    }

    getBody = () => {
        return (<LinearLayout
            cornerRadius="2"
            width="match_parent"
            height="wrap_content"
            root="true"
            visibility="visible"
            orientation="vertical"
            clickable="true"
            padding="16,18,16,16"
            background="#ffffff">

            {this.getHeader()}

            {this.getContent()}
        </LinearLayout>)
    }

    afterRender = () => {
        this.updateStars(-1);
    }

    render() {
        this.layout = (
            <LinearLayout
                height="match_parent"
                width="match_parent"
                id={this.idSet.parentContainer}
                visibility="gone"
                afterRender={this.afterRender}
                root="true"
                background={window.__Colors.PRIMARY_BLACK_44}
                orientation="vertical">

                <LinearLayout
                    height="0"
                    width="match_parent"
                    onClick={this.handleDismissClick}
                    weight="1" />

                {this.getBody()}
            </LinearLayout>
        );
        return this.layout.render();
    }
}

module.exports = RatingsPopup;
