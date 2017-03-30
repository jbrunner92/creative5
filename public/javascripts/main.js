$(document).ready(function(){
    $("#postComment").click(function(){
        var myobj = { comment:$("#comment").val(), likes: 0, created_by:
          "likes": "Number",
          "created_by": "String",
          "created_date_time": "date"
        jobj = JSON.stringify(myobj);

        $("#json").text(jobj);

        $.post('comment', myobj, function(data,textStatus) {
            $("#done").html(textStatus);
        });
    });

    $("#getComments").click(function() {
        $.getJSON('comment', function(data) {
            console.log(data);
            $('#commentsData').html('');

            var i = 0;
            for(var comment in data) {
                com = data[comment];
                $('<li id="comment_' + i + '_data" class="comment_data"><span id="name_' + i + '" class="name">').appendTo('#commentsData');
                $('#name_' + i).text(com.Name) +
                $('</span>: <span id="comment_' + i + '">').appendTo('#comment_' + i + '_data');
                $('#comment_' + i).text(com.Comment);
                i++;
            }
        });
    });

    $('#deleteComments').click(function() {
        $.ajax({
            url: 'comment',
            type: 'DELETE',
            success: function(data) {
                if (data === 'OK') {
                    $("#json").text('');
                    $('#done').html('All Comments successfully deleted!');
                    $("#commentsData").html('');
                }
            }
        });
    });
});
