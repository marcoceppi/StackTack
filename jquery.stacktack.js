(function($) {
    $.fn.stacktack = function(options) {
        var options = $.extend($.fn.stacktack.defaults, options);
        
        if (options.stylesheet)
        {
            // only include the stylesheet once
            if ($('link[title=stacktack]'))
            {
                var link = $('<link type="text/css" rel="stylesheet" href="' + options.stylesheet + '" title="stacktack">');
                $('head').append(link);
            }
        }
        
        function createProfile(user)
        {
            return '<div class="stacktack-profile"><img src="http://www.gravatar.com/avatar/' + user.email_hash + '?d=identicon&s=32" class="stacktack-gravatar" /><a href="http://www.' + options.site + '/users/' + user.user_id  + '" target="_blank">' + user.display_name + '</a><br/>' + user.reputation + '</div>'
        }
        
        return this.each(function() {
            var $this = $(this);
            $this.filter('id^=something').add($this.find('[id^=stacktack]')).each(function(index, value) {
                var item = $(value);
                var questionId = /\d+$/.exec(value.id);

                $.ajax({
                    dataType: 'jsonp',
                    data: {
                        'type': 'jsontext',
                        'apikey':'kz4oNmbazUGoJIUyUbSaLg',
                        'body': 'true'
                    },
                    url: 'http://api.' + options.site + '/' + options.apiVersion + '/questions/' + questionId[0] + '?jsonp=?',
                    success: function(data) {
                        var question = data.questions[0];

                        var containerElement = $('<div class="stacktack-container"></div>');
                        item.append(containerElement);
                        
                        var contentElement = $('<div class="stacktack-content"><img src="logo.png" alt="StackTack" class="stacktack-logo" /></div>');
                        containerElement.append(contentElement);

                        var questionElement = $('<div class="stacktack-question"> <div class="stacktack-question-header clearfix">' + createProfile(question.owner) + '<h3><a href="http://www.' + options.site + '/questions/' + question.question_id + '" target="_blank">' + question.title + '</a></h3></div><div class="stacktack-question-body">' + question.body + '</div></div>');
                        contentElement.append(questionElement);

                        var tagsElement = $('<ul class="stacktack-tags"></ul>');
                        for (var i = 0; i < question.tags.length; i++)
                        {
                            var tagElement = $('<li>' + question.tags[i] + '</li>');
                            tagsElement.append(tagElement);
                        }
                        questionElement.append(tagsElement);

                        var answersElement = $('<div class="stacktack-answers"></div>');
                        contentElement.append(answersElement);
                        
                        // filter the answers
                        var answers = question.answers;
                        // determines if the "more answers" button should be displayed
                        var isFiltered = false;
                        if (answers.length > 0)
                        {
                            if (options.onlyShowAcceptedAnswer)
                            {
                                for (var i = 0; i < question.answers.length; i++)
                                {
                                    if (question.answers[i].accepted)
                                    {
                                        answers = [question.answers[i]];
                                        break;
                                    }
                                }
                                isFiltered = true;
                            }
                            else if (options.filterAnswers.length > 0)
                            {
                                answers = new Array();
                                for (var i = 0; i < question.answers.length; i++)
                                {
                                    if ($.inArray(question.answers[i].answer_id, options.filterAnswers) > -1)
                                    {
                                        answers.push(question.answers[i]);
                                    }
                                }
                                isFiltered = true;
                            }
                            else if (options.answerLimit > 0)
                            {
                                answers = question.answers.slice(0, options.answerLimit);
                                isFiltered = true;
                            }
                        }
                        
                        // render the answers
                        for (var i = 0; i < answers.length; i++)
                        {
                            var answer = answers[i];
                            var answerElement = $('<div class="stacktack-answer"> <div class="stacktack-answer-header clearfix">' + createProfile(answer.owner) + '<h4><a href="http://www.' + options.site + '/questions/' + question.question_id + '#' + answer.answer_id + '" target="_blank">Answer ' + (i + 1) + '</a></h4></div><div class="stacktack-answer-body">' + answer.body + '</div></div>');
                            answersElement.append(answerElement);
                            if (answer.accepted)
                            {
                                answerElement.addClass('stacktack-answer-accepted');
                            }
                        }
                        
                        // make all links open in a new window
                        containerElement.find('a').attr('target', '_blank');
                        
                        
                    }
                });
            });
        });
    };

    $.fn.stacktack.defaults = {
        site: 'stackoverflow.com',
        apiVersion: 0.8,
        stylesheet: 'stacktack.css',
        answerLimit: 0,
        onlyShowAcceptedAnswer: false,
        filterAnswers: []
    };

})(jQuery);