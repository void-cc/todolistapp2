    $(document).ready(function () {

    //Add a todo item
    $('#add-todo-form').submit(function (e) {
        e.preventDefault();
        let todo_text = $('#toevoegen-todo').val();
        let todo_date = $('#toevoegen-todo-date').val();
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
                toevoegen_date: todo_date
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
        //console.log(msg);
        const jsonString = JSON.stringify(msg)
        let todo = JSON.parse(jsonString);
        // for each todo item create a div element
        console.log('Printing todo');
        //let form = '<form method="POST">';
        //$("#todo-list").append(form);
        for(let i = 0; i < Object.keys(todo).length; i++){
    // if button exists with same todo id, remove it
            if($('#todo-id-' + todo[i].id).length){
                $('#todo-id-' + todo[i].id).remove();
            }
            let todo_toggle_button;
            let todo_date;
            let todo_list;
            if (todo[i].todo_done){
                todo[i].todo_text = '<s>' + todo[i].todo_text + '</s>';
                todo_toggle_button = '<button type="submit" class="todo-done" name="todo-done-back" value="' + todo[i].id + '">'
                todo_list = "#todo-list-done";
            }
            else {
                todo[i].todo_text = todo[i].todo_text;
                todo_toggle_button = '<button type="submit" class="todo-done" name="todo-done" value="' + todo[i].id + '">'
                todo_list = "#todo-list-undone";
            }
            if (todo[i].todo_date_overdue){
                todo_date = '<p class="todo-date-due text-red">' + todo[i].todo_date + '</p>';
            }
            else {
                todo_date = '<p class="todo-date-due">' + todo[i].todo_date + '</p>';
            }

            let todo_item = '<div id="todo-id-'+ todo[i].id + '" class="todo-item soft-border">' +
                todo_toggle_button +
                '</button><p class="todo-text"> ' + todo[i].todo_text + ' ' +
                '</p>' +
                todo_date +
                '<button type="submit" class="todo-edit fa-solid fa-pen" name="todo-edit" value="' + todo[i].id + '"' + '</button>' +
                '<button type="submit" class="todo-delete fa fa-trash-o" name="todo-delete" value="' + todo[i].id + '">' +
                '</button></div>';
            $(todo_list).append(todo_item);

            //console.log('cycle complete')
        }
        //let form_end = '</form>';
        //$("#todo-list").append(form_end);
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