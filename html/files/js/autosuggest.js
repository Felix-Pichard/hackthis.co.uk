$.fn.autosuggest = function() {
    this.each(function () {
        $self = $(this);

        $self.keyup(function(event) {
            $this = $(this);
            var caret = $this.getCursorPosition().end;
            var val = this.value + ' ';
            var word = /\S+$/.exec(val.slice(0, val.indexOf(' ', caret)));
            if (!word || word[0].substr(0,1) !== '@') {
                $this.siblings('.autosuggest').remove();
                return;
            }

            word = word[0].substr(1);
            
            //lookup word
            $.get('/files/ajax/autosuggest.php', {user: word}, function(data) {
                $this.siblings('.autosuggest').remove();
                
                var list = $('<ul>', {class: 'autosuggest'});
                if (data.status == false)
                    return;

                for (var i = 0; i < data.users.length; ++i) {
                    user = data.users[i];

                    var icon = $('<i>', {class: 'icon-addfriend'});
                    var link = $('<a>', {text: user.username, href: '#'+user.username});
                    if (user.friends == 1)
                        link.append(icon);
                    $('<li>').append(link).appendTo(list);
                }

                $this.after(list);
            }, 'json');
        });

        $self.parent().on('click', '.autosuggest a', function(e) {
            $this = $(this);
            e.preventDefault();

            $self = $this.closest('.autosuggest').siblings('textarea');

            $this.closest('.autosuggest').remove();
            var insert = this.hash.slice(1);

            tmp = $self.val() + ' ';

            var caret = $self.getCursorPosition().end;
            var wordEnd = tmp.indexOf(' ', caret);
            var word = /\S+$/.exec(tmp.slice(0, wordEnd));

            var start = tmp.substr(0, wordEnd-(word[0].length-1));
            var end = tmp.substr(wordEnd);

            var tmp = start + insert + end;
            $self.val(tmp).focus().setCursorPosition(start.length+insert.length+1);
        });
    });
};

$(function() {
    $('.suggest').autosuggest();
});