document.addEventListener('DOMContentLoaded', function() {
        update();
        });

function update() {
    function handleDragStart(e) {
            this.style.opacity = '0.4';

            dragSrcEl = this;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
        }

        function handleDragEnd(e) {
            this.style.opacity = '1';

            items.forEach(function (item) {
                item.classList.remove('over');
            });
        }

        function handleDragOver(e) {
            e.preventDefault();
            return false;
        }

        function handleDragEnter(e) {
            this.classList.add('over');
        }

        function handleDragLeave(e) {
            this.classList.remove('over');
        }

        function handleDrop(e) {
            e.stopPropagation();
            if (dragSrcEl != this) {
                dragSrcEl.innerHTML = this.innerHTML;
                this.innerHTML = e.dataTransfer.getData('text/html');
            }
            return false;
        }

        let items = document.querySelectorAll('.tranferable');
        items.forEach(function(item) {
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragover', handleDragOver);
            item.addEventListener('dragenter', handleDragEnter);
            item.addEventListener('dragleave', handleDragLeave);

            item.addEventListener('dragend', handleDragEnd);
            item.addEventListener('drop', handleDrop);
        });
}

$(document).ready(function() {
    let socket = io.connect();
    socket.on('refreshTodoAgenda', function(data) {
        console.log('refreshTodoAgenda');
        const jsonString = JSON.stringify(data);
        let todoItems = JSON.parse(jsonString);
        for(let i = 0; i < Object.keys(todoItems).length; i++) {
            if($('#todo-agenda-item-' + todoItems[i].id).length) {
                $('#todo-agenda-item-' + todoItems[i].id).remove();
            }
            let todoItemHtml = '<div class="todo-item tranferable" id="todo-agenda-item-' + todoItems[i].id + '" draggable="true">' +
                '<div class="todo-item-title">' + todoItems[i].todo_date + '</div>' +
                '<div class="todo-item-description">' + todoItems[i].todo_text + '</div>' +
                '</div>';
            $('.todo-items').append(todoItemHtml);
        }
        update();
    });
    $('#todo-agenda-update').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/updateagenda',
            data: {
                nothing: 'nothing'
            },
            success: function (data) {
                console.log(data);
            }
        });
    });
});