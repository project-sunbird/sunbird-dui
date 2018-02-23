var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
window.R = require("ramda");
var debounce = require("debounce")

var LinearLayout  = require("@juspay/mystique-backend").androidViews.LinearLayout ;
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");

//Components
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var BatchCard = require('../components/Sunbird/BatchCard');
var HomeQuestionCardStyle = require('../components/Sunbird/HomeQuestionCardStyle');


//Utils
var utils = require('../utils/GenericFunctions');
/*******************************
*    ScreenCode is defined here
*******************************/
var _this;
class ViewBatchActivity extends View {
    constructor(props, children, state) {
        super(props, children);
        this.state = state;

        this.setIds([
          "chooserPopup",
          "batchTypeTextView",
          "batchListContainer",
          "viewOnGoingContainer",
          "viewUpComingContainer"
        ]);

        _this = this;
        this.screenName = "ViewBatchActivity"
        this.extras=JSON.parse(this.state.data.value0.extras);

        //set false to disable caching
        this.shouldCacheScreen = false
        this.searchId = this.extras.identifier
        this.showChooser=false;

        setTimeout(() => {
            Android.runInUI(
                _this.animateView(),
                null
            );
        });

        this.handleTypeChange = debounce(this.handleTypeChange, 100);


    }

    onPop = (type) => {
        Android.runInUI(
            _this.animateView(),
            null
        );
    }

    onBackPressed = () => {
      var whatToSend = []
      var event = { tag: 'BACK_ViewBatchActivity', contents: whatToSend }
      window.__runDuiCallback(event);
    }

    toggleBatchTypeChooser = () => {
      this.showChooser = !this.showChooser;
      Android.runInUI(this.set({
        id : this.idSet.chooserPopup,
        visibility :this.showChooser?"visible":"gone"
      }),0);

    }


    handleTypeChange = (type)=> {
        this.curentType=type;
      var cmd=this.set({
        id : this.idSet.batchTypeTextView,
        text : type
      });
        cmd+=this.set({
          id: this.idSet.viewOnGoingContainer,
          visibility : (type=== window.__S.VIEW_ONGOING_BATCHES)?"gone":"visible"
        })
        cmd+=this.set({
          id: this.idSet.viewUpComingContainer,
          visibility : (type=== window.__S.VIEW_ONGOING_BATCHES)?"visible":"gone"
        })

      Android.runInUI(cmd,0)

      if( type=== window.__S.VIEW_ONGOING_BATCHES ){
        this.replaceChild(_this.idSet.batchListContainer,_this.getBatchesList(this.ongoingList,"1").render(),0);
      } else{
        this.replaceChild(_this.idSet.batchListContainer,_this.getBatchesList(this.upComingList,"0").render(),0);
      }
    }

