class QuestionsFramework {
    constructor(framework) {
        this.frameworkJSON = framework;
        this.categories = this.frameworkJSON.categories;
        this.totalCards = this.categories.length;
        var answeredQs = JBridge.getFromSharedPrefs("answeredQs");
        if (answeredQs == "__failed") {
            this.questions = [];
            this.currIndex = -1;
        } else {
            this.questions = JSON.parse(answeredQs);
            this.currIndex = this.questions.length - 1;            
        }

        this.questionMap = {
            "board": {
                question: window.__S.BOARD_QUESTION
                , option: window.__S.BOARD_OPTION_TEXT
            }
            , "gradeLevel": {
                question: window.__S.GRADE_QUESTION
                , option: window.__S.GRADE_OPTION_TEXT
            }
            , "subject": {
                question: window.__S.SUBJECT_QUESTION
                , option: window.__S.SUBJECT_OPTION_TEXT
            }
            , "medium": {
                question: window.__S.MEDIUM_QUESTION
                , option: window.__S.MEDIUM_OPTION_TEXT
            }
        };
    }

    getTotalQs = () => {
        return this.totalCards;
    }

    getQFromFramework = (index) => {
        var nextQ;
        if (index == 0) {
            this.categories.map((item, i) => {
                if (item.index == index + 1) {
                    nextQ = {
                        identifier: item.identifier,
                        question: this.questionMap[item.code].question,
                        option: this.questionMap[item.code].option,
                        values: item.terms,
                        selected: [],
                        isCurr: true,
                        selectorType: "checkbox",
                        code: item.code
                    }
                }
            });
        } else {
            var nextQVals = [];
            var prevQ = this.questions[index - 1]; //get the previous question
            var associations = [];
            var ele = this.getEleAtIndex(this.categories, index + 1); //get the current question
            //check whether prev Q asnwer has any associations
            //merge associations to the next Q options, if present, else merge all the terms
            prevQ.selected.map((item, i) => {
                if (item.associations) {
                    item.associations.map((item) => {
                        if (associations.indexOf(item.identifier) == -1)
                            associations.push(item.identifier)
                    });
                } else {
                    ele.terms.map((item) => {
                        if (associations.indexOf(item.identifier) == -1)
                            associations.push(item.identifier)
                    });
                }
            });
            if (associations.length != 0){
                ele.terms.map((item) => {
                    if (associations.indexOf(item.identifier) != -1) nextQVals.push(item);
                });
            } else {
                nextQVals = ele.terms;
            }
            nextQ = {
                identifier: ele.identifier,
                question: this.questionMap[ele.code].question,
                option: this.questionMap[ele.code].option,
                values: nextQVals,
                selected: [],
                isCurr: true,
                selectorType: "checkbox",
                code: ele.code
            }
        }
        return nextQ;
    }

    isAllQsAnsweredAtInit = () => {
        var numberSelected = 0;
        this.questions.map((item) => {
            if (item.selected.length != 0) numberSelected++;
        });
        return this.totalCards == numberSelected;
    }

    getEleAtIndex = (arr, index) => {
        var ele;
        arr.map((item) => {
            if (item.index == index){
                ele = item;
            }
        });
        return ele;
    }

    addNextQ = () => {
        console.log("this.questions[" + this.currIndex + "] -> ", this.questions[this.currIndex]);
        
        if (this.currIndex + 1 != this.getTotalQs()) {
            if (this.currIndex != -1 && this.questions[this.currIndex].selected.length == 0) {
                return;
            }
            this.currIndex ++;
            var q = this.getQFromFramework(this.currIndex);
            if (q) this.questions.push(q);
        }
    }

    resetArr = (arr) => {
        this.questions = arr;
        JBridge.setInSharedPrefs("answeredQs", JSON.stringify(this.questions));
    }

    getAllQs = () => {
        return this.questions;
    }

    setAnswer = (index, data) => {
        if (index != this.currIndex) this.currIndex = index;
        this.questions[index] = data;
        this.questions = this.questions.slice(0, index + 1);
        JBridge.setInSharedPrefs("answeredQs", JSON.stringify(this.questions));
    }
}

module.exports = QuestionsFramework;