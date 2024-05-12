from datetime import datetime
from flask import Flask, render_template, request, session
from createengine import sessiondatabase as sdb
from sqlalchemy import select
from databasemodels import User
import todo_interacts as ti
from flask_socketio import SocketIO
from threading import Lock


# Background Thread
thread = None
thread_lock = Lock()

app = Flask(__name__)
app.secret_key = b'dwhbd'
socketio = SocketIO(app, cors_allowed_origins='*')


def background_thread():
    user_id = 1
    print('Updating todolist')
    while True:
        todo_info_dict = {}
        todo_info = ti.get_todo_function(user_id)
        i = 0
        for todo in todo_info:
            # convert datetime to string
            todo['todo_made_time'] = todo['todo_made_time'].strftime('%Y-%m-%d %H:%M:%S')
            todo['todo_date'] = todo['todo_date'].strftime('%Y-%m-%d %H:%M:%S')
            todo_info_dict[i] = todo
            i += 1
        socketio.emit('refreshTodoList', todo_info_dict)
        socketio.sleep(300)


def remove_todo_socketio(todo_id):
    socketio.emit('removeTodo', todo_id)


def update_todo_list_socketio():
    user_id = 1
    todo_info_dict = {}
    todo_info = ti.get_todo_function(user_id)
    i = 0
    for todo in todo_info:
        # convert datetime to string
        todo['todo_made_time'] = todo['todo_made_time'].strftime('%Y-%m-%d %H:%M:%S')
        todo['todo_date'] = todo['todo_date'].strftime('%Y-%m-%d %H:%M:%S')
        todo_info_dict[i] = todo
        i += 1
    socketio.emit('refreshTodoList', todo_info_dict)


def update_todo_list_socketio_agenda():
    user_id = 1
    todo_info_dict = {}
    todo_info = ti.get_todo_function(user_id)
    i = 0
    for todo in todo_info:
        # convert datetime to string
        todo['todo_made_time'] = todo['todo_made_time'].strftime('%Y-%m-%d %H:%M:%S')
        todo['todo_date'] = todo['todo_date'].strftime('%Y-%m-%d %H:%M:%S')
        todo_info_dict[i] = todo
        i += 1
    socketio.emit('refreshTodoAgenda', todo_info_dict)


@app.route('/', methods=['GET', 'POST'])
def homepage():
    if 'todo' not in session:
        session['todo'] = []
    if 'todo-done' not in session:
        session['todo-done'] = []
    user_id = 1

    if request.method == 'POST':
        ## Toevoegen van een nieuwe todo-item
        if 'toevoegen' in request.form:
            ti.add_to_todo(request.form['toevoegen'], user_id,
                           datetime.fromisoformat(
                               request.form['toevoegen_date']))

        # verwijderen van een todo-item
        elif 'todo_delete' in request.form:
            remove_todo_socketio(request.form['todo_delete'])
            ti.delete_todo(request.form['todo_delete'])

        # Todo-naar done maken
        elif 'todo_done' in request.form:
            ti.change_todo_to_done(request.form['todo_done'], True)

        # Todo terug naar todo maken
        elif 'todo_done_back' in request.form:
            ti.change_todo_to_done(request.form['todo_done_back'], False)

        # datum aanpassen van een todo-item
        elif 'todo-change-date' in request.form:
            ti.change_todo_date(request.form['todo-date'],
                                datetime.fromisoformat(
                                    request.form['todo-date-date']
                                                        )
                                )
        # return 0
    session['todo'] = ti.get_todo_function(user_id)

    return render_template('index.html',
                           todolist=session['todo'],
                           todolistdone=session['todo-done'])


@socketio.on('connect')
def connect():
    global thread
    print('Client connected')


@socketio.on('disconnect')
def disconnect():
    print('Client disconnected', request.sid)


@app.route('/submit', methods=['POST'])
def submit_todo():
    user_id = 1
    if request.method == 'POST':
        ## Toevoegen van een nieuwe todo-item
        if 'toevoegen' in request.form:
            ti.add_to_todo(request.form['toevoegen'], user_id,
                           datetime.fromisoformat(
                               request.form['toevoegen_date']))

            # verwijderen van een todo-item
        elif 'todo_delete' in request.form:
            ti.delete_todo(request.form['todo_delete'])
            remove_todo_socketio(request.form['todo_delete'])

            # Todo-naar done maken
        elif 'todo_done' in request.form:
            ti.change_todo_to_done(request.form['todo_done'], True)

            # Todo terug naar todo maken
        elif 'todo_done_back' in request.form:
            ti.change_todo_to_done(request.form['todo_done_back'], False)

        if 'todo_edit_date' in request.form:
            ti.change_todo_date(request.form['todo_id'],
                                datetime.fromisoformat(
                                    request.form['todo_edit_date']
                                                        )
                                )

        if 'todo_edit_text' in request.form:
            ti.change_todo_text(request.form['todo_id'],
                                request.form['todo_edit_text']
                                )
    update_todo_list_socketio()

    return 'succes: ' + str(request.form)


@app.route('/login', methods=['GET', 'POST'])
def login_page():
    melding = ''
    username = ''
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        stmt = select(User).where(User.name.in_([username]))
        for user in sdb.scalars(stmt):
            print(user.name)
            if username == username and user.check_password(password):
                homepage()
                return
                # return render_template('index.html', todolist=[], todolistdone=[])
            else:
                melding = 'Username or password is incorrect'
    return render_template('login.html', melding=melding, username=username)


@app.route('/agenda', methods=['GET', 'POST'])
def agenda_page():

    return render_template('agenda.html')


@app.route('/updateagenda', methods=['POST'])
def update_agenda():
    update_todo_list_socketio_agenda()
    return 'succes update agenda: ' + str(request.form)


if __name__ == '__main__':
    ##startup session
    socketio.run(app, host="0.0.0.0", allow_unsafe_werkzeug=True, debug=True, port=80)