    afterRender = () => {

        if(JBridge.isNetworkAvailable()){
        var request = {
                      "filters": {
                          "courseId":  this.searchId
                      }
                  }

          var whatToSend = {"user_token":window.__user_accessToken,"api_token": window.__apiToken, request : JSON.stringify(request)}
          var event ={ "tag": "API_Get_Batch_list", contents: whatToSend};
          window.__LoaderDialog.show();
          window.__runDuiCallback(event);

      }else{
        window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE)
      }
    }

    onBackPressed = () => {
     var whatToSend = []
     var event = { tag: 'BACK_ViewBatchActivity', contents: whatToSend }

     window.__runDuiCallback(event);
    }

    requestUserDetails = (userId) => {
      var whatToSend = {
        user_token: userId,
        api_token: window.__apiToken
       }
      var event = { tag: "API_BatchCreator", contents: whatToSend}
      if (JBridge.isNetworkAvailable()){
        window.__runDuiCallback(event);
      }
    }

    updateUserDetailsInBatchList = (user) => {
      var oldList = this.batchList;
      this.batchList = oldList.map((item)=>{
        var batch=item;
        if(batch.createdBy == user.id){
          batch.createdByName= user.firstName + " " + ( user.lastName || "")
        }
        return batch;
      })
      this.upComingList=[];
      this.ongoingList=[];
      this.batchList.map((item)=>{
        if(item.enrollmentType == "open"){
          if(item.status==1){
            this.ongoingList.push(item);
          }else{
            this.upComingList.push(item);
          }
        }
      })
      this.handleTypeChange(this.curentType);

    }

    handleStateChange = (state) => {

     var res = utils.processResponse(state);
      var status,response,responseCode,responseUrl;

      // if(state.response != ""){
       status = res.status;
       response = res.data;
       responseCode = res.code;
       responseUrl = res.url;
      // }


      if (parseInt(responseCode) != 200
         && (!((state.responseFor=="API_BatchCreator")&&(parseInt(responseCode)==400)))){
        window.__LoaderDialog.hide();
        window.__Snackbar.show(window.__S.RETRY_ACTION)
        return;
      }

      var result = response.result;

      if (res.err) {
        window.__LoaderDialog.hide();
        window.__Snackbar.show(res.err)
        return;
      }

      console.log("RESPONSE FOR IN COURSE INFO",state.responseFor)

      switch (state.responseFor + "") {

        case "API_EnrollInBatch":
          window.__LoaderDialog.hide();
          if (result.response == "SUCCESS") {
            var enrolledCourse = {
              "dateTime": "2017-08-22 13:25:36.034",
              "identifier": this.courseDetails.courseId,
              "enrolledDate": utils.formatDate(new Date()),
              "addedBy": "",
              "delta": "delta",
              "contentId": this.courseDetails.courseId,
              "description": "dsds",
              "active": true,
              "courseLogoUrl": null,
              "batchId": this.courseDetails.batchId,
              "userId": window.__userToken,
              "courseName": "",
              "leafNodesCount": 4,
              "progress": 0,
              "courseId": this.courseDetails.courseId,
              "status": 0
            }
            this.extras.batchId=this.courseDetails.batchId

            window.__enrolledCourses.push(enrolledCourse);
            console.log("extras",this.extras)
            window.__Snackbar.show(window.__S.COURSE_ENROLLED)
            var whatToSend = { "course": JSON.stringify(this.extras)}
            var event = { tag: 'OPEN_EnrolledActivity_BATCH', contents: whatToSend }
            window.__runDuiCallback(event);
          } else {
            window.__Snackbar.show(window.__S.RETRY_ACTION);
          }
          break;


        case "API_Get_Batch_list":

          window.__LoaderDialog.hide();
          this.batchList=result.response.content;
          this.upComingList=[];
          this.ongoingList=[];
          this.batchList.map((item)=>{
            if(item.enrollmentType == "open"){
              if(item.status==1){
                this.ongoingList.push(item);
              }else{
                this.upComingList.push(item);
              }
            }
          })

          this.handleTypeChange(window.__S.VIEW_ONGOING_BATCHES);

          break;

        case "API_BatchCreator":
          this.updateUserDetailsInBatchList(result.response)
          break;

        default:


          break;


      }

    }

    getBatchTypeHead = () => {
      return (
        <LinearLayout
        height="wrap_content"
        width="match_parent"
        gravity="center_vertical"
        background={window.__Colors.LIGHT_GRAY}>

            <TextView
              id={this.idSet.batchTypeTextView}
              height="wrap_content"
              width="0"
              weight="1"
              padding="16,4,16,4"
              text={window.__S.VIEW_ONGOING_BATCHES}
              style={window.__TextStyle.textStyle.CARD.TITLE.DARK_14}/>

              <LinearLayout
                height="38"
                width="wrap_content"
                orientation="vertical">

                <ImageView
                  height="38"
                  width="38"
                  padding="12,12,12,12"
                  allowMultipleClicks="true"
                  onClick={this.toggleBatchTypeChooser}
                  imageUrl="ic_action_arrow_down"/>

              </LinearLayout>




      </LinearLayout>)
    }

    handleBatchEnrollClick = (batch) => {

      if(JBridge.isNetworkAvailable()){

          window.__LoaderDialog.show();
         this.courseDetails = {
              "delta": "delta",
              "contentId": this.searchId,
              "batchId": batch.id,
              "userId": window.__userToken,
              "courseName": "Enrollment 3",
              "courseId": this.searchId,
              "delta" : "delta"
            }
          var whatToSend = {
          "reqParams": JSON.stringify(this.courseDetails),
          "user_token" : window.__user_accessToken,
          "api_token": window.__apiToken }
          var event = {
            "tag": "API_EnrollInBatch",
            "contents": whatToSend
          }
          //courseDetails
          window.__runDuiCallback(event);
      }
      else{
        window.__Snackbar.show(window.__S.ERROR_OFFLINE_MODE)
      }
    }

    getBatchTypeChoser = () => {
      return (<LinearLayout
                id={this.idSet.chooserPopup}
                height="wrap_content"
                layouTransition="true"
                width="match_parent"
                visibility={this.showChooser?"visible":"gone"}
                orientation="vertical">


                <LinearLayout
                          height="wrap_content"
                          width="match_parent"
                          id={this.idSet.viewOnGoingContainer}
                          orientatio="vertical"
                          onClick={()=>{
                            _this.toggleBatchTypeChooser();
                            _this.handleTypeChange(window.__S.VIEW_ONGOING_BATCHES)
                          }}>

                      <TextView
                        height="wrap_content"
                        width="match_parent"
                        padding="20,4,16,4"
                        background={window.__Colors.LIGHT_GRAY}
                        text={window.__S.VIEW_ONGOING_BATCHES}/>

                </LinearLayout>

                <LinearLayout
                          height="wrap_content"
                          width="match_parent"
                          orientatio="vertical"
                          id={this.idSet.viewUpComingContainer}
                          onClick={()=>{
                            _this.toggleBatchTypeChooser();
                            _this.handleTypeChange(window.__S.VIEW_UPCOMING_BATCHES)
                          }}>

                      <TextView
                        height="wrap_content"
                        width="match_parent"
                        padding="20,4,16,4"
                        background={window.__Colors.LIGHT_GRAY}
                        text={window.__S.VIEW_UPCOMING_BATCHES}/>

                </LinearLayout>


      </LinearLayout>)
    }


    getBatchesList = (batchList,batchStatus) => {
      console.log((window.__HEIGHT-300))
      if(batchList.length==0){
        return (
          <LinearLayout
            height="match_parent"
            root="true"
            gravity="center"
            alpha="0.33"
            margin="0,150,0,0"
            width="match_parent"
            orientation="vertical">

            <ImageView
            width="100"
            height="100"
            imageUrl="ic_no_batch"
            gravity="center"/>

            <TextView
            height = "wrap_content"
            width = "wrap_content"
            margin="0,30,0,0"
            gravity="center"
            style={window.__TextStyle.textStyle.HEADING.DARK}
            text = {window.__S.ERROR_NO_BATCHES_FOUND}/>


          </LinearLayout>
        )
      }
      var cards = batchList.map((item)=>{
          return (<LinearLayout
                    height="wrap_content"
                    width="match_parent"
                    orientatio="vertical">

                    <BatchCard
                      height="wrap_content"
                      width="match_parent"
                      batch={item}
                      batchStatus={batchStatus}
                      onRequestCreator={this.requestUserDetails}
                      onEnrollClick={()=>{
                        this.handleBatchEnrollClick(item);
                      }}/>

                  </LinearLayout>)
        })

        return (<LinearLayout
                  id={this.idSet.chooserPopup}
                  height="wrap_content"
                  layouTransition="true"
                  width="match_parent"
                  orientation="vertical">


                    { cards }


                  </LinearLayout>)
    }

    getSignInOverlay = () =>{
      if(window.__loggedInState && window.__loggedInState=="GUEST"){
       return (
         <LinearLayout
          height = "match_parent"
          gravity = "center_vertical"
          transparent = "true"
          background={"#FFFFFF"}
          alpha = "0.9"
          clickable="true">
         <HomeQuestionCardStyle
             currComponentLocation={"COURSE"}
          headerText = {window.__S.OVERLAY_LABEL_TAKE_COURSE}
          infoText = {window.__S.OVERLAY_INFO_TEXT_TAKE_COURSE}/>
         </LinearLayout>
       )
     }else {
       return (<LinearLayout/>)
     }
    }

    render() {
      this.layout = (
          <LinearLayout
              width="match_parent"
              height="match_parent"
              background={window.__Colors.WHITE}
              orientation="vertical"
              root="true"
              layouTransition="true"
              clickable="true">

              <SimpleToolbar
                title={window.__S.BATCHES_FOR_THIS_COURSE}
                onBackPress={this.onBackPressed}
                width="match_parent"/>
              <RelativeLayout>
                <LinearLayout
                  orientation = "vertical"
                  width = "match_parent">
                  {this.getBatchTypeHead()}

                  {this.getBatchTypeChoser()}
                  <ScrollView
                    height="match_parent"
                    width="match_parent"
                    fillViewPort="true">

                    <LinearLayout
                      id={this.idSet.batchListContainer}
                      height="match_parent"
                      width="match_parent"
                      orientation="vertical"
                      gravity="center"/>

                  </ScrollView>
                </LinearLayout>
              {this.getSignInOverlay()}
              </RelativeLayout>
          </LinearLayout>
    );
    return this.layout.render();
    }



}

module.exports = Connector(ViewBatchActivity)
