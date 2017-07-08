

/**This is to demo how to use different components**/

1.ClassListItem::

      <ClassListItem
        data={this.textData}
        itemClick={this.handleItemClick}
        lineSeparator="true"/> 

        this.textData = {
          type: "Subjects",
          values: [
            { color: "#10D50000", imageUrl: "ic_action_search", subject: "Dot Structure", logo:["ic_action_completed","ic_action_share"]},
            { color: "#F0E9FD", imageUrl: "ic_account", subject: "Hybridization", logo:["ic_action_completed","ic_action_share"] },
            { color: "#10E3C31C", imageUrl: "ic_action_search", subject: "Bond Line Structure", logo:["ic_action_completed","ic_action_share"] },
            { color: "#10FF9F00", imageUrl: "ic_action_search", subject: "Counting Electrons", logo:["ic_action_completed","ic_action_share"] },
            { color: "#10D50000", imageUrl: "ic_action_search", subject: "Dot Structure", logo:["ic_action_completed","ic_action_share"] },
          ]
        }

    handleItemClick = (itemNo,logoNo) =>{
    console.log(itemNo + " itemNo")
    console.log(logoNo + " logoNo")
  }

2.SearchToolbar:

      <SearchToolbar
        title="Sunbird"
        hint="Search here"
        invert="true"  //puts white background
        hideBack="true" //hides the backbutton
        onMenuItemClick={this.handleMenuClick}
        menuData={this.menuData}
        onSearch={this.handleSearch}/>

        other parameters :

          showAppIcon = "true"//shows app icon in toolbar. 
                              //title should not be set while using this property.



        this.menuData = {
          url: [
            { imageUrl: "ic_action_notification_blue" },
            { imageUrl: "ic_action_filter" },
            { imageUrl: "ic_action_search" }
          ]
        }


        handleMenuClick = (url) =>{
          console.log("menu item selected",url);
        }

        handleSearch=(data)=>{
          console.log("searched",data);
        }

  3.SimpleToolbar:

      /For the toolbars which don't need search functionality, use SimpleToolbar/

      <SimpleToolbar
            title=""
            width="match_parent"
            showMenu="true"
            invert="true" //shows white background
            hideBack="true" //hides back button
            menuData={this.menuData}
            onMenuItemClick={this.handleMenuClick}/>
            

      this.menuData = {
        url: [
          { imageUrl: "ic_action_notification_blue" },
          { imageUrl: "ic_action_filter" }
        ]
      }

      handleMenuClick = (url) =>{
        console.log("menu item selected",url);
      }


4.RatingBar:

            <RatingBar
              id = {this.idSet.ratingBar}
              width="wrap_content"
              height="wrap_content"/>
    

    
      JBridge.setRating(this.idSet.ratingBar,"3.3");

5.CardComponent

        <CardComponent 
         data={item}
         content={item}
         onCardClick = {this.handleCardClick}/>)


        handleCardClick = (content,type) =>{
           console.log("content is",content);
           console.log("type is ",type);
        }

/****************** Data for Card with progress bar and no star rating ************/
  this.data = [{
                imageUrl : "https://www.light.jpg",
                type : "COURSE",
                title : "Organic Chemistry",
                footerTitle : "20% done",
                footerSubTitle : "(2350) votes",
                actionText : "RESUME",//this will be button text
                isProgress : "true",//use when top progress is needed
              }]

/****************** Data for Card without progress bar but with star rating ************/

  this.data = [{
                imageUrl : "https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
                type : "COURSE",
                title : "Organic Chemistry for Std VII",
                footerSubTitle : "(2350) votes",
                stars:"4",
                actionText : "OPEN",
              }]

/****************** Data for Card with progress and star rating ************/


  this.data = [{
                imageUrl : "https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
                type : "COURSE",
                title : "Organic Chemistry for Std VII",
                footerTitle : "20% done",
                footerSubTitle : "(2350) votes",
                stars:"4",
                isProgress : "true",
                actionText : "OPEN",
              }]





























