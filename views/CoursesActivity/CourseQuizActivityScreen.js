var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var TextView = require('@juspay/mystique-backend').androidViews.TextView;
var ViewWidget = require('@juspay/mystique-backend').androidViews.ViewWidget;
var RecyclerView = require('@juspay/mystique-backend').androidViews.RecyclerView;

///////not used

var objectAssign = require('object-assign');

window.R = require("ramda");

var SimpleToolbar = require('../../components/Sunbird/SimpleToolbar');
var AnswerView = require('../../components/Sunbird/AnswerView');
var CountDownTimer = require('../../components/Sunbird/CountDownTimer');
var HorizontalProgressBar = require("../../components/Sunbird/HorizontalProgressBar");
var PageOption = require("../../components/Sunbird/PageOption");


class CourseQuizActivityScreen
extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      "parentContainer",
      "recylerView",
      "currentQuestionHolder",
      "quizContainer"
    ]);
    this.state = state;
    this.screenName = "COURSE_QUIZ_ACTIVITY_SCREEN"
    this.currentQuestion = 1;
    this.shouldCacheScreen = false;
    this.menuData = {
      url: [
        { imageUrl: "ic_action_search", title: "hello" }
      ]
    }

    this.data = {
      type: "ASSIGNMENT",
      totalQuestion: "7",
      quizSet: [{
        question: "Which type of progression is the following sequence? 3, 5, 8, 12, 17, …",
        answers: [{ key: "Arithemetic" },
          { key: "Geometric" },
          { key: "None of these" },
          { key: "GIF" }
        ]
      }, {
        question: "Quiz Question 2",
        answers: [{ key: "Answer 2a" },
          { key: "Answer 2b" },
          { key: "Answer 2c" },
          { key: "Answer 2d" },
          { key: "Answer 2e" }
        ]
      }, {
        question: "Quiz Question 3",
        answers: [{ key: "Answer 3a" },
          { key: "Answer 3b" },
          { key: "Answer 3c" }
        ]
      }, {
        question: "Quiz Question 4",
        answers: [{ key: "Answer 4a" },
          { key: "Answer 4b" },
          { key: "Answer 4c" },
          { key: "Answer 4d" },
          { key: "Answer 4e" },
          { key: "Answer 4f" }
        ]
      }, {
        question: "Quiz Question 5",
        answers: [{ key: "Arithemetic", imageUrl: "http://hdwallpaperia.com/wp-content/uploads/2013/11/Skull-Designs-Wallpaper.jpg" },
          { key: "Geometric", imageUrl: "http://hdwallpaperia.com/wp-content/uploads/2013/10/Apple-HD-Wallpapers-640x400.jpg" },
          { key: "None of these", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgGp8lh4h-oxj9gxs_-P6j0wu1omNcxBJQGw8TAoaGx1j6dFesQQ" },
          { key: "GIF", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" }
        ]
      }, {
        question: "Quiz Question 6",
        answers: [{ key: "Arithemetic", imageUrl: "http://hdwallpaperia.com/wp-content/uploads/2013/11/Skull-Designs-Wallpaper.jpg" },
          { key: "Geometric", imageUrl: "http://hdwallpaperia.com/wp-content/uploads/2013/10/Apple-HD-Wallpapers-640x400.jpg" },
          { key: "None of these", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgGp8lh4h-oxj9gxs_-P6j0wu1omNcxBJQGw8TAoaGx1j6dFesQQ" },
          { key: "GIF", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" }
        ]
      }, {
        question: "Quiz Question 7",
        answers: [{ key: "Arithemetic", imageUrl: "http://hdwallpaperia.com/wp-content/uploads/2013/11/Skull-Designs-Wallpaper.jpg" },
          { key: "Geometric", imageUrl: "http://hdwallpaperia.com/wp-content/uploads/2013/10/Apple-HD-Wallpapers-640x400.jpg" },
          { key: "None of these", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgGp8lh4h-oxj9gxs_-P6j0wu1omNcxBJQGw8TAoaGx1j6dFesQQ" },
          { key: "GIF", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" }
        ]
      }]
    };
    this.selectedAnswer = [];

  }


  afterRender = () => {

  }

  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
  }

  handleAnswerSelect = (index, status) => {
    if (status) {
      this.selectedAnswer.push(this.data.quizSet[this.currentQuestion - 1].answers[index])
    } else {
      //need to change logic here for multiple item selection if needed
      this.selectedAnswer = [];
    }
    for (var i = 0; i < this.data.quizSet[this.currentQuestion - 1].answers.length; i++) {
      if (i == index)
        continue;
      var AnswerViewItem = this.find("answer_view")[i];
      AnswerViewItem.setStatus(false);
    }
    console.log("SELECTED ANSWER", this.selectedAnswer)

  }


  handleBackPress = () => {
    this.state = R.merge(this.state, { event: 'goBack' })
    window.__runDuiCallback({ action: "goBack" });
  }

  handleSubmitClick = () => {
    if (this.currentQuestion > parseInt(this.data.totalQuestion)) {
      this.handleBackPress();
      return;
    }

    this.currentQuestion++;
    var HorizontalProgressBar = this.find("horizontal_progress_card")[0];
    HorizontalProgressBar.updateProgressBar(this.currentQuestion - 1);

    var cmd = this.set({
      id: this.idSet.currentQuestionHolder,
      text: (this.currentQuestion - 1) + ""
    })
    Android.runInUI(cmd, 0);

    this.replaceChild(this.idSet.quizContainer, this.getQuizCotent().render(), 0);

  }


  getQuestion = () => {
    return (<TextView
      text={this.data.quizSet[this.currentQuestion-1].question}
      style={window.__TextStyle.textStyle.CARD.HEADING}
      />)
  }


  renderList = () => {
    var jso = [];
    var count = 0;

    var answerCards = this.data.quizSet[this.currentQuestion - 1].answers.map((item, index) => {
      var tmp = (<AnswerView
            item={item}
            index={index}
            onItemSelected={this.handleAnswerSelect}
            height="wrap_content"
            width="match_parent"/>)
      var cmd = this.set({
        id: this.idSet.itemPosition,
        text: (index + 1)
      });
      cmd += this.set({
        id: this.idSet.itemText,
        text: item.key
      });
      jso.push({ view: this.getView(tmp.render()), value: cmd, viewType: 0 });

      return tmp;
    })

    JBridge.recyclerViewAdapter(this.idSet.recylerView, JSON.stringify(jso), 1, 1, 1);

  }


  getQuizHead = () => {
    var layout = (<LinearLayout
                height="wrap_content"
                orientation="vertical"
                margin="0,0,0,24"
                width="match_parent">

                    <CountDownTimer
                    height="wrap_content"
                    totalTime="600"
                    margin="0,0,0,24"
                    width="wrap_content" />

                    <TextView
                     text="Remaining time"
                     margin="0,0,0,24"
                     style={window.__TextStyle.textStyle.HINT.REGULAR} />

                    <LinearLayout
                        width="match_parent"
                        root="true"
                        gravity="center_vertical"
                        height="wrap_content">

                        <TextView
                            height="wrap_content"
                            width="wrap_content"
                            id={this.idSet.currentQuestionHolder}
                            text={this.currentQuestion-1}
                            style={window.__TextStyle.textStyle.HINT.REGULAR}/>

                        <TextView
                            height="wrap_content"
                            width="wrap_content"
                            text="/"
                            style={window.__TextStyle.textStyle.HINT.REGULAR} />

                        <TextView
                            height="wrap_content"
                            width="wrap_content"
                            text={this.data.totalQuestion}
                            padding="0,0,12,0"
                            style={window.__TextStyle.textStyle.HINT.REGULAR}/>

                         <HorizontalProgressBar
                              progressBarColor={window.__Colors.SUCCESS_GREEN}
                              currentProgress={this.currentQuestion-1}
                              totalProgress = {this.data.totalQuestion}
                              width="0"
                              weight="1"
                              height="wrap_content"/>


                     </LinearLayout>

                </LinearLayout>)

    return layout;
  }

  getAnswers = () => {
    var answerCards = this.data.quizSet[this.currentQuestion - 1].answers.map((item, index) => {
      return <AnswerView
            item={item}
            index={index}
            onItemSelected={this.handleAnswerSelect}
            height="56"
            width="match_parent"/>
    })

    var answerLayout = (<LinearLayout
            height="match_parent"
            width="match_parent"
            margin="0,24,0,0"
            root="true"
            orientation="vertical">
              {answerCards}
            </LinearLayout>)



    // var recylerViewLayout = (
    //   <RecyclerView
    //             margin="0,24,0,0"
    //             height="300"
    //             afterRender={this.renderList}
    //             width="300"
    //             id={this.idSet.recylerView}/>
    // )

    return answerLayout;
  }

  getQuizCotent = () => {
    return (<LinearLayout
        height="match_parent"
        width="match_parent"
        orientation="vertical"
        root="true">

            {this.getQuestion()}

            {this.getAnswers()}
        </LinearLayout>)
  }


  getSubmitButton = () => {
    var bItems = ["SUBMIT"]
    return (<LinearLayout
        height="wrap_content"
        width="match_parent"
        orientation="vertical">

        <TextView
            width="match_parent"
            gravity="right"
            text="Skip  >"
            margin="16,0,22,8"
            textStyle={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>
        <PageOption
            width="match_parent"
            buttonItems={bItems}
            hideDivider="false"
            onButtonClick={this.handleSubmitClick}/>
        </LinearLayout>)
  }


  render() {
    this.layout = (
      <LinearLayout
        root="true"
        background={window.__Colors.WHITE}
        orientation="vertical"
        width="match_parent"
        height="match_parent">

        <SimpleToolbar
          onBackPress={this.handleBackPress}
          title={this.data.type}
          menuData={this.menuData}
          width="match_parent"/>

            <ScrollView
              height="0"
              weight="1"
              width="match_parent"
              fillViewPort="true">
              <LinearLayout
                height="match_parent"
                width="match_parent"
                padding="16,24,16,16"
                orientation="vertical">

                {this.getQuizHead()}

                
                <LinearLayout
                  width="match_parent"
                  height="match_parent"
                  root="true"
                  orientation="vertical"
                  id={this.idSet.quizContainer}>

                  {this.getQuizCotent()}

                </LinearLayout>  




                </LinearLayout>


             </ScrollView>

            {this.getSubmitButton()}


      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(CourseQuizActivityScreen);
