var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var callbackMapper = require("@juspay/mystique-backend").helpers.android.callbackMapper;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
window.R = require("ramda");


var LinearLayout  = require("@juspay/mystique-backend").androidViews.LinearLayout ;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

//Components
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var BatchCard = require('../components/Sunbird/BatchCard');

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
          "batchListContainer"
        ]);

        _this = this;
        this.screenName = "ViewBatchActivity"
        this.extras=JSON.parse(this.state.data.value0.extras);

        //set false to disable caching
        this.shouldCacheScreen = false
        this.searchId = this.extras.identifier || "do_2123138572751912961138";
        //this.extras.course.identifier = ( this.extras.course.identifier || "do_2123138572751912961138");

        setTimeout(() => {
            Android.runInUI(
                _this.animateView(),
                null
            );
        });

        this.showChooser=false;
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
      this.toggleBatchTypeChooser();
      Android.runInUI(this.set({
        id : this.idSet.batchTypeTextView,
        text : type
      }),0)

      if( type=== window.__S.VIEW_ONGOING_BATCH ){
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

          var whatToSend = {"user_token":window.__userToken,"api_token": window.__apiToken, request : JSON.stringify(request)}
          var event ={ "tag": "API_Get_Batch_list", contents: whatToSend};
          window.__LoaderDialog.show();
          window.__runDuiCallback(event);

      }else{
        JBridge.showSnackBar(window.__S.NO_INTERNET)
      }
    }

    onBackPressed = () => {
     var whatToSend = []
     var event = { tag: 'BACK_ViewBatchActivity', contents: whatToSend }

     window.__runDuiCallback(event);
    }

    handleStateChange = (state) => {

      console.log("STATE IN HANDLE STATE CHANGE",state)

      var status,response,responseCode,responseUrl;

      if(state.response != ""){
       status = state.response.status[0];
       response = JSON.parse(utils.decodeBase64(state.response.status[1]));
       responseCode = state.response.status[2];
       responseUrl = state.response.status[3];
      }



      if (parseInt(responseCode) != 200) {
        window.__LoaderDialog.hide();
        JBridge.showSnackBar(window.__S.RETRY_ACTION)
        return;
      }

      var result = response.result;

      if (response.params.err) {
        window.__LoaderDialog.hide();
        JBridge.showSnackBar(response.params.errmsg)
        return;
      }

      console.log("RESPONSE FOR IN COURSE INFO",state.responseFor)

      switch (state.responseFor + "") {

        case "API_EnrollInBatch":
          window.__LoaderDialog.hide();
          if (result.response == "SUCCESS") {
            console.log("response",response)
            var enrolledCourse = {
              "dateTime": "2017-08-22 13:25:36.034",
              "identifier": "c59575f7eaabf47e2a6a65b5666fdb5b6c04ab50121bb267142dad5996551908",
              "enrolledDate": utils.formatDate(new Date()),
              "addedBy": "88e0b93a-cb06-47dc-95db-411fc2612735",
              "delta": "delta",
              "contentId": this.courseDetails.courseId,
              "description": "dsds",
              "active": true,
              "courseLogoUrl": null,
              "batchId": this.courseDetails.batchId,
              "userId": "88e0b93a-cb06-47dc-95db-411fc2612735",
              "courseName": "Invite One JP",
              "leafNodesCount": 4,
              "progress": 0,
              "id": "c59575f7eaabf47e2a6a65b5666fdb5b6c04ab50121bb267142dad5996551908",
              "courseId": this.courseDetails.courseId,
              "status": 0
            }
            window.__enrolledCourses.push(enrolledCourse);
            console.log("enrolled course",enrolledCourse)
            window.__enrolledCourses.push(this.extras)
            JBridge.showSnackBar(window.__S.COURSE_ENROLLED)
            var whatToSend = { "course": JSON.stringify(this.extras)}
            var event = { tag: 'OPEN_EnrolledActivity_BATCH', contents: whatToSend }
            window.__runDuiCallback(event);
          } else {
            JBridge.showSnackBar(window.__S.RETRY_ACTION)
          }
          break;


        case "API_Get_Batch_list":

          window.__LoaderDialog.hide();
          this.batchList=result.response.content;
          console.log(this.batchList)
          this.upComingList=[];
          this.ongoingList=[];
          this.batchList.map((item)=>{
            console.log(item)
            if(item.status==1){
              this.ongoingList.push(item);
            }else{
              this.upComingList.push(item);
            }
          })
          console.log(this.ongoingList)
          console.log(this.upComingList)
          this.handleTypeChange(window.__S.VIEW_ONGOING_BATCH);

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
        background={window.__Colors.LIGHT_GRAY}>

            <TextView
              id={this.idSet.batchTypeTextView}
              height="wrap_content"
              width="0"
              weight="1"
              padding="16,4,16,4"
              text={window.__S.VIEW_ONGOING_BATCH}/>

              <LinearLayout
                height="32"
                width="wrap_content"
                orientation="vertical">

                <ImageView
                  height="32"
                  width="32"
                  padding="8,8,8,8,8"
                  onClick={this.toggleBatchTypeChooser}
                  imageUrl="ic_action_arrow_down"/>

              </LinearLayout>




      </LinearLayout>)
    }

    handleBatchEnrollClick = (batch) => {
      console.log("BATCH Clicked")

      if(JBridge.isNetworkAvailable()){

          window.__LoaderDialog.show();


        console.log("HANDLE ENROLL CLICK");
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
          "user_token" : window.__userToken,
          "api_token": window.__apiToken }
          var event = {
            "tag": "API_EnrollInBatch",
            "contents": whatToSend
          }
          //courseDetails
          window.__runDuiCallback(event);
      }
      else{
        JBridge.showSnackBar(window.__S.NO_INTERNET)
      }
    }

    getBatchTypeChoser = () => {
      var list= [
       window.__S.VIEW_ONGOING_BATCH,
       window.__S.VIEW_UPCOMING_BATCHES
      ]



      var cards = list.map((item)=>{
        return (<LinearLayout
          height="wrap_content"
          width="match_parent"
          orientatio="vertical"
          onClick={()=>{this.handleTypeChange(item)}}>

              <TextView
                height="wrap_content"
                width="match_parent"
                padding="20,4,16,4"
                background={window.__Colors.LIGHT_GRAY}
                text={item}/>

        </LinearLayout>)
      })

      return (<LinearLayout
                id={this.idSet.chooserPopup}
                height="wrap_content"
                layouTransition="true"
                width="match_parent"
                visibility="gone"
                orientation="vertical">


              { cards }


      </LinearLayout>)
    }


    getBatchesList = (batchList,batchStatus) => {

      if(batchList.length==0){
        return (
          <LinearLayout
            height="match_parent"
            root="true"
            width="match_parent"
            orientation="vertical">

            <TextView
              height="match_parent"
              width="match_parent"
              text="No Batch Found"/>


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
                invert="true"
                width="match_parent"/>


              {this.getBatchTypeHead()}

              {this.getBatchTypeChoser()}

              <ScrollView
                height="0"
                width="match_parent"
                weight="1"
                fillViewPort="true">

                <LinearLayout
                  id={this.idSet.batchListContainer}
                  height="match_parent"
                  width="match_parent"
                  orientation="vertical"/>

              </ScrollView>


          </LinearLayout>
    );
    return this.layout.render();
    }



}

module.exports = Connector(ViewBatchActivity)
