(function($) {
    $.fn.stacktack = function(options) {
        var options = $.extend($.fn.stacktack.defaults, options);
        
        if (options.stylesheet)
        {
//            if ()
//            {
                var link = $('<link type="text/css" rel="stylesheet" href="' + options.stylesheet + '" title="stacktack">');
                $('head').append(link);
//            }
        }
        
        return this.each(function() {
            $(this).find('[id^=stacktack]').andSelf().filter('[id^=stacktack]').each(function(index, value) {
                var item = $(value);
                var questionId = /\d+$/.exec(value.id);

                $.ajax({
                    dataType: 'jsonp',
                    data: {
                        'type': 'jsontext',
                        'apikey':'kz4oNmbazUGoJIUyUbSaLg',
                        'body': 'true'
                    },
                    url: 'http://api.stackoverflow.com/0.8/questions/' + questionId[0] + '?jsonp=?',
                    success: function(data) {
                        var question = data.questions[0];
                        var containerElement = $('<div class="stacktack-container"></div>');
                        item.append(containerElement);
                        
                        var contentElement = $('<div class="stacktack-content"><img src="logo.png" alt="StackTack" class="stacktack-logo" /></div>');
                        containerElement.append(contentElement);

                        var questionElement = $('<div class="stacktack-question"> <div class="stacktack-question-header clearfix"><div class="stacktack-profile"><img src="http://www.gravatar.com/avatar/' + question.owner.email_hash + '?d=identicon&s=32" class="stacktack-gravatar" />' + question.owner.display_name + '<br/>' + question.owner.reputation + '</div> <h3>' + question.title + '</h3></div><div class="stacktack-question-body">' + question.body + '</div></div>');
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
                        for (var i = 0; i < question.answers.length; i++)
                        {
                            var answer = question.answers[i];
                            var answerElement = $('<div class="stacktack-answer"> <div class="stacktack-answer-header clearfix"><div class="stacktack-profile"><img src="http://www.gravatar.com/avatar/' + answer.owner.email_hash + '?d=identicon&s=32" class="stacktack-gravatar" />' + answer.owner.display_name + '<br/>' + answer.owner.reputation + '</div> <h4>Answer ' + (i + 1) + '</h4></div><div class="stacktack-answer-body">' + answer.body + '</div></div>');
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
        stylesheet: 'stacktack.css'
    };

})(jQuery);