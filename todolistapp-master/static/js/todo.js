    $(document).ready(function () {

    //Add a todo item
    $('#add-todo-form').submit(function (e) {
        e.preventDefault();
        let todo_text = $('#toevoegen-todo').val();
        let todo_date = $('#toevoegen-todo-date').val();
        let todo_tag = $('#toevoegen-todo-tags').val();
        let todo_tag_color = $('#toevoegen-todo-tags').val();
        console.log(todo_text);
        console.log(todo_date);
        if (todo_date === ''){
            todo_date = '0001-01-01T00:00';
        }
        $.ajax({
            type: 'POST',
            url: '/submit',
            data: {
                toevoegen: todo_text,
                toevoegen_date: todo_date,
                toevoegen_description: 'test description',
                toevoegen_tag: todo_tag,
                toevoegen_tag_color: todo_tag_color
            },
            success: function (data) {
                console.log(data);
                }
        });
    });
    //Delete a todo item
    $('#todo-list').on('click', '.todo-delete', function (e) {
        e.preventDefault();
        let todo_id = $(this).val();
        console.log(todo_id);
        $.ajax({
            type: 'POST',
            url: '/submit',
            data: {
                todo_delete: todo_id
            },
            success: function (data) {
                console.log(data);
            }
        });
    });

    //Toggle todo item done/undone
    $('#todo-list').on('click', 'button[name="todo-done"]', function (e) {
        e.preventDefault();
        let todo_id = $(this).val();
        console.log(todo_id);
        $.ajax({
            type: 'POST',
            url: '/submit',
            data: {
                todo_done: todo_id
            },
            success: function (data) {
                console.log(data);
            }
        });
    });

    //Toggle todo item undone/done
    $('#todo-list').on('click', 'button[name="todo-done-back"]', function (e) {
        e.preventDefault();
        let todo_id = $(this).val();
        console.log(todo_id);

        $.ajax({
            type: 'POST',
            url: '/submit',
            data: {
                todo_done_back: todo_id
            },
            success: function (data) {
                console.log(data);
            }
        });
    });

    $('#todo-list').on('click', 'button[name="todo-edit"]', function (e) {
        e.preventDefault();
        let todo_id = $(this).val();
        console.log(todo_id);
        let todo_text = $('#todo-id-' + todo_id + ' .todo-text').text();
        let todo_date = $('#todo-id-' + todo_id + ' .todo-date-due').text();
        console.log(todo_text);
        $('#todo-id-' + todo_id + ' .todo-text').replaceWith('<input type="text" id="edit-todo-' + todo_id + '" value="' + todo_text + '">');
        $('#todo-id-' + todo_id + ' .todo-date-due').replaceWith('<input type="datetime-local" id="edit-todo-date-' + todo_id + '" value="' + todo_date + '">');
        $('#todo-id-' + todo_id + ' .todo-edit').replaceWith('<button type="submit" class="todo-edit-save" name="todo-edit-save" value="' + todo_id + '">Save</button>');
    });

    $('#todo-list').on('click', 'button[name="todo-edit-save"]', function (e) {
        e.preventDefault();
        let todo_id = $(this).val();
        console.log(todo_id);
        let todo_text = $('#edit-todo-' + todo_id).val();
        console.log(todo_text);
        let todo_date = $('#edit-todo-date-' + todo_id).val();
        $.ajax({
            type: 'POST',
            url: '/submit',
            data: {
                todo_id: todo_id,
                todo_edit_text: todo_text,
                todo_edit_date: todo_date
            },
            success: function (data) {
                console.log(data);
            }
        });
    });






 //connect to server
  let socket = io.connect();
    //receive details from server
    socket.on('refreshTodoList', function(msg) {
    console.log("Received message");
    const jsonString = JSON.stringify(msg)
    let todo = JSON.parse(jsonString);
    console.log('Printing todo');
    let date = new Date();
    let todayLength = 0;
    let tomorrowLength = 0;
    let upcomingLength = 0;

    for(let i = 0; i < Object.keys(todo).length; i++){
        if($('#todo-id-' + todo[i].id).length){
            $('#todo-id-' + todo[i].id).remove();
        }


        if (todo[i].todo_date === '0001-01-01 00:00:00'){
            todo[i].todo_date = 'No due date';
        }
        else {
            let todo_date = new Date(todo[i].todo_date);
            let timeDiff = todo_date.getTime() - date.getTime();
            let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (diffDays === 0){
                todayLength++;
            }
            else if (diffDays === 1){
                tomorrowLength++;
            }
            else if (diffDays > 1){
                upcomingLength++;
            }
        }

        let todo_toggle_button;
        let todo_date;
        let todo_list;
        let todo_text;

        if (todo[i].todo_done){
            todo_text = '<s><p class="todo-text">' + todo[i].todo_text + '</p></s>';
            todo_toggle_button = '<button type="submit" id="todo-done-' + todo[i].id + '" class="todo-done" name="todo-done-back" value="' + todo[i].id + '"></button>';
        }
        else {
            todo_text = '<p class="todo-text">' + todo[i].todo_text + '</p>';
            todo_toggle_button = '<button type="submit" id="todo-done-' + todo[i].id + '" class="todo-done" name="todo-done" value="' + todo[i].id + '"></button>';
        }

        if (todo[i].todo_date_overdue){
            todo_date = '<p class="todo-text text-red">' + todo[i].todo_date + '</p>';
        }
        else {
            todo_date = '<p class="todo-date-due">' + todo[i].todo_date + '</p>';
        }

        let todo_item =
            '<div id="todo-id-' + todo[i].id + '" class="todo-item soft-border">' +
                todo_toggle_button + ' ' +
                todo_text +
                todo_date +
                '<div id="at-the-end-todo">' +
                    '<div class="tags">' +
                        '<div class="tag" style="background-color:' + todo[i].todo_tags[1] + '">' +
                            '<p class="tag"></p>' +
                        '</div>' +
                    '</div>' +
                    '<button type="submit" class="todo-edit fa-solid fa-pen" name="todo-edit" value="' + todo[i].id + '"></button>' +
                    '<button type="submit" class="todo-delete fa fa-trash-o" name="todo-delete" value="' + todo[i].id + '"></button>' +
                '</div>' +
            '</div>';

        $('#todo-list-undone').append(todo_item);
    }

    //update length of inbox
    $('#inbox-length').text(Object.keys(todo).length);
    $('#today-length').text(todayLength);
    $('#tomorrow-length').text(tomorrowLength);
    $('#upcoming-length').text(upcomingLength);

});



    socket.on('updateTodoList', function(msg) {
        console.log("Received message");
        //console.log(msg);
        const jsonString = JSON.stringify(msg)
        let todo = JSON.parse(jsonString);
        let todo_item = '<div class="todo-item soft-border"><button type="submit" class="todo-done" name="todo-done" value="' + todo.id + '"></button><p class="todo-text">' + todo.todo_text + '</p><button type="submit" class="todo-delete fa fa-trash-o" name="todo-delete" value="' + todo.id + '"></button></div>';
        $("#todo-list").append(todo_item);
    });
    socket.on('removeTodo', function(msg) {
        console.log("Remove message recieved");
        //console.log(msg);
        //const jsonString = JSON.stringify(msg)
        //let todo = JSON.parse(jsonString);
        $('#todo-id-' + msg).remove();
    });
 });



document.addEventListener("DOMContentLoaded", function() {
  var selected = document.querySelector(".select-selected");
  var items = document.querySelector(".select-items");
  var hiddenInput = document.getElementById("toevoegen-todo-tags");

  selected.addEventListener("click", function() {
    items.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });

  var options = items.getElementsByClassName("tag");
  for (var i = 0; i < options.length; i++) {
    options[i].parentNode.addEventListener("click", function() {
      var value = this.querySelector(".tag").getAttribute("data-value");
      selected.innerHTML = this.innerHTML;
      selected.style.backgroundColor = this.querySelector(".tag").style.backgroundColor;
      hiddenInput.value = value;
      var sameAsSelected = items.getElementsByClassName("same-as-selected");
      for (var j = 0; j < sameAsSelected.length; j++) {
        sameAsSelected[j].classList.remove("same-as-selected");
      }
      this.classList.add("same-as-selected");
      items.classList.add("select-hide");
    });
  }

  document.addEventListener("click", function(event) {
    if (!event.target.matches('.select-selected')) {
      items.classList.add("select-hide");
      selected.classList.remove("select-arrow-active");
    }
  });
});

