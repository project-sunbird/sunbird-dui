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
        var numberSelected = 0;
        this.questions.map((item) => {
            if (item.selected.length != 0) numberSelected ++;
        });
        this.answeredAll = this.totalCards == numberSelected;

        this.questionMap = {
            "board": {
                question: "Which board does your school follow?"
                , option: "SELECT BOARD"
            }
            , "gradeLevel": {
                question: "Which class do you belong to?"
                , option: "SELECT CLASS"
            }
            , "subject": {
                question: "Which subjects are you looking for?"
                , option: "SELECT SUBJECT"
            }
            , "medium": {
                question: "What medium/language does your school teach in?"
                , option: "SELECT MEDIUM/LANG"
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
        //updated only when initialized
        return this.answeredAll;
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