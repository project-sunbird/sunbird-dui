var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var TextView = require('@juspay/mystique-backend').androidViews.TextView;
var RatingBar = require('@juspay/mystique-backend').androidViews.RatingBar;
var RecyclerView = require('@juspay/mystique-backend').androidViews.RecyclerView;



var objectAssign = require('object-assign');

window.R = require("ramda");

var SimpleToolbar = require('../../components/Sunbird/SimpleToolbar');
var AnswerView = require('../../components/Sunbird/AnswerView');
var AnswerWithImageView = require('../../components/Sunbird/AnswerWithImageView');

class CourseActivityScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      "parentContainer",
      "ratingBar",
      "recylerView"
    ]);
    this.state = state;
    this.screenName = "COURSE_ACTIVITY_SCREEN"

    // this.data = {
    //   type: "ASSIGNMENT",
    //   question: "Which type of progression is the following sequence? 3, 5, 8, 12, 17, …",
    //   answers: [{ key: "Arithemetic", imageUrl: "http://hdwallpaperia.com/wp-content/uploads/2013/11/Skull-Designs-Wallpaper.jpg" },
    //     { key: "Geometric", imageUrl: "http://hdwallpaperia.com/wp-content/uploads/2013/10/Apple-HD-Wallpapers-640x400.jpg" },
    //     { key: "None of these", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgGp8lh4h-oxj9gxs_-P6j0wu1omNcxBJQGw8TAoaGx1j6dFesQQ" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 1", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 2", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 3", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 4", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 5", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 6", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 7", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 8", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 9", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },
    //     { key: "GIF 10", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" },

    //   ]
    // };

    this.data = {
      type: "ASSIGNMENT",
      question: "Which type of progression is the following sequence? 3, 5, 8, 12, 17, …",
      answers: [{ key: "Arithemetic", imageUrl: "http://hdwallpaperia.com/wp-content/uploads/2013/11/Skull-Designs-Wallpaper.jpg" },
        { key: "Geometric", imageUrl: "http://hdwallpaperia.com/wp-content/uploads/2013/10/Apple-HD-Wallpapers-640x400.jpg" },
        { key: "None of these", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgGp8lh4h-oxj9gxs_-P6j0wu1omNcxBJQGw8TAoaGx1j6dFesQQ" },
        { key: "GIF", imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif" }
      ]
    };



    this.selectedAnswer = [];
    window.ratingChangeCallback = this.ratingChange;

  }

  ratingChange = (data) => {
    console.log("RATING CHANGE :", data)
  }

  afterRender = () => {
    // id, number of stars, (String) defaultRating , (String) editable
    JBridge.setUpRatingBAr(this.idSet.ratingBar, 5, "2.5", "false")

  }

  handleItemSelect = (index, status) => {
    if (status) {
      this.selectedAnswer.push(this.data.answers[index])
    } else {
      //need to change logic here for multiple item selection if needed
      this.selectedAnswer = [];
    }
    for (var i = 0; i < this.data.answers.length; i++) {
      if (i == index)
        continue;
      var AnswerViewItem = this.find("answer_view")[i];
      AnswerViewItem.setStatus(false);
    }
    console.log("SELECTED ANSWER", this.selectedAnswer)

  }


  getQuestion = () => {
    return (<TextView
      text={this.data.question}
      style={window.__TextStyle.textStyle.CARD.HEADING}
      />)
  }


  renderList = () => {
    var jso = [];
    var count = 0;

    var answerCards = this.data.answers.map((item, index) => {
      var tmp = (<AnswerView 
            item={item}
            index={index}
            onItemSelected={this.handleItemSelect}
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

  getAnswers = () => {
    var answerCards = this.data.answers.map((item, index) => {
      return <AnswerWithImageView 
            item={item}
            index={index}
            onItemSelected={this.handleItemSelect}
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


  render() {
    this.layout = (
      <LinearLayout
        root="true"
        background={window.__Colors.WHITE}
        orientation="vertical"
        width="match_parent"
        height="match_parent">

        <SimpleToolbar
          title={this.data.type}
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

                <RatingBar
                  height="wrap_content"
                  width="wrap_content"
                  id={this.idSet.ratingBar} 
                  margin="20,20,20,20" />
                {this.getQuestion()}
                  
                {this.getAnswers()}

                  
                </LinearLayout>
                  

             </ScrollView>   

            
        
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(CourseActivityScreen);
